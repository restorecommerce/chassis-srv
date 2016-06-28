'use strict';

const util = require('util');
const loadBalancerLib = require('../loadbalancer');
const chainMiddleware = require('../endpoint').chain;
const co = require('co');
const assertTimeout = require('co-assert-timeout');
const _ = require('lodash');
const EventEmitter = require('events').EventEmitter;
const configuration = require('../config');
const Logger = require('restore-logger');

// loadbalancers
const loadBalancers = {};

function registerLoadBalancer(name, provider) {
  loadBalancers[name] = provider;
}
module.exports.registerLoadBalancer = registerLoadBalancer;

function makeRoundRobinLB(config, publisher, logger) {
  return loadBalancerLib.roundRobin(publisher, logger);
}

function makeRandomLB(config, publisher, logger) {
  const seed = config.seed || Math.random();
  return loadBalancerLib.random(publisher, seed, logger);
}
registerLoadBalancer('roundRobin', makeRoundRobinLB);
registerLoadBalancer('random', makeRandomLB);

// publishers
const publishers = {};

/**
 * register endpoint publishers
 *
 * @param  {string} name     Publisher name
 * @param  {generator} provider generator which can be iterated
 */
function registerPublisher(name, provider) {
  publishers[name] = provider;
}
module.exports.registerPublisher = registerPublisher;
// register default publishers
function makeStaticPublisher(config, factory, logger) {
  return loadBalancerLib.staticPublisher(config.instances, factory, logger);
}
registerPublisher('static', makeStaticPublisher);

// transport providers
const transportProviders = {};

/**
 * register a transport
 *
 * @param  {string} name      transport identifier
 * @param  {constructor} transport Transport provider constructor
 */
function registerTransport(name, transport) {
  transportProviders[name] = transport;
}
module.exports.registerTransport = registerTransport;
// register default transport providers
const grpc = require('../transport/provider/grpc');
registerTransport(grpc.Name, grpc.Client);
const pipe = require('../transport/provider/pipe');
registerTransport(pipe.Name, pipe.Client);

function* getEndpoint(loadBalancer) {
  return yield (co(function* getEndpointFromLB() {
    const lb = loadBalancer.next();
    if (lb.done) {
      throw new Error('no endpoints');
    }
    return lb.value;
  }).catch((err) => {
    throw err;
  }));
}

// handles retries, timeout, middleware, calling the loadBalancer and errors
function makeServiceEndpoint(name, middleware, loadBalancer, logger) {
  const e = function* handleRetryAndMiddleware(request, options) {
    let attempts = 1;
    if (options && options.retry) {
      attempts += options.retry;
    }
    const errs = [];
    const context = Object.assign(options || {}, {
      endpointName: name,
      attempts,
      currentAttempt: 1,
    });
    logger.debug(
      util.format('calling endpoint with request %j', request));
    for (let i = 1; i <= attempts; i++) {
      context.currentAttempt = i;
      logger.debug(
        util.format('attempt %d/%d calling endpoint with request %j',
          i, attempts, request));
      try {
        let endpoint = yield getEndpoint(loadBalancer);
        if (middleware.length !== 0) {
          const chain = chainMiddleware(middleware);
          endpoint = yield chain(endpoint);
        }
        const result = yield endpoint(request, context);
        if (result.write || result.read) {
          return result;
        }
        if (result.error) {
          switch (result.error.message) {
            case 'unimplemented':
            case 'resource exhausted':
            case 'unknown':
            case 'internal':
            case 'unavailable':
            case 'data loss':
              logger.error(
                util.format('attempt %d/%d error: %s',
                  i, attempts, result.error));
              errs.push(result.error);
              // retry
              continue;
            default:
              return yield result;
          }
        }
        return yield result;
      } catch (err) {
        logger.error(
          util.format('attempt %d/%d error: %s', i, attempts, err.stack));
        errs.push(err);
        if (err.message === 'call timeout') {
          logger.debug(
            util.format('attempt %d/%d returning with call timeout',
              i, attempts));
          return {
            error: errs,
          };
        }
      }
    }
    return {
      error: errs,
    };
  };
  return function* handleTimeout(req, options) {
    if (options && options.timeout) {
      const gen = e(req, options);
      return yield co(function* checkTimeout() {
        return yield assertTimeout(gen, options.timeout);
      }).catch((error) => {
        if (error.status === 408) {
          const err = new Error('call timeout');
          const res = gen.throw(err);
          return res.value;
        }
        return {
          error,
        };
      });
    }
    return yield co(function* callEndpoint() {
      return yield e(req, options);
    }).catch((err) => {
      return {
        error: err,
      };
    });
  };
}

// returns a factory which turns an instance into an endpoint via a transport provider
function generalFactory(method, transports, logger) {
  return function* makeEndpoints(instance) {
    for (let i = 0; i < transports.length; i++) {
      try {
        const endpoint = yield* transports[i].makeEndpoint(method, instance);
        return endpoint;
      } catch (e) {
        logger.debug('generalFactory transport.makeEndpoint',
          method, transports[i].name, instance, e);
      }
    }
    throw new Error('no endpoint');
  };
}

class Client extends EventEmitter {
  /**
 * Client is a microservice client.
 *
 * @param {Object} name Name of the configured client.
 */
  constructor(name, config, logger) {
    super();
    if (_.isNil(config)) {
      const cfg = configuration.get(logger);
      if (!cfg) {
        throw new Error('no configuration found');
      }
      this.$config = cfg.get(util.format('client:%s', name));
      if (!this.$config) {
        throw new Error(util.format('no client:%s config', name));
      }
    } else {
      this.$config = config;
    }
    // check config
    if (!this.$config.endpoints || _.keys(this.$config.endpoints).length === 0) {
      throw new Error('no endpoints configured');
    }
    if (!this.$config.transports || _.keys(this.$config.transports).length === 0) {
      throw new Error('no transports configured');
    }

    if (_.isNil(logger)) {
      // logger
      if (!this.$config.logger) {
        this.$config.logger = {
          console: {
            handleExceptions: false,
            level: 'silly',
            colorize: true,
            prettyPrint: true,
          },
        };
      }
      const loggerCfg = {
        value: this.$config.logger,
        get() {
          return this.value;
        },
      };
      this.logger = new Logger(loggerCfg);
    } else {
      this.logger = logger;
    }

    // transport
    const log = this.logger;
    const transports = [];
    _.forIn(this.$config.transports, (transportConfig, transportName) => {
      const Transport = transportProviders[transportName];
      if (!Transport) {
        log.error(
          util.format('transport %s does not exist', transportName));
        return;
      }
      try {
        const provider = new Transport(transportConfig, log);
        transports.push(provider);
      } catch (e) {
        log.error(e.stack);
      }
    });
    if (transports.length === 0) {
      throw new Error('no transports properly configured');
    }
    this.$transports = transports;

    // detect global loadbalancer
    let defaultLoadBalancer = loadBalancers.roundRobin;
    if (this.$config.loadbalancer) {
      defaultLoadBalancer = loadBalancers[this.$config.loadbalancer.name];
    }

    // detect global publisher
    let defaultPublisher;
    if (this.$config.publisher) {
      defaultPublisher = publishers[this.$config.publisher.name];
      if (!defaultPublisher) {
        this.logger.error(
          util.format('publisher %s does not exist', this.$config.publisher.name));
      }
    }

    // setup endpoints
    this.$endpoints = {};
    _.forIn(this.$config.endpoints, (endpointConfig, endpointName) => {
      // publisher
      let publisher = defaultPublisher;
      let publisherCfg = this.$config.publisher;
      if (endpointConfig.publisher && endpointConfig.publisher.name) {
        publisher = publishers[endpointConfig.publisher.name];
        publisherCfg = endpointConfig.publisher;
      }
      if (!publisher) {
        if (!publisherCfg) {
          this.logger.error(
            util.format('publisher configuration for endpoint %s does not exist',
              endpointName));
          return;
        }
        this.logger.error(
          util.format('publisher %s does not exist', publisherCfg.name));
        return;
      }

      // loadBalancer
      let loadBalancer = defaultLoadBalancer;
      let loadBalancerCfg = this.$config.loadbalancer;
      if (endpointConfig.loadbalancer && endpointConfig.loadbalancer.name) {
        loadBalancer = loadBalancers[endpointConfig.loadbalancer.name];
        loadBalancerCfg = endpointConfig.loadbalancer;
      }
      if (!loadBalancer) {
        if (!loadBalancerCfg) {
          this.logger.error(
            util.format('loadBalancer endpoint configuration %s does not exist',
              endpointName));
          return;
        }
        this.logger.error(
          util.format('loadbalancer %s does not exist', loadBalancerCfg.name));
        return;
      }

      this.$endpoints[endpointName] = {
        publisher, // publisher(config, factory)
        publisherConfig: publisherCfg,
        loadBalancer, // loadBalancer(config, publisher)
        loadBalancerConfig: loadBalancerCfg,
      };
    });
    if (Object.keys(this.$endpoints).length === 0) {
      throw new Error('no endpoints properly configured');
    }

    /**
     * A list of middleware which gets called before the endpoint.
     * The endpoint includes [retry, timeout], publisher, loadBalancer, transport.
     *
     * @type {Array}
     */
    this.middleware = [];
  }

  /**
   * Connect to the provided endpoints via specified transports.
   *
   * @return {Object} Service with endpoint methods.
   */
  *connect() {
    const logger = this.logger;
    const transports = this.$transports;
    const endpoints = this.$endpoints;
    const middleware = this.middleware;
    const s = yield co(function* createService() {
      const service = {};
      _.forIn(endpoints, (e, name) => {
        const factory = generalFactory(name, transports, logger);
        const publisher = e.publisher(e.publisherConfig, factory, logger);
        const loadBalancer = e.loadBalancer(e.loadBalancerConfig, publisher, logger);
        service[name] = makeServiceEndpoint(name, middleware, loadBalancer, logger);
      });
      logger.verbose('gRPC service ready', service);
      return service;
    });
    this.emit('connected', s);
    return s;
  }

  *end() {
    for (let i = 0; i < this.$transports.length; i++) {
      const transport = this.$transports[i];
      yield transport.end();
    }
    this.emit('disconnected');
  }
}

module.exports.Client = Client;

'use strict';

var util = require('util');
var loadBalancerLib = require('../loadbalancer');
var chainMiddleware = require('../endpoint').chain;
var co = require('co');
var Logger = require('restore-logger');

// loadbalancers
var loadBalancers = {};

function registerLoadBalancer(name, provider) {
  loadBalancers[name] = provider;
}
module.exports.registerLoadBalancer = registerLoadBalancer;

function makeRoundRobinLB(config, publisher, logger) {
  return loadBalancerLib.roundRobin(publisher, logger);
}

function makeRandomLB(config, publisher, logger) {
  let seed = config.seed || Math.random();
  return loadBalancerLib.random(publisher, seed, logger);
}
registerLoadBalancer('roundRobin', makeRoundRobinLB);
registerLoadBalancer('random', makeRandomLB);

// publishers
var publishers = {};

/**
 * register endpoint publishers
 * @param  {string} name     Publisher name
 * @param  {function*} provider generator which can be iterated
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

// transports
var transports = {};

/**
 * register a transport
 * @param  {string} name      transport identifier
 * @param  {constructor} transport Transport provider constructor
 */
function registerTransport(name, transport) {
  transports[name] = transport;
}
module.exports.registerTransport = registerTransport;
// register default transport providers
let grpc = require('../transport/grpc');
registerTransport(grpc.Name, grpc.Client);

/**
 * Client is a microservice client.
 * @param {Object} config Configuration object.
 */
function Client(config) {
  // logger
  if (!config.logger) {
    config.logger = {
      console: {
        handleExceptions: false,
        level: "silly",
        colorize: true,
        prettyPrint: true,
      },
    };
  }
  let loggerCfg = {
    value: config.logger,
    get: function() {
      return this.value;
    },
  };
  this.logger = new Logger(loggerCfg);

  // check config
  if (!config.endpoints) {
    throw new Error('no endpoints configured');
  }
  if (!config.transports) {
    throw new Error('no transports configured');
  }

  // transport
  let transportProviders = [];
  for (let name in config.transports) {
    let transport = transports[name];
    if (!transport) {
      this.logger.log('ERROR', util.format('transport %s does not exist', name));
      continue;
    }
    try {
      let provider = new transport(config.transports[name]);
      transportProviders.push(provider);
    } catch (e) {
      this.logger.log('ERROR', e);
    }
  }
  if (transportProviders.length === 0) {
    throw new Error('no transports properly configured');
  }
  this._transports = transportProviders;

  // setup endpoints
  this._endpoints = {};
  for (let name in config.endpoints) {
    let endpointCfg = config.endpoints[name];
    if (!endpointCfg.publisher || !endpointCfg.publisher.name) {
      this.logger.log('ERROR', util.format('endpoint %s has no configured publisher', name));
      continue
    }

    // publisher
    let publisher = publishers[endpointCfg.publisher.name];
    if (!publisher) {
      this.logger.log('ERROR', util.format("publisher %s does not exist", endpointCfg.publisher.name));
      continue
    }

    // loadBalancer
    let loadBalancer = loadBalancers.roundRobin;
    if (endpointCfg.loadbalancer && endpointCfg.loadbalancer.name) {
      loadBalancer = loadBalancers[endpointCfg.loadbalancer.name];
    } else {
      this.logger.log('ERROR', util.format('endpoint %s does not have a configured loadbalancer, using roundRobin', name));
    }
    if (!loadBalancer) {
      this.logger.log('ERROR', util.format('loadbalancer %s does not exist', endpointCfg.loadbalancer.name));
      continue
    }

    this._endpoints[name] = {
      publisher: publisher, // publisher(config, factory)
      publisherConfig: endpointCfg.publisher,
      loadBalancer: loadBalancer, // loadBalancer(config, publisher)
      loadBalancerConfig: endpointCfg.loadbalancer,
    };
  }
  if (Object.keys(this._endpoints).length === 0) {
    throw new Error('no endpoints properly configured');
  }
}

/**
 * A list of middleware which gets called before the endpoint.
 * @type {Array}
 */
Client.prototype.middleware = [];

// handles retries, timeout, middleware, calling the loadBalancer and errors
function makeServiceEndpoint(middleware, loadBalancer, logger) {
  let e = function*(request, options) {
    if (!request) throw new ReferenceError('request is undefined');
    // FIXME This generator is called in a loop when gRPC does not call the callback function
    // This happens if the gRPC error code is: INTERNAL and some other codes which indicate a server error, not an input error
    let attempts = 1;
    if (options && options.retry) {
      attempts += options.retry;
    }
    let errs = [];
    let context = {
      attempts: attempts,
      currentAttempt: 1,
    };
    logger.log('DEBUG', util.format('calling endpoint with request %j', request));
    for (let i = 1; i <= attempts; i++) {
      context.currentAttempt = i;
      logger.log('DEBUG', util.format('attempt %d/%d calling endpoint with request %j', i, attempts, request));
      try {
        let lb = loadBalancer.next();
        if (lb.done) {
          throw new Error('no endpoints');
        }
        let endpoint = lb.value;
        let chain = chainMiddleware(middleware);
        endpoint = yield chain(endpoint)
        let result = yield endpoint(request, context);
        if (result.error) {
          switch (result.error.message) {
            case 'unimplemented':
            case 'resource exhausted':
            case 'unknown':
            case 'internal':
            case 'unavailable':
            case 'data loss':
              logger.log('ERROR', util.format('attempt %d/%d error: %s', i, attempts, result.error));
              errs.push(result.error);
              // retry
              continue
          }
        }
        return yield result;
      } catch (err) {
        logger.log('ERROR', util.format('attempt %d/%d error: %s', i, attempts, err));
        if (err.message === 'call timeout') {
          logger.log('DEBUG', util.format('attempt %d/%d returning with call timeout', i, attempts));
          return {
            error: err,
          };
        }
        errs.push(e);
      }
    }
    return yield {
      error: errs,
    };
  }
  return function*(req, options) {
    if (options && options.timeout) {
      return yield co(function*() {
        let gen = e(req, options);
        let errResult;
        let id = setTimeout(function() {
          let t = gen.throw(new Error('call timeout'));
          errResult = t.value;
        }, options.timeout);
        let res = yield gen;
        clearTimeout(id);
        if (errResult) { // If generator was thrown, see timeout
          return errResult;
        }
        return res;
      }).catch(function(err) {
        return {
          error: err,
        };
      });
    }
    return yield co(function*(){
      return yield e(req, options);
    }).catch(function(err){
      return {
        error: err,
      };
    });
  }
}

// returns a factory which turns an instance into an endpoint via a transport provider
function generalFactory(method, transports, logger) {
  return function*(instance) {
    for (let i = 0; i < transports.length; i++) {
      try {
        let endpoint = yield * transports[i].makeEndpoint(method, instance);
        return endpoint;
      } catch (e) {
        logger.log('DEBUG', 'generalFactory transport.makeEndpoint', e);
      }
    }
    throw new Error('no endpoint');
  }
}

/**
 * Connect to the provided endpoints via specified transports.
 * @return {Object} Service with endpoint methods.
 */
Client.prototype.connect = function*() {
  let self = this;
  return yield co(function*() {
    let service = {};
    for (let name in self._endpoints) {
      let e = self._endpoints[name];
      let factory = generalFactory(name, self._transports, self.logger);
      let publisher = e.publisher(e.publisherConfig, factory, self.logger);
      let loadBalancer = e.loadBalancer(e.loadBalancerConfig, publisher, self.logger);
      service[name] = makeServiceEndpoint(self.middleware, loadBalancer, self.logger);
    }
    return service;
  });
}

module.exports.Client = Client;

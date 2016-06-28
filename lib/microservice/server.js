'use strict';

const util = require('util');
const co = require('co');
const chainMiddleware = require('../endpoint').chain;
const configuration = require('../config');
const Logger = require('restore-logger');
const _ = require('lodash');
const EventEmitter = require('events').EventEmitter;

const transports = {};

/**
 * register transport provider
 *
 * @param  {string} name     transport provider identifier
 * @param  {constructor} provider transport provider constructor function
 */
function registerTransport(name, provider) {
  transports[name] = provider;
}
module.exports.registerTransport = registerTransport;

// register included providers
const grpc = require('../transport/provider/grpc');
registerTransport('grpc', grpc.Server);
const pipe = require('../transport/provider/pipe');
registerTransport(pipe.Name, pipe.Server);

/**
 * initializes all configured transports
 * @param  {object} config Configuration
 * @param  {object} logger
 * @return {object} Transport
 */
function setupTransport(config, logger) {
  const transport = {};
  logger.debug('available transport providers',
    Object.keys(transports).join(','));
  for (let i = 0; i < config.length; i++) {
    const transportCfg = config[i];
    const providerName = transportCfg.provider;
    if (_.isNil(providerName)) {
      throw new Error('transport configuration without a provider');
    }
    const transportName = transportCfg.name;
    if (_.isNil(providerName)) {
      throw new Error('transport configuration without a name');
    }
    const TransportProvider = transports[providerName];
    if (_.isNil(TransportProvider)) {
      throw new Error(`transport provider ${providerName} does not exist`);
    }
    const provider = new TransportProvider(transportCfg, logger);
    transport[transportName] = provider;
  }
  logger.debug('using transports', Object.keys(transport).join(','));
  return transport;
}

// calls middleware and business logic
function makeEndpoint(middleware, service, transportName, methodName, logger) {
  return function* callEndpoint(request, context) {
    const ctx = context || {};
    ctx.transport = transportName;
    ctx.method = methodName;
    ctx.logger = logger;
    let e;
    if (middleware.length > 0) {
      const chain = chainMiddleware(middleware);
      e = yield chain(service[methodName].bind(service));
    } else {
      e = service[methodName].bind(service);
    }
    try {
      logger.verbose(
        util.format('received request to method %s over transport %s',
          ctx.method, ctx.transport), request);
      const result = yield e(request, ctx);
      logger.verbose(
        util.format('request to method %s over transport %s result',
          ctx.method, ctx.transport), request, result);
      return result;
    } catch (err) {
      if (err instanceof SyntaxError || err instanceof RangeError ||
        err instanceof ReferenceError || err instanceof TypeError) {
        logger.error(
          util.format('request to method %s over transport %s error',
            ctx.method, ctx.transport), request, err.stack);
      } else {
        logger.info(
          util.format('request to method %s over transport %s error',
            ctx.method, ctx.transport), request, err);
      }
      throw err;
    }
  };
}

function shutdown(server) {
  return () => {
    server.logger.info('signal SIGINT received');
    co(function* end() {
      yield server.end();
      process.exit(0);
    }).catch((err) => {
      server.logger.error(err);
      process.exit(1);
    });
  };
}

/**
 * Server is a microservice server chassis.
 * It enables business logic to be accessed over transports and listen to events.
 * Default event providers: 'kafka'
 * Default transports: 'grpc'
 */
class Server extends EventEmitter {
  constructor(config, logger) {
    super();
    if (_.isNil(config)) {
      const cfg = configuration.get(logger);
      if (!cfg) {
        throw new Error('no configuration found');
      }
      this.$config = cfg.get('server');
      if (!this.$config) {
        throw new Error('no server configuration found');
      }
    } else {
      this.$config = config;
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

    // services
    this.logger.debug('setting up service endpoints');
    if (!this.$config.services || !this.$config.transports) {
      if (this.$config.events) {
        if (this.$config.transports) {
          this.logger.warn('missing endpoints configuration');
        }
        if (this.$config.services) {
          this.logger.warn('missing services configuration');
        }
        return;
      }
      if (this.$config.transports && this.$config.transports.length > 0) {
        throw new Error('missing services configuration');
      }
      if (this.$config.services) {
        throw new Error('missing transports configuration');
      }
      throw new Error('missing server configuration');
    }

    // transports
    this.logger.debug('setting up transports');
    try {
      this.transport = setupTransport(this.$config.transports, this.logger);
    } catch (error) {
      this.logger.error('setupTransports', error);
      throw error;
    }

    /**
     * Requests will traverse the middlewares in the order they're declared.
     * That is, the first middleware is called first.
     *
     * @type {Array.<generator>}
     */
    this.middleware = [];

    // signals
    // TODO React to more signals
    // TODO Make it configurable
    // listen to SIGINT signals
    process.on('SIGINT', shutdown(this));
  }

  /**
   * bind connects the service to configured transports.
   *
   * @param  {string} name Service name.
   * @param  {object} service A business logic service.
   */
  *bind(name, service) {
    if (_.isNil(name)) {
      throw new Error('missing argument name');
    }
    if (!_.isString(name)) {
      throw new Error('argument name is not of type string');
    }
    if (_.isNil(service)) {
      throw new Error('missing argument service');
    }
    const serviceCfg = this.$config.services[name];
    if (!serviceCfg) {
      throw new Error(`configuration for ${name} does not exist`);
    }

    const transportNames = Object.keys(this.transport);

    // endpoints
    const logger = this.logger;
    const endpoints = {};
    Object.keys(serviceCfg).forEach((endpointName) => {
      const endpointCfg = serviceCfg[endpointName];
      if (_.isNil(endpointCfg)) {
        logger.error(`configuration for service
        ${name} endpoint ${endpointName} does not exist`);
        return;
      }
      for (let i = 0; i < endpointCfg.transport.length; i++) {
        const transportName = endpointCfg.transport[i];
        if (!endpoints[transportName]) {
          endpoints[transportName] = [];
        }
        if (!_.includes(transportNames, transportName)) {
          logger.warn(`transport ${transportName} does not exist`, {
            service: name,
            method: endpointName,
          });
          continue;
        }
        endpoints[transportName].push(endpointName);
      }
    });
    logger.debug('endpoints', endpoints);

    logger.debug('binding endpoints to transports');
    const middleware = this.middleware;
    const transport = this.transport;
    for (let i = 0; i < transportNames.length; i++) {
      const transportName = transportNames[i];
      const provider = transport[transportName];
      const methodNames = endpoints[transportName];
      if (!methodNames) {
        logger.verbose(
          util.format('transport %s does not have any endpoints configured',
            transportName));
        continue;
      }
      const binding = {};
      for (let j = 0; j < methodNames.length; j++) {
        const methodName = methodNames[j];
        if (!_.isFunction(service[methodName])) {
          logger.warn(
            util.format('endpoint %s does not have matching service method',
              methodName));
          continue;
        }
        const methodCfg = serviceCfg[methodName];
        if (_.isNil(methodCfg)) {
          logger.error(`endpoint ${name}.${methodName} does not have configuration`);
          continue;
        }
        if (!_.includes(methodCfg.transport, transportName)) {
          logger.error(`endpoint ${name}.${methodName} 
        is not configured for transport ${transportName}, skipping endpoint binding`);
          continue;
        }
        binding[methodName] = makeEndpoint(middleware,
          service, transportName, methodName, logger);
        logger.debug(
          util.format('endpoint %s bound to transport %s', methodName, transportName));
      }
      if (_.size(_.functions(binding)) === 0) {
        logger.verbose(`service ${name} has no endpoints configured 
      for transport ${transportName}, skipping service binding`);
        continue;
      }
      yield provider.bind(name, binding);
      this.emit('bound', name, binding, provider);
    }
  }

  /**
   * start launches the server by starting transports and listening to events.
   */
  *start() {
    const transportNames = Object.keys(this.transport);
    for (let i = 0; i < transportNames.length; i++) {
      const name = transportNames[i];
      const provider = this.transport[name];
      yield provider.start();
      this.logger.info(util.format('transport %s started', name));
    }
    this.emit('serving', this.transport);
  }

  *end() {
    const transportNames = Object.keys(this.transport);
    for (let i = 0; i < transportNames.length; i++) {
      const name = transportNames[i];
      if (this.transport[name].end) {
        yield this.transport[name].end();
      }
    }
    this.emit('stopped', this.transport);
  }
}

module.exports.Server = Server;

'use strict';

const util = require('util');
const co = require('co');
const Events = require('../events').Events;
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

const eventProviders = {};

/**
 * register event provider
 *
 * @param  {string} name     Event provider identifier
 * @param  {constructor} provider Event provider constructor function
 */
function registerEventProvider(name, provider) {
  eventProviders[name] = provider;
}
module.exports.registerEventProvider = registerEventProvider;

// register included providers
const Kafka = require('../events/provider/kafka').Kafka;
registerEventProvider('kafka', Kafka);
const Local = require('../events/provider/local').Local;
registerEventProvider('local', Local);
const Grpc = require('../transport/provider/grpc').Server;
registerTransport('grpc', Grpc);

/**
 * initializes configured event provider
 *
 * @param  {object} config Configuration
 * @param  {object} logger
 * @return {Events}
 */
function setupEvents(config, logger) {
  if (!_.has(config, 'provider')) {
    throw new Error('config does not have event provider configured');
  }
  if (!_.has(config, 'provider.name')) {
    throw new Error('config does not have event provider name configured');
  }
  const providerConfig = config.provider;
  const name = providerConfig.name;
  const EventProvider = eventProviders[name];
  if (!EventProvider) {
    logger.error('event provider not registered', name);
    return null;
  }
  logger.debug('using event provider', name);
  try {
    const provider = new EventProvider(providerConfig, logger);
    provider.name = name;
    return new Events(provider);
  } catch (e) {
    logger.error(util.format('event provider %s error', name));
    throw e;
  }
}

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

util.inherits(Server, EventEmitter);

/**
 * Server is a microservice server chassis.
 * It enables business logic to be accessed over transports and listen to events.
 * Default event providers: 'kafka'
 * Default transports: 'grpc'
 */
function Server(config, logger) {
  EventEmitter.call(this);

  /* eslint consistent-this: ["error", "that"]*/
  const that = this;

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

  // events
  this.logger.debug('setting up events');
  if (this.$config.events) {
    this.events = setupEvents(this.$config.events, that.logger);
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
  this.transport = setupTransport(this.$config.transports, that.logger);

  // signals
  // TODO React to more signals
  // TODO Make it configurable
  // listen to SIGINT signals
  process.on('SIGINT', () => {
    that.logger.info('signal SIGINT received');
    co(function* end() {
      yield that.end();
      process.exit(0);
    }).catch((err) => {
      that.logger.error(err);
      process.exit(1);
    });
  });
}

/**
 * Requests will traverse the middlewares in the order they're declared.
 * That is, the first middleware is called first.
 *
 * @type {Array.<generator>}
 */
Server.prototype.middleware = [];

// calls middleware and business logic
function makeEndpoint(server, service, transportName, methodName, logger) {
  return function* callEndpoint(request, context) {
    const ctx = context || {};
    ctx.transport = transportName;
    ctx.method = methodName;
    ctx.logger = logger;
    let e;
    if (server.middleware.length > 0) {
      const chain = chainMiddleware(server.middleware);
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

/**
 * bind connects the service to configured transports.
 *
 * @param  {string} name Service name.
 * @param  {object} service A business logic service.
 */
Server.prototype.bind = function* bind(name, service) {
  if (_.isNil(name)) {
    throw new Error('missing argument name');
  }
  if (!_.isString(name)) {
    throw new Error('argument name is not of type string');
  }
  if (_.isNil(service)) {
    throw new Error('missing argument service');
  }
  /* eslint consistent-this: ["error", "that"]*/
  const that = this;

  if (!this.$config.services) {
    return;
  }

  const serviceCfg = this.$config.services[name];
  if (!serviceCfg) {
    throw new Error(`configuration for ${name} does not exist`);
  }

  // endpoints
  const endpoints = {};
  Object.keys(serviceCfg).forEach((endpointName) => {
    const endpointCfg = serviceCfg[endpointName];
    if (_.isNil(endpointCfg)) {
      that.logger.error(`configuration for service
        ${name} endpoint ${endpointName} does not exist`);
      return;
    }
    for (let i = 0; i < endpointCfg.transport.length; i++) {
      const transportName = endpointCfg.transport[i];
      if (!endpoints[transportName]) {
        endpoints[transportName] = [];
      }
      endpoints[transportName].push(endpointName);
    }
  });
  that.logger.debug('endpoints', endpoints);

  // transport
  if (!that.transport) {
    that.logger.warn(
      'no transports found, skipping binding endpoints');
    return;
  }

  that.logger.debug('binding endpoints to transports');
  const props = Object.keys(that.transport);
  for (let i = 0; i < props.length; i++) {
    const transportName = props[i];
    const provider = that.transport[transportName];
    const methodNames = endpoints[transportName];
    if (!methodNames) {
      that.logger.warn(
        util.format('transport %s does not have any endpoints configured',
          transportName));
      yield provider.bind({});
      this.emit('bound', {}, provider);
      continue;
    }
    const binding = {};
    for (let j = 0; j < methodNames.length; j++) {
      const methodName = methodNames[j];
      if (!_.isFunction(service[methodName])) {
        that.logger.warn(
          util.format('endpoint %s does not have matching service method',
            methodName));
        continue;
      }
      binding[methodName] = makeEndpoint(that,
        service, transportName, methodName, that.logger);
      that.logger.debug(
        util.format('endpoint %s bound to transport %s', methodName, transportName));
    }
    yield provider.bind(binding);
    this.emit('bound', binding, provider);
  }
};

/**
 * start launches the server by starting transports and listening to events.
 */
Server.prototype.start = function* start() {
  // events
  if (this.events) {
    yield this.events.provider.start();
    this.logger.info(
      util.format('event provider %s started', this.events.provider.name));
    this.emit('listening', this.events);
  }

  // transport
  if (!this.transport) {
    return;
  }
  const transportNames = Object.keys(this.transport);
  for (let i = 0; i < transportNames.length; i++) {
    const name = transportNames[i];
    const provider = this.transport[name];
    yield provider.start();
    this.logger.info(util.format('transport %s started', name));
  }
  this.emit('serving', this.transport);
};

Server.prototype.end = function* end() {
  if (this.events) {
    // shutdown event provider
    yield this.events.provider.end();
  }
  if (this.transport) {
    const transportNames = Object.keys(this.transport);
    for (let i = 0; i < transportNames.length; i++) {
      const name = transportNames[i];
      if (this.transport[name].end) {
        yield this.transport[name].end();
      }
    }
    this.emit('stopped', this.transport);
  }
};

module.exports.Server = Server;

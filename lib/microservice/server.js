'use strict';

var util = require('util');
var co = require('co');
var Events = require('../events').Events;
var chainMiddleware = require('../endpoint').chain;
var configuration = require('../config');
var Logger = require('restore-logger');
var _ = require('lodash');

var transports = {};

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

var eventProviders = {};

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
let Kafka = require('../events/provider/kafka').Kafka;
registerEventProvider('kafka', Kafka);
let Grpc = require('../transport/provider/grpc').Server;
registerTransport('grpc', Grpc);

// initializes configured event provider
function setupEvents(config, logger) {
  if (!_.has(config, 'provider')) {
    throw new Error('config does not have event provider configured');
  }
  if (!_.has(config, 'provider.name')) {
    throw new Error('config does not have event provider name configured');
  }
  let providerConfig = config.provider;
  let name = providerConfig.name;
  let EventProvider = eventProviders[name];
  if (!EventProvider) {
    logger.error( 'event provider not registered', name);
    return;
  }
  logger.debug( 'using event provider', name);
  try {
    let provider = new EventProvider(providerConfig, logger);
    provider.name = name;
    return new Events(provider);
  } catch (e) {
    logger.error( util.format('event provider %s error', name));
    throw e;
  }
}

// initializes all configured transports
function setupTransport(config, logger) {
  let transport = {};
  logger.debug( 'available transport providers',
    Object.keys(transports).join(','));
  for (let i = 0; i < config.length; i++) {
    let transportCfg = config[i];
    let name = transportCfg.name;
    let TransportProvider = transports[name];
    if (!TransportProvider) {
      logger.error( 'transport not registered', name);
      return;
    }
    let provider = new TransportProvider(transportCfg, logger);
    transport[name] = provider;
  }
  logger.debug( 'using transports', Object.keys(transport).join(','));
  return transport;
}

/**
 * Server is a microservice server chassis.
 * It enables business logic to be accessed over transports and listen to events.
 * Default event providers: 'kafka'
 * Default transports: 'grpc'
 */
function Server() {
  var self = this;

  let cfg = configuration.get();
  if (!cfg) {
    throw new Error('no configuration found');
  }
  let config = cfg.get('server');
  if (!config) {
    throw new Error('no server configuration found');
  }
  this._config = config;

  // logger
  if (!config.logger) {
    config.logger = {
      console: {
        handleExceptions: false,
        level: 'silly',
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

  // events
  this.logger.debug( 'setting up events');
  if (config.events) {
    this.events = setupEvents(config.events, self.logger);
  }

  // endpoints
  this.logger.debug( 'setting up endpoints');
  if (!config.endpoints || !config.transports) {
    if (config.events) {
      if (config.transports) {
        this.logger.warn( 'missing endpoints configuration');
      }
      if (config.endpoints) {
        this.logger.warn( 'missing transport configuration');
      }
      return;
    }
    if (config.transports && config.transports.length > 0) {
      throw new Error('missing endpoints configuration');
    }
    if (config.endpoints) {
      throw new Error('missing transports configuration');
    }
    throw new Error('missing server configuration');
  }

  // transports
  this.logger.debug( 'setting up transports');
  this.transport = setupTransport(config.transports, self.logger);

  // signals
  // TODO React to more signals
  // TODO Make it configurable
  // listen to SIGINT signals
  process.on('SIGINT', function() {
    self.logger.info( 'signal', 'SIGINT');
    co(function*() {
      yield self.end();
      process.exit(0);
    }).catch(function(err) {
      self.logger.error( err);
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
  return function*(request, context) {
    if (!context) {
      context = {};
    }
    context.transport = transportName;
    context.method = methodName;
    context.logger = logger;
    let e;
    if (server.middleware.length > 0) {
      let chain = chainMiddleware(server.middleware);
      e = yield chain(service[methodName].bind(service));
    } else {
      e = service[methodName].bind(service);
    }
    try {
      logger.verbose(
        util.format('received request to method %s over transport %s',
          context.method, context.transport), request);
      let result = yield e(request, context);
      logger.verbose(
        util.format('request to method %s over transport %s result',
          context.method, context.transport), request, result);
      return result;
    } catch (err) {
      if (err instanceof SyntaxError || err instanceof RangeError ||
        err instanceof ReferenceError || err instanceof TypeError) {
        logger.error(
          util.format('request to method %s over transport %s error',
            context.method, context.transport), request, err.stack);
      } else {
        logger.info(
          util.format('request to method %s over transport %s error',
            context.method, context.transport), request, err);
      }
      throw err;
    }
  };
};

/**
 * bind connects the service to configured transports.
 *
 * @param  {object} service A business logic service.
 */
Server.prototype.bind = function*(service) {
  let self = this;

  if (!self._config.endpoints) {
    return;
  }

  // endpoints
  let endpoints = {};
  Object.keys(self._config.endpoints).forEach(function(name) {
    let endpoint = self._config.endpoints[name];
    for (let i = 0; i < endpoint.transport.length; i++) {
      let transportName = endpoint.transport[i];
      if (!endpoints[transportName]) {
        endpoints[transportName] = [];
      }
      endpoints[transportName].push(name);
    }
  });
  self.logger.debug( 'endpoints', endpoints);

  // transport
  if (!self.transport) {
    self.logger.warn(
      'no transports found, skipping binding endpoints');
    return;
  }

  self.logger.debug( 'binding endpoints to transports');
  let props = Object.keys(self.transport);
  for (let i = 0; i < props.length; i++) {
    let transportName = props[i];
    let provider = self.transport[transportName];
    let methodNames = endpoints[transportName];
    if (!methodNames) {
      self.logger.warn(
        util.format('transport %s does not have any endpoints configured',
          transportName));
      yield provider.bind({});
      continue;
    }
    let binding = {};
    for (let j = 0; j < methodNames.length; j++) {
      let name = methodNames[j];
      if (!_.isFunction(service[name])) {
        self.logger.warn(
          util.format('endpoint %s does not have matching service method',
            name));
        continue;
      }
      binding[name] = makeEndpoint(self,
        service, transportName, name, self.logger);
      self.logger.debug(
        util.format('endpoint %s bound to transport %s', name, transportName));
    }
    yield provider.bind(binding);
  }
};

/**
 * start launches the server by starting transports and listening to events.
 */
Server.prototype.start = function*() {
  let self = this;

  // events
  if (self.events) {
    yield this.events.provider.start();
    self.logger.info(
      util.format('event provider %s started', this.events.provider.name));
  }

  // transport
  if (!self.transport) {
    return;
  }
  let transportNames = Object.keys(self.transport);
  for (let i in transportNames) {
    let name = transportNames[i];
    let provider = self.transport[name];
    yield provider.start();
    self.logger.info( util.format('transport %s started', name));
  }
};

Server.prototype.end = function*() {
  if (this.events) {
    // shutdown event provider
    yield this.events.provider.end();
  }
  if (this.transport) {
    let transportNames = Object.keys(this.transport);
    for (let i = 0; i < transportNames.length; i++) {
      let name = transportNames[i];
      if (this.transport[name].end) {
        yield this.transport[name].end();
      }
    }
  }
};

module.exports.Server = Server;

'use strict';

let util = require('util');
let co = require('co');
let Events = require('../transport/events/events').Events;

var transports = {};

function registerTransport(name, provider) {
  transports[name] = provider;
}
module.exports.registerTransport = registerTransport;

var eventProviders = {};

function registerEventProvider(name, provider) {
  eventProviders[name] = provider;
}
module.exports.registerEventProvider = registerEventProvider;

// register included providers
let Kafka = require('../transport/events/kafka').Kafka;
registerEventProvider('kafka', Kafka);
let Grpc = require('../transport/grpc').Server;
registerTransport('grpc', Grpc);

function setupEvents(config, logger) {
  if (!config.provider) {
    logger.log('ERROR', 'no event provider configured');
    return;
  }
  let name = config.provider.name;
  let EventProvider = eventProviders[name];
  if (!EventProvider) {
    logger.log('ERROR', 'event provider not registered', name);
    return;
  }
  logger.log('DEBUG', 'using event provider', name);
  let providerConfig = config.provider.config;
  let provider = new EventProvider(providerConfig, logger);
  provider.name = name;
  return new Events(provider);
}

function setupTransport(config, logger) {
  let transport = {};
  logger.log('DEBUG', 'available transport providers', Object.keys(transports).join(','));
  for (let i in config) {
    let transportCfg = config[i];
    let name = transportCfg.name;
    let TransportProvider = transports[name];
    if (!TransportProvider) {
      logger.log('ERROR', 'transport not registered', name);
      return;
    }
    let provider = new TransportProvider(transportCfg.config);
    transport[name] = provider;
  }
  logger.log('DEBUG', 'using transports', Object.keys(transport).join(','));
  return transport;
}

/**
 * Server is a microservice server chassis.
 * It enables business logic to be accessed over transports and listen to events.
 * Default event providers: 'kafka'
 * Default transports: 'grpc'
 * @param {object} config Server configuration object.
 */
function Server(config) {
  var self = this;
  this._config = config;

  // logger
  // TODO Load logger
  let logger = {
    log: console.log,
  };
  this.logger = logger;

  // events
  logger.log('DEBUG', 'setting up events');
  if (config.events) {
    this.events = setupEvents(config.events, self.logger);
  }

  // endpoints
  logger.log('DEBUG', 'setting up endpoints');
  if (!config.endpoints) {
    if (config.transports && config.transports.length > 0) {
      self.logger.log('WARNING', 'transports configured but no endpoints configured, disabling transports');
    }
    return;
  }

  // transports
  logger.log('DEBUG', 'setting up transports');
  if (config.transports) {
    this.transport = setupTransport(config.transports, self.logger);
  }

  // signals
  // TODO React to more signals
  // TODO Make it configurable
  // listen to SIGINT signals
  process.on('SIGINT', function() {
    self.logger.log('INFO', 'signal', 'SIGINT');
    co(function*() {
      if (self.events) {
        // shutdown event provider
        yield self.events.provider.end();
      }
      if (self.transport) {
        let transportNames = Object.keys(self.transport);
        for (let i = 0; i < transportNames.length; i++) {
          let name = transportNames[i];
          if (self.transport[name].end) {
            yield self.transport[name].end();
          }
        }
      }
      process.exit(0);
    }).catch(function(err) {
      self.logger.log('ERROR', err);
      process.exit(1);
    });
  });
}

/**
 * Requests will traverse the middlewares in the order they're declared.
 * That is, the first middleware is called first.
 * @type {Array.<function*(request)>}
 */
Server.prototype.middleware = [];

Server.prototype._callMiddleware = function*(req) {
  for (let i = 0; i < this.middleware.length; i++) {
    req = yield this.middleware[i](req);
  }
  return req;
}

function makeEndpoint(server, endpoint, transportName, methodName) {
  return function* (request) {
    try {
      let req = {
        transport: transportName,
        method: methodName,
        request: request,
      };
      req = yield server._callMiddleware(req);
      let args = [];
      Object.keys(request).forEach(function(key) {
        args.push(request[key]);
      });
      return yield endpoint.apply(null, args);
    } catch (err) {
      server.logger.log('ERROR', err);
    }
  }
}

/**
 * bind connects the service to configured transports.
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
  self.logger.log('DEBUG', 'endpoints', endpoints);

  // transport
  if (!self.transport) {
    self.logger.log('WARNING', 'no transports found, skipping binding endpoints');
    return;
  }

  self.logger.log('DEBUG', 'binding endpoints to transports');
  let props = Object.keys(self.transport);
  for (let i = 0; i < props.length; i++) {
    let transportName = props[i];
    let provider = self.transport[transportName];
    let methodNames = endpoints[transportName];
    if (!methodNames) {
      self.logger.log('WARNING', util.format('configured transport %s does not have any endpoints configured, binding empty service', transportName));
      yield provider.bind({});
      continue
    }
    let binding = {};
    for (let j = 0; j < methodNames.length; j++) {
      let name = methodNames[j];
      if ((typeof(service[name]) !== 'function')) {
        self.logger.log('WARNING', util.format('configured endpoint %s does not have matching service method', name));
        continue
      }
      binding[name] = makeEndpoint(self, service[name], transportName, name);
      self.logger.log('DEBUG', util.format('endpoint %s bound to transport %s', name, transportName));
    }
    yield provider.bind(binding);
  }
}

/**
 * start launches the server by starting transports and listening to events.
 */
Server.prototype.start = function*() {
  let self = this;

  // events
  if (self.events) {
    yield this.events.provider.start();
    self.logger.log('INFO', util.format('event provider %s started', this.events.provider.name));
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
    self.logger.log('INFO', util.format('transport %s started', name));
  }
}

module.exports.Server = Server;

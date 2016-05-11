'use strict';

var util = require('util');
var loadBalancerLib = require('../loadbalancer');

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
function registerTransport(name, transport) {
  transports[name] = transport;
}
module.exports.registerTransport = registerTransport;
// register default transport providers
let grpc = require('../transport/grpc');
registerTransport(grpc.Name, grpc.Client);

function Client(config) {
  // logger
  // TODO Load logger
  let logger = {
    log: console.log,
  };
  this.logger = logger;

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

Client.prototype.middleware = [];


function makeServiceEndpoint(middleware, loadBalancer, logger) {
  return function*(req, options){
    let attempts = 1;
    if (options && options.retry) {
      attempts += options.retry;
    }
    let errs = [];
    for(let i = 1; i <= attempts; i++) {
      logger.log('DEBUG', util.format('attempt %d/%d calling endpoint with request %j', i, attempts, req));
      try {
        let lb = loadBalancer.next();
        if (lb.done) {
          throw new Error('no endpoints');
        }
        let e = lb.value;
        let next = e;
        // TODO middleware should call next middleware until endpoint is reached
        for (let i = 0; i < middleware.length; i++) {
          next = yield middleware[i](next);
        }
        return yield next(req);
      } catch (e) {
        errs.push(e);
      }
    }
    throw new Error(errs);
  };
}

function generalFactory(method, transports, logger) {
  return function*(instance) {
    for(let i = 0; i < transports.length; i++) {
      try {
        let endpoint = yield* transports[i].makeEndpoint(method, instance);
        return endpoint;
      } catch (e) {
        logger.log('DEBUG', 'generalFactory transport.makeEndpoint', e);
      }
    }
    throw new Error('no endpoint');
  }
}

Client.prototype.connect = function*() {
  let service = {};
  for (let name in this._endpoints) {
    let e = this._endpoints[name];
    let factory = generalFactory(name, this._transports, this.logger);
    let publisher = e.publisher(e.publisherConfig, factory, this.logger);
    let loadBalancer = e.loadBalancer(e.loadBalancerConfig, publisher, this.logger);
    service[name] = makeServiceEndpoint(this.middleware, loadBalancer, this.logger);
  }
  return service;
}

module.exports.Client = Client;

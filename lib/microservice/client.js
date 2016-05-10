'use strict';

var util = require('util');

var transports = {};

function registerTransport(name, provider) {
  transports[name] = provider;
}
module.exports.registerTransport = registerTransport;

var loadBalancers = {};

function registerLoadBalancer(name, provider) {
  loadBalancers[name] = provider;
}
module.exports.registerTransport = registerTransport;

var publishers = {};

function registerPublisher(name, provider) {
  publishers[name] = provider;
}
module.exports.registerPublisher = registerPublisher;

var factoryProviders = [];

function registerFactory(factory) {
  factoryProviders.push(factory);
}
module.exports.registerFactory = registerFactory;

function makeEndpoint(method, instance) {
  for(let i = 0; i < factoryProviders.length; i++) {
    try {
      return factoryProviders[i](method, instance);
    } catch (e) {
      continue;
    }
  }
  return null;
}

function Client(config) {
  // logger
  // TODO Load logger
  let logger = {
    log: console.log,
  };
  this.logger = logger;

  // check config
  if (!config.endpoints) {
    this.logger.log('ERROR', 'no endpoints configured');
    return;
  }

  // setup endpoints
  this._endpoints = {};
  for (let name in config.endpoints) {
    let endpointCfg = config.endpoints[i];
    if (!endpointCfg.publisher || !endpointCfg.publisher.name) {
      this.logger.log('ERROR', util.format('endpoint %s has no configured publisher', name));
      continue
    }

    // publisher
    let publisher = publishers[endpointCfg.publisher.name];
    if (!publisher) {
      this.logger.log('ERROR', util.format('endpoint %s has configured publisher %s which is not registered', name, endpointCfg.publisher.name));
      continue
    }

    // loadBalancer
    let loadBalancer = loadBalancers.roundRobin;
    if (endpointCfg.loadbalancer && endpointCfg.loadbalancer.name) {
      loadBalancer = loadBalancers[endpointCfg.loadbalancer.name];
    } else {
      this.logger.log('WARNING', util.format('endpoint %s has no configured loadbalancer, using roundRobin', name));
    }
    if (!loadBalancer) {
      this.logger.log('ERROR', util.format('endpoint %s has configured loadbalancer %s which is not registered', name, endpointCfg.loadbalancer.name));
      continue
    }

    // factory
    // TODO transport provider
    // TODO provide transport with config
    // TODO makeEndpoint goes through transport providers with an instance to find a provider

    this._endpoints[name] = {
      publisher: publisher, // publisher(config, factory)
      publisherConfig: endpointCfg.publisher,
      factory: makeEndpoint, // factory(instance)
      loadBalancer: loadBalancer, // loadBalancer(config, publisher)
      loadBalancerConfig: endpointCfg.loadbalancer,
    };
  }
}

Client.prototype.middleware = [];


function makeServiceEndpoint(middleware, loadBalancer) {
  return function*(req){
    let lb = loadBalancer.next();
    if (lb.done) {
      throw new Error('no endpoints');
    }
    let e = lb.value;
    for (let i = 0; i < middleware.length; i++) {
      req = yield middleware[i](req);
    }
    return yield e(req);
  };
}

Client.prototype.connect = function*() {
  let service = {};
  for (let name in this._endpoints) {
    let e = this._endpoints[name];
    let publisher = e.publisher(e.publisherConfig, e.factory);
    let loadBalancer = e.loadBalancer(e.loadBalancerConfig, publisher);
    service[name] = makeServiceEndpoint(this.middleware, loadBalancer);
  }
  return service;
}

"client": {
  "endpoints": {
    "get": {
      "loadbalancer":{
        "name": "roundRobin"
      },
      "publisher": {
        "name": "static",
        "instances": ["grpc://localhost:50051", "http://localhost:80/api/user/get"]
      }
    },
    "register": {
      "loadbalancer":{
        "name": "random",
        "seed": 1
      },
      "publisher": {
        "name": "consul",
        "addr": "localhost:8500",
        "service": "user"
      }
    }
  }
}

module.exports.Client = Client;

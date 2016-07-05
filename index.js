'use strict';

// Config
module.exports.config = require('./lib/config');

// Database
module.exports.database = require('./lib/database');
module.exports.database.provider = {
  arango: require('./lib/database/provider/arango'),
  nedb: require('./lib/database/provider/nedb'),
};

// RPC
module.exports.microservice = require('./lib/microservice');
module.exports.microservice.endpoint = require('./lib/endpoint');
module.exports.microservice.loadbalancer = require('./lib/loadbalancer');
module.exports.microservice.errors = require('./lib/microservice/errors');
module.exports.microservice.plugins = require('./lib/service');
module.exports.microservice.transport = {
  provider: {
    grpc: require('./lib/transport/provider/grpc'),
    pipe: require('./lib/transport/provider/pipe'),
  },
};

// Events
module.exports.events = require('./lib/events');
module.exports.events.provider = {
  kafka: require('./lib/events/provider/kafka'),
  local: require('./lib/events/provider/local'),
};

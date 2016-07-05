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
module.exports.microservice = {
  Client: require('./lib/microservice/client').Client,
  Server: require('./lib/microservice/server').Server,
  endpoint: require('./lib/microservice/endpoint'),
  loadbalancer: require('./lib/microservice/loadbalancer'),
  plugins: require('./lib/microservice/plugins'),
  errors: require('./lib/microservice/errors'),
  transport: {
    provider: {
      grpc: require('./lib/microservice/transport/provider/grpc'),
      pipe: require('./lib/microservice/transport/provider/pipe'),
    },
  }
};

// Events
module.exports.events = require('./lib/events');
module.exports.events.provider = {
  kafka: require('./lib/events/provider/kafka'),
  local: require('./lib/events/provider/local'),
};

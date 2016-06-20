'use strict';

module.exports.config = require('./lib/config');
module.exports.database = require('./lib/database');
module.exports.arango = require('./lib/database/provider/arango');
module.exports.loadbalancer = require('./lib/loadbalancer');
module.exports.service = require('./lib/service');
module.exports.microservice = require('./lib/microservice');
module.exports.errors = require('./lib/microservice/errors');
module.exports.grpc = require('./lib/transport/provider/grpc');
module.exports.transport = {
  provider: {
    grpc: require('./lib/transport/provider/grpc'),
    pipe: require('./lib/transport/provider/pipe'),
  },
};
module.exports.endpoint = require('./lib/endpoint');
module.exports.events = require('./lib/events');
module.exports.kafka = require('./lib/events/provider/kafka');
module.exports.local = require('./lib/events/provider/local');

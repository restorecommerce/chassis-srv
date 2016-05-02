'use strict';

const Nanosecond = 1;
const Microsecond = 1000 * Nanosecond;
const Millisecond = 1000 * Microsecond;
const Second = 1000 * Millisecond;
const Minute = 60 * Second;
const Hour = 60 * Minute;

// gRPC
let grpc = require('grpc');
let co = require('co');
let util = require('util');
let serve = require('../lib/transport/grpc').serve;
const PROTO_PATH = __dirname + '/../protos/user.proto';
let proto = grpc.load(PROTO_PATH);

// events
let Events = require('../lib/transport/events/events').Events;
let Kafka = require('../lib/transport/events/kafka').Kafka;

// Service the business logic of this microservice.
function Service(userEvents) {
  var data = [{
    id: '/users/admin'
  }, {
    id: '/users/me'
  }, ];

  // will be an endpoint
  this.register = function*(guest, name, email, password) {
    if (guest) {
      name = '';
    }
    if (false) {
      // Throwing an error in an endpoint will send a INTERNAL error message
      // to the caller containing the error.message.
      throw new Error('Internal server error');

      // TODO Allow different kind of errors (gRPC status code)
    }
    let user = {
      id: '/users/' + name,
      guest: guest,
      name: name,
      email: email,
      password: password,
    }
    data.push(user);
    // emits an event (kafka message)
    yield userEvents.emit('created', user);
  }

  // will be an endpoint
  this.get = function*(id, name, email) {
    for (let entry of data) {
      if (entry.id === id || entry.name === name || entry.email === email) {
        // Return a value for a successful request
        return entry;
      }
    }
    // Returning a null value will send a NOT_FOUND status code gRPC error message
    return null;
  }
}

// Logging is a simple log middleware
function Logging(srv, logger) {
  this.get = function*(id, name, email) {
    let begin = process.hrtime();
    let resp = yield srv.get(id, name, email);
    let took = process.hrtime(begin);
    took = took[0] * Second + took[1];
    logger.log('INFO', 'method', 'get', 'id', id, 'name', name, 'email', email, 'took', util.format('%dns', took));
    return resp;
  }
  this.register = function*(guest, name, email, password) {
    let begin = process.hrtime();
    let resp = yield srv.register(guest, name, email, password);
    let took = process.hrtime(begin);
    took = took[0] * Second + took[1];
    logger.log('INFO', 'method', 'register', 'guest', guest, 'name', name, 'email', email, 'password', password, 'took', util.format('%dns', took));
    return resp;
  }
}

function makeNotImplemented() {
  return function(call, callback) {
    callback({
      code: grpc.status.NOT_IMPLEMENTED,
      details: 'not implemented',
    }, null);
  };
}

function makeServiceBinding(srv) {
  // serve creates an endpoint around the service method
  return {
    get: serve(srv.get),
    register: serve(srv.register),
    activate: makeNotImplemented(),
    changePassword: makeNotImplemented(),
    unregister: makeNotImplemented()
  }
}

function* init(options) {
  let logger = options.logger;
  let timeout = options.timeout;
  let addr = options.addr;
  // Register microservices here
  // User

  // Events
  // Create a Kafka provider
  let kafka = new Kafka(options.kafka);
  // Use Kafka provider for events
  let events = new Events(kafka);
  // subscribe to user events provided by kafka (topic:user)
  let userEvents = yield events.subscribe('user');
  // start provider kafka (consumer, producer)
  yield kafka.start();

  // Business domain
  // Create a plain business logic
  let srv = new Service(userEvents);
  // Use a middleware to log endpoint calls
  srv = new Logging(srv, logger);

  // Create gRPC server
  var server = new grpc.Server();

  // Listen to SIGINT for shutdown
  process.on('SIGINT', function() {
    logger.log('signal', 'SIGINT');
    server.tryShutdown(function() {
      logger.log('server', 'shutdown success');
    });
    co(function*(){
      yield kafka.end();
      process.exit(0);
    }).catch(function(err){
      logger.log('error', err);
      process.exit(1);
    });
  });

  // wrap the business logic into a gRPC service using endpoints
  var serviceBinding = makeServiceBinding(srv)
  // add the service binding as a gRPC service to the server
  server.addProtoService(proto.user.User.service, serviceBinding);
  // bind the server to an addr
  server.bind(addr, grpc.ServerCredentials.createInsecure());
  // start the gRPC server
  server.start();
}
let logger = {
  log: console.log,
};
let options = {
  addr: "localhost:50051",
  logger: logger,
  kafka: {
    groupId: 'restore-chassis-example-server',
    clientId: 'restore-chassis-example-server',
    connectionString: 'localhost:9092',
    logger: {
      logFunction: logger.log,
    },
  },
  timeout: 10000,
};

co(function*(){
  let ms = yield init(options);
}).catch(function(err){
  logger.log('error', 'microservice', 'message', err);
  process.exit(1);
});

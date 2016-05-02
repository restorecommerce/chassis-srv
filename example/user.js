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
let Serve = require('../lib/transport/grpc').Serve;
const PROTO_PATH = __dirname + '/../protos/user.proto';
let proto = grpc.load(PROTO_PATH);

// events
let Events = require('../lib/transport/events/events').Events;
let Kafka = require('../lib/transport/events/kafka').Kafka;

function Service(userEvents) {
  var data = [{
    id: '/users/admin'
  }, {
    id: '/users/me'
  }, ];

  this.register = function*(guest, name, email, password) {
    if (guest) {
      name = '';
    }
    let user = {
      id: '/users/' + name,
      guest: guest,
      name: name,
      email: email,
      password: password,
    }
    data.push(user);
    yield userEvents.emit('created', user);
  }
  this.get = function*(id, name, email) {
    for (let entry of data) {
      if (entry.id === id || entry.name === name || entry.email === email) {
        return entry;
      }
    }
    return null;
  }
}

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
  return {
    get: Serve(srv.get),
    register: Serve(srv.register),
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
  let kafka = new Kafka(options.kafka);
  let events = new Events(kafka);
  let userEvents = yield events.subscribe('user');
  yield kafka.start();

  // Business domain
  let srv = new Service(userEvents);
  srv = new Logging(srv, logger);

  var server = new grpc.Server();

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

  server.addProtoService(proto.user.User.service, makeServiceBinding(srv));
  server.bind(addr, grpc.ServerCredentials.createInsecure());
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

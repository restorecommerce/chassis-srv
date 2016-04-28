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
const PROTO_PATH = __dirname + '/../protos/user.proto';
let proto = grpc.load(PROTO_PATH);

function Service() {
  var data = [{
    id: '/users/admin'
  }, {
    id: '/users/me'
  }, ];
  this.get = function(id, name, email) {
    for (let entry of data) {
      if (entry.id === id || entry.name === name || entry.email === email) {
        return entry;
      }
    }
    return null;
  }
}

function Logging(srv, logger) {
  this.get = function(id, name, email) {
    let begin = process.hrtime();
    let resp = srv.get(id, name, email);
    let took = process.hrtime(begin);
    took = took[0] * Second + took[1];
    logger.log('method', 'get', 'id', id, 'name', name, 'email', email, 'took', took);
    return resp;
  }
}

function makeGetEndpoint(service) {
  return function(call, callback) {
    let req = call.request;
    let resp = service.get(req.id, req.name, req.email);
    if (resp) {
      callback(null, resp);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: 'not found'
      });
    }
  };
}

function makeNotImplemented() {
  return function(call, callback) {
    callback({
      code: grpc.status.NOT_IMPLEMENTED
    });
  };
}

function makeGenericEndpoint(service, method) {
  return function(call, callback) {
    let req = call.request;
    let f = service[method];
    if (!f) {
      callback({
        code: grpc.status.NOT_IMPLEMENTED
      });
    }
    let args = [];
    Object.keys(req).forEach(function(key) {
      args.push(req[key]);
    });
    let resp, error;
    try {
      resp = f.apply(service, args);
    } catch (e) {
      error = e;
    }
    if (error) {
      let code = grpc.status.INTERNAL;
      callback({
        code: code,
        details: error.message
      });
      return;
    }
    if (!resp) {
      callback({
        code: grpc.status.NOT_FOUND,
        details: 'not found'
      });
      return;
    }
    callback(null, resp);
  };
}

function makeServiceBinding(srv) {
  return {
    get: makeGenericEndpoint(srv, 'get'),
    register: makeNotImplemented(),
    activate: makeNotImplemented(),
    changePassword: makeNotImplemented(),
    unregister: makeNotImplemented()
  }
}

function init(options) {
  let logger = options.logger;
  let timeout = options.timeout;
  let addr = options.addr;
  // Register microservices here
  // User

  // Business domain
  let srv = new Service();
  srv = new Logging(srv, logger);

  var server = new grpc.Server();

  process.on('SIGINT', function() {
    logger.log('signal', 'SIGINT');
    server.tryShutdown(function() {
      logger.log('server', 'shutdown success');
    });
    process.exit(0);
  });

  server.addProtoService(proto.user.User.service, makeServiceBinding(srv));
  server.bind(addr, grpc.ServerCredentials.createInsecure());
  server.start();
}

co(function*() {
  let options = {
    addr: "localhost:50051",
    logger: {
      log: console.log
    },
    timeout: 10000
  };
  let ms = init(options);
}).catch(function(err) {
  console.error('example error', err);
});

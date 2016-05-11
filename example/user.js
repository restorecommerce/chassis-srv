'use strict';

let co = require('co');
let Server = require('../lib/microservice').Server

// Service the business logic of this microservice.
function Service(userEvents, logger) {
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
    logger.log('INFO', 'user created', user);
    // emits an event (kafka message)
    yield userEvents.emit('created', user);
    return user;
  }

  // will be an endpoint
  this.get = function*(id, name, email) {
    for (let entry of data) {
      if (entry.id === id && id || entry.name === name && name || entry.email === email && email) {
        // Return a value for a successful request
        return entry;
      }
    }
    // Returning a null value will send a NOT_FOUND status code gRPC error message
    return null;
  }

  this.activate = function*() {
    throw new Error('not implemented');
    return null;
  }
  this.changePassword = this.activate;
  this.unregister = this.activate;
}

let config = {
  events: {
    provider: {
      name: 'kafka',
      config: { // config object pased to kafka provider
        groupId: 'restore-chassis-example-server',
        clientId: 'restore-chassis-example-server',
        connectionString: 'localhost:9092',
      },
    },
  },
  endpoints: {
    // TODO A default for all endpoints?
    // eg.: transport: ['grpc'],
    activate: {
      // Specify which configured transport the endpoint should use
      transport: ['grpc'],
    },
    changePassword: {
      transport: ['grpc'],
    },
    get: {
      transport: ['grpc'],
    },
    register: {
      transport: ['grpc'],
    },
    unregister: {
      transport: ['grpc'],
    },
  },
  // It is possible to register multiple transports of the same kind(name).
  // For example a grpc server listening on port 50051 and one on port 50052.
  transports: [{
    name: 'grpc',
    config: { // config object passed to grpc provider
      proto: '/../protos/user.proto',
      package: 'user',
      service: 'User',
      addr: "localhost:50051",
    },
  }, ],
};

// makeLogging returns a simple middleware which is called before the business logic.
function makeLogging(logger) {
  return function*(req) {
    logger.log('INFO', req.transport, req.method, req.request);
    return yield req;
  }
}

co(function*() {
  // Create a new microservice Server
  let server = new Server(config);

  // Add middleware
  server.middleware.push(makeLogging(server.logger));

  // Subscribe to events which the business logic requires
  let userEvents = yield server.events.subscribe('user');

  // Create the business logic
  let service = new Service(userEvents, server.logger);

  // Bind business logic to server
  yield server.bind(service);

  // Start server
  yield server.start();
}).catch(function(err) {
  console.log(err.stack);
  process.exit(1);
});

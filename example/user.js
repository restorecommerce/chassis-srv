'use strict';

const Nanosecond = 1;
const Microsecond = 1000 * Nanosecond;
const Millisecond = 1000 * Microsecond;
const Second = 1000 * Millisecond;
const Minute = 60 * Second;
const Hour = 60 * Minute;


let co = require('co');
let util = require('util');

let Server = require('../lib/microservice').Server

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
      config: {
        groupId: 'restore-chassis-example-server',
        clientId: 'restore-chassis-example-server',
        connectionString: 'localhost:9092',
      },
    },
  },
  endpoints: {
    activate: {
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
  transports: [
    {
      name: 'grpc',
      config: {
        proto: '/../protos/user.proto',
        package: 'user',
        service: 'User',
        addr: "localhost:50051",
      },
    },
  ],
};

co(function*(){
  let server = new Server(config);
  let userEvents = yield server.events.subscribe('user');
  let service = new Service(userEvents);
  yield server.bind(service);
  yield server.start();
}).catch(function(err){
  console.log(err.stack);
  process.exit(1);
});

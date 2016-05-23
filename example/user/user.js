'use strict';

let co = require('co');
let util = require('util');
let ms = require('../../lib/microservice');
let Server = ms.Server;
let Database = ms.Database;

// Service the business logic of this microservice.
function Service(userEvents, logger) {
  this.data = [{
    id: '/users/admin'
  }, {
    id: '/users/me'
  }, ];

  // will be an endpoint
  this.register = function*(request, context) {
    let guest = request.guest;
    let name = request.name;
    let email = request.email;
    let password = request.password;
    if (guest) {
      name = '';
    }
    if (!name) {
      let err = new Error('invalid argument');
      err.details = 'argument name is empty';
      throw err;
    }
    if (!email) {
      let err = new Error('invalid argument');
      err.details = 'argument email is empty';
      throw err;
    }
    if (!password) {
      let err = new Error('invalid argument');
      err.details = 'argument password is empty';
      throw err;
    }
    let user = {
      id: '/users/' + name,
      guest: guest,
      name: name,
      email: email,
      password: password,
    }
    this.data.push(user);
    logger.log('INFO', 'user created', user);
    // emits an event (kafka message)
    yield userEvents.emit('created', user);
    return user;
  }

  // will be an endpoint
  this.get = function*(request, context) {
    let id = request.id;
    let name = request.name;
    let email = request.email;
    for (let entry of this.data) {
      if (entry.id === id && id || entry.name === name && name || entry.email === email && email) {
        // Return a value for a successful request
        return entry;
      }
    }
    throw new Error('not found');
  }

  this.activate = function*() {
    throw new Error('not implemented');
    return null;
  }
  this.changePassword = this.activate;
  this.unregister = this.activate;
}

co(function*() {


  // Create a new microservice Server
  let server = new Server();

  // get gss
  let db = yield Database.get('gss', server.logger);

  // Add middleware
  // server.middleware.push(makeLogging(server.logger));

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

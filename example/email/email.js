'use strict';

let co = require('co');
let util = require('util');
let Server = require('../../lib/microservice').Server

function Service(userEvents, logger) {
  function* sendEmail(mail) {
    logger.log('debug', 'pretending to send email', mail);
  }
  userEvents.on('created', function*(message){
    let name = message.name || message.id;
    let msg = util.format('Hello user %s Your account has beeen created.', name);
    let email = {
      to: message.email,
      body: msg,
    };
    yield sendEmail(email);
  });
  userEvents.on('activated', function*(message){
    let name = message.name || message.id;
    let msg = util.format('Hello user %s Your account has beeen activated.', name);
    let email = {
      to: message.email,
      body: msg,
    };
    yield sendEmail(email);
  });
  userEvents.on('deleted', function*(message){
    let name = message.name || message.id;
    let msg = util.format('Hello user %s Your account has beeen deleted.', name);
    let email = {
      to: message.email,
      body: msg,
    };
    yield sendEmail(email);
  });
}

co(function*(){
  // Create a new microservice Server
  let server = new Server();

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
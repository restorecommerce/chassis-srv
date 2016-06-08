'use strict';

const co = require('co');
const util = require('util');
const Server = require('../../lib/microservice').Server;
const config = require('../../lib/config');

function Service(userEvents, logger) {
  function* sendEmail(mail) {
    logger.debug('pretending to send email', mail);
  }
  yield userEvents.on('create', function* onCreated(message) {
    const name = message.name || message.id;
    const msg = util.format('Hello user %s Your account has beeen created.',
      name);
    const email = {
      to: message.email,
      body: msg,
    };
    yield sendEmail(email);
  });
  yield userEvents.on('activated', function* onActivated(message) {
    const name = message.name || message.id;
    const msg = util.format('Hello user %s Your account has beeen activated.',
      name);
    const email = {
      to: message.email,
      body: msg,
    };
    yield sendEmail(email);
  });
  yield userEvents.on('deleted', function* onDeleted(message) {
    const name = message.name || message.id;
    const msg = util.format('Hello user %s Your account has beeen deleted.',
      name);
    const email = {
      to: message.email,
      body: msg,
    };
    yield sendEmail(email);
  });
}

co(function* init() {
  config.load(process.cwd() + '/example/email');

  // Create a new microservice Server
  const server = new Server();

  // Subscribe to events which the business logic requires
  const userEvents = yield server.events.topic('io.restorecommerce.users.resource');

  // Create the business logic
  const service = new Service(userEvents, server.logger);

  // Bind business logic to server
  yield server.bind(service);

  // Start server
  yield server.start();
}).catch((err) => {
  /* eslint no-console: ["error", { allow: ["error"] }] */
  console.error('client error', err.stack);
  process.exit(1);
});

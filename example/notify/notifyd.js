'use strict';

const co = require('co');
const chassis = require('../../lib');

const Server = chassis.microservice.Server;
const Events = chassis.events.Events;

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

// Service the business logic of this microservice.
function Service(events, logger) {
  // will be an endpoint
  this.create = function* create(call, context) {
    const req = call.request;
    const id = guid();
    const notification = {
      id,
      sender: req.sender,
      title: req.title,
      message: req.message,
    };
    let send = false;
    try {
      yield events.emit('notification', notification);
      send = true;
    } catch (err) {
      logger.error(err);
    }
    const report = {
      id,
      send,
    };
    return report;
  };

  this.createStream = function* create(call, context) {
    let req;
    let stream = true;
    while (stream) {
      try {
        req = yield call.read();
        const id = guid();
        const notification = {
          id,
          sender: req.sender,
          title: req.title,
          message: req.message,
        };
        yield events.emit('notification', notification);
        const report = {
          id,
          send: true,
        };
        yield call.write(report);
      } catch (err) {
        stream = false;
        if (err.message === 'stream end') {
          yield call.end();
          return;
        }
        context.logger.error(err);
      }
    }
  };
}

co(function* init() {
  // Load configuration
  const cfg = yield chassis.config.get();

  // Create a new microservice Server
  const server = new Server(cfg.get('server'));

  // Create events
  const events = new Events(cfg.get('events:kafka'));
  yield events.start();

  // Subscribe to events which the business logic requires
  const notificationEvents = yield events.topic('io.restorecommerce.notify');

  // Create the business logic
  const service = new Service(notificationEvents, server.logger);

  // Bind business logic to server
  yield server.bind('notifyd', service);

  // Start server
  yield server.start();
}).catch((err) => {
  /* eslint no-console: ["error", { allow: ["error"] }] */
  console.error('init error', err.stack);
  process.exit(1);
});

'use strict';

const co = require('co');
const chassis = require('../../lib');

const Server = chassis.Server;
const srvClient = require('@restorecommerce/srv-client');
const Logger = require('@restorecommerce/logger');
const Events = srvClient.Events;

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
    logger.info('create being called!');
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
      logger.info('Notification', notification);
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
        context.logger.error(err);
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
  const logger = new Logger(cfg.get('logger'));

  // Create a new microservice Server
  const server = new Server(cfg.get('server'), logger);

  // Create events
  const events = new Events(cfg.get('events:kafka'), logger);
  yield events.start();

  // Subscribe to events which the business logic requires
  const notificationEvents = yield events.topic('io.restorecommerce.notify');

  // Create the business logic
  const service = new Service(notificationEvents, logger);

  // Bind business logic to server
  yield server.bind('notifyd', service);

  // Start server
  yield server.start();
}).catch((err) => {
  /* eslint no-console: ["error", { allow: ["error"] }] */
  console.error('init error', err.stack);
  process.exit(1);
});

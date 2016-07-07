'use strict';

const co = require('co');
const chassis = require('../../');
const Events = chassis.events.Events;

co(function* init() {
  const config = {
    provider: 'kafka',
    groupId: 'notify-listen',
    clientId: 'notify-listen',
    connectionString: 'localhost:9092',
    protos: ['io/restorecommerce/notify.proto'],
    protoRoot: '../../protos/',
  };
  // Create a new microservice Server
  const events = new Events('kafka', config);
  yield events.start();
  const logger = events.logger;

  // Subscribe to events which the business logic requires
  const topicName = 'io.restorecommerce.notify';
  const notificationEvents = yield events.topic(topicName);

  const offset = yield notificationEvents.$offset();
  logger.verbose(`Current offset for topic ${topicName} is ${offset}`);

  // Start listening to events
  yield notificationEvents.on('notification', function* listen(notification) {
    logger.info('notification', notification);
  });
}).catch((err) => {
  /* eslint no-console: ["error", { allow: ["error"] }] */
  console.error('init error', err.stack);
  process.exit(1);
});

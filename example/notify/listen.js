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

  // Subscribe to events which the business logic requires
  const notificationEvents = yield events.topic('io.restorecommerce.notify');

  yield notificationEvents.on('notification', function* listen(notification) {
    events.logger.info('notification', notification);
  });

  // Start listening to events
  yield events.start();
}).catch((err) => {
  /* eslint no-console: ["error", { allow: ["error"] }] */
  console.error('init error', err.stack);
  process.exit(1);
});

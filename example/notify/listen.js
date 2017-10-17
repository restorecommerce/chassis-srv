'use strict';

const co = require('co');
const chassis = require('../../lib');

const Events = chassis.events.Events;
const database = chassis.database;

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
  const events = new Events(config);
  yield events.start();
  const logger = events.logger;

  // Load configuration
  const cfg = yield chassis.config.get();

  // Load database
  const db = yield database.get(cfg.get('database:ephemeral'), logger);

  // Subscribe to events which the business logic requires
  const topicName = 'io.restorecommerce.notify';
  const notificationEvents = yield events.topic(topicName);

  const offset = yield notificationEvents.$offset();
  logger.verbose(`Current offset for topic ${topicName} is ${offset}`);

  // Start listening to events
  yield notificationEvents.on('notification', function* listen(notification) {
    yield db.insert('notifications', notification);
    logger.info('notification', notification);

    const notifications = yield db.find('notifications', {});
    logger.info(`received ${notifications.length} notifications`);
  });
}).catch((err) => {
  /* eslint no-console: ["error", { allow: ["error"] }] */
  console.error('init error', err.stack);
  process.exit(1);
});

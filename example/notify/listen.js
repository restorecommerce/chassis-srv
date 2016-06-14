'use strict';

const co = require('co');
const chassis = require('../../');
const Server = chassis.microservice.Server;

co(function* init() {
  const serverConfig = {
    events: {
      provider: {
        name: 'kafka',
        groupId: 'notify-listen',
        clientId: 'notify-listen',
        connectionString: 'localhost:9092',
        protoRoot: '../../protos/',
      },
    },
  };
  // Create a new microservice Server
  const server = new Server(serverConfig);

  // Subscribe to events which the business logic requires
  const events = yield server.events.topic('io.restorecommerce.notify');

  yield events.on('notification', function* listen(notification) {
    server.logger.info('notification', notification);
  });

  // Start server
  yield server.start();
}).catch((err) => {
  /* eslint no-console: ["error", { allow: ["error"] }] */
  console.error('init error', err.stack);
  process.exit(1);
});

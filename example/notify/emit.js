'use strict';

const co = require('co');
const chassis = require('../../');
const Client = chassis.microservice.Client;

co(function* init() {
  if (process.argv.length !== 5) {
    /* eslint no-console: ["error", { allow: ["error"] }] */
    console.error('requires argument sender, title, message');
    process.exit(1);
  }
  const sender = process.argv[2];
  const title = process.argv[3];
  const message = process.argv[4];
  const notification = {
    sender,
    title,
    message,
  };

  const client = new Client('notify');
  const notifyd = yield client.connect();

  try {
    const response = yield notifyd.create(notification);
    const report = response.data;
    client.logger.info(`Notification ${report.id} was send ${report.send}`);
  } catch (err) {
    client.logger.error('notification creation error', err);
  }
}).catch((err) => {
  /* eslint no-console: ["error", { allow: ["error"] }] */
  console.error('client error', err.stack);
  process.exit(1);
});

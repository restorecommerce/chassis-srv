'use strict';

const co = require('co');
const readline = require('readline');
const chassis = require('../../lib');
const srvClient = require('@restorecommerce/srv-client');
const Logger = require('@restorecommerce/logger');

const Client = srvClient.Client;

function askQuestion(rl, question) {
  return function wrap(cb) {
    rl.question(question, (result) => {
      cb(null, result);
    });
  };
}

co(function* init() {
  // Load configuration
  const cfg = yield chassis.config.get();
  const logger = new Logger(cfg.get('logger'));

  const client = new Client(cfg.get('client:notify'), logger);
  const notifyd = yield client.connect();
  logger.info('Service', notifyd);

  // with arguments
  if (process.argv.length === 5) {
    const sender = process.argv[2];
    const title = process.argv[3];
    const message = process.argv[4];
    const notification = {
      sender,
      title,
      message,
    };
    try {
      const response = yield notifyd.create(notification);
      const report = response.data;
      logger.info(`Notification ${report.id} was send ${report.send}`);
    } catch (err) {
      logger.error('notification creation error', err);
    }
    return;
  }

  // without arguments, do streaming
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const keepReading = true;
  while (keepReading) {
    const notification = {};
    notification.sender = yield askQuestion(rl, 'Enter sender: ');
    notification.title = yield askQuestion(rl, 'Enter title: ');
    notification.message = yield askQuestion(rl, 'Enter message: ');

    const report = yield notifyd.create(notification, this);
    logger.info('report', report);
  }
  rl.close();
}).catch((err) => {
  /* eslint no-console: ["error", { allow: ["error"] }] */
  console.error('client error', err, err.stack);
  process.exit(1);
});

'use strict';

let co = require('co');
let util = require('util');

// chassis

// events
let Events = require('../lib/transport/events/events').Events;
let Kafka = require('../lib/transport/events/kafka').Kafka;

let logger = {
  log: console.log,
};
let options = {
  logger: logger,
  kafka: {
    groupId: 'restore-chassis-example-email',
    clientId: 'restore-chassis-example-email',
    connectionString: 'localhost:9092',
    logger: {
      logFunction: logger.log,
    },
  },
  timeout: 10000,
};

function sendEmail(mail) {
  logger.log('debug', 'pretending to send email', mail);
}

function init(options) {
  // Events
  let kafka = new Kafka(options.kafka);
  let events = new Events(kafka);
  let userEvents = events.subscribe('user');
  userEvents.on('created', function(message){
    let name = message.name || message.id;
    let msg = util.format('Hello user %s Your account has beeen created.', name);
    let email = {
      to: message.email,
      body: msg,
    };
    sendEmail(email);
  });
  userEvents.on('activated', function(message){
    let name = message.name || message.id;
    let msg = util.format('Hello user %s Your account has beeen activated.', name);
    let email = {
      to: message.email,
      body: msg,
    };
    sendEmail(email);
  });
  userEvents.on('deleted', function(message){
    let name = message.name || message.id;
    let msg = util.format('Hello user %s Your account has beeen deleted.', name);
    let email = {
      to: message.email,
      body: msg,
    };
    sendEmail(email);
  });
  kafka.start();
}


try {
  let ms = init(options);
} catch (err) {
  logger.log('error', 'microservice', 'message', err.stack);
}

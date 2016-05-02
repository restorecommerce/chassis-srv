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

function* init(options) {
  // Events
  // Create a Kafka provider
  let kafka = new Kafka(options.kafka);
  // Use Kafka provider for events
  let events = new Events(kafka);
  // subscribe to user events provided by kafka (topic:user)
  let userEvents = yield events.subscribe('user');
  // listen to user.created events (kafka messages)
  userEvents.on('created', function*(message){
    let name = message.name || message.id;
    let msg = util.format('Hello user %s Your account has beeen created.', name);
    let email = {
      to: message.email,
      body: msg,
    };
    sendEmail(email);
  });
  userEvents.on('activated', function*(message){
    let name = message.name || message.id;
    let msg = util.format('Hello user %s Your account has beeen activated.', name);
    let email = {
      to: message.email,
      body: msg,
    };
    sendEmail(email);
  });
  userEvents.on('deleted', function*(message){
    let name = message.name || message.id;
    let msg = util.format('Hello user %s Your account has beeen deleted.', name);
    let email = {
      to: message.email,
      body: msg,
    };
    sendEmail(email);
  });
  // start provider kafka (consumer, producer)
  yield kafka.start();

  process.on('SIGINT', function() {
    logger.log('signal', 'SIGINT');
    co(function*(){
      yield kafka.end();
      process.exit(0);
    }).catch(function(err){
      logger.log('error', err);
      process.exit(1);
    });
  });
}

co(function*(){
  let ms = yield init(options);
}).catch(function(err){
  logger.log('error', 'microservice', 'message', err);
  process.exit(1);
});

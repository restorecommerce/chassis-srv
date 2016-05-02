'use strict';

// gRPC
let grpc = require('grpc');
let co = require('co');
let util = require('util');
const PROTO_PATH = __dirname + '/../protos/user.proto';
let proto = grpc.load(PROTO_PATH);

// chassis
let endpoint = require('../lib/endpoint');
let Client = require('../lib/transport/grpc').Client;
let StaticPublisher = require('../lib/loadbalancer/static').StaticPublisher;

// events
let Events = require('../lib/transport/events/events').Events;
let Kafka = require('../lib/transport/events/kafka').Kafka;

function makeUserFactory(method, timeout) {
  return function*(instance) {
    let conn = new proto.user.User(instance, grpc.credentials.createInsecure());
    let client = new Client(conn, method);
    return client.endpoint;
  }
}

function* init(options) {
  let logger = options.logger;
  let timeout = options.timeout;

  // Register microservices endpoints here
  // User
  let userInstances = options.instances;
  let userGetPublisher = yield StaticPublisher(userInstances, makeUserFactory('get', options.timeout), logger);
  let userGetLoadBalancer = endpoint.roundRobin(userGetPublisher);
  let userGet = endpoint.retry(10, timeout, userGetLoadBalancer);
  let userRegisterPublisher = yield StaticPublisher(userInstances, makeUserFactory('register', options.timeout), logger);
  let userRegisterLoadBalancer = endpoint.roundRobin(userRegisterPublisher);
  let userRegister = endpoint.retry(10, timeout, userRegisterLoadBalancer);

  // Events
  let kafka = new Kafka(options.kafka);
  let events = new Events(kafka);
  let userEvents = events.subscribe('user');
  userEvents.on('created', function*(message) {
    logger.log('topic', 'user', 'event', 'created', 'message', message);
  });
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

  return {
    user: {
      get: userGet,
      register: userRegister,
    },
  };
}

co(function*() {
  let logger = {
    log: console.log,
  };
  let options = {
    instances: ["localhost:50051"],
    logger: logger,
    kafka: {
      groupId: 'restore-chassis-example-client',
      clientId: 'restore-chassis-example-client',
      connectionString: 'localhost:9092',
      logger: {
        logFunction: logger.log,
      },
    },
    timeout: 10000,
  };
  let ms = yield init(options);

  yield ms.user.register({
    guest: false,
    name: 'example'
  });

  let results = [
    yield ms.user.get({
      id: '/users/admin'
    }),
    yield ms.user.get({
      id: '/users/me'
    }),
    yield ms.user.get({
      id: '/users/does_not_exist'
    })
  ];
  for (let result of results) {
    if (result.error) {
      console.error(result.error);
      return;
    }
    console.log(result.data);
  }
}).catch(function(err) {
  console.error('example error', err.stack);
});

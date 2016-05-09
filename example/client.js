'use strict';

// gRPC
let grpc = require('grpc');
let co = require('co');
let util = require('util');
const PROTO_PATH = __dirname + '/../protos/user.proto';
let proto = grpc.load(PROTO_PATH);

// chassis
let endpoint = require('../lib/endpoint');
let call = require('../lib/transport/grpc').call;
let staticPublisher = require('../lib/loadbalancer/static').staticPublisher;

// events
let Events = require('../lib/transport/events/events').Events;
let Kafka = require('../lib/transport/events/kafka').Kafka;

// returns endpoint
function makeUserFactory(method, timeout) {
  return function*(instance) {
    let conn = new proto.user.User(instance, grpc.credentials.createInsecure());
    return call(conn, method);
  };
}

function* init(options) {
  let logger = options.logger;
  let timeout = options.timeout;

  // Register microservices endpoints here
  // User
  // list of instances (typically host:port strings)
  let userInstances = options.instances;

  // User.Get service method creation
  // Publisher provides instances, which the factory turns into endpoints
  let userGetPublisher = staticPublisher(userInstances, makeUserFactory('get', options.timeout), logger);
  // LoadBalancer balances calls to endpoints
  let userGetLoadBalancer = endpoint.roundRobin(userGetPublisher);
  // retry wraps a LoadBalancer to provide retry and timeout mechanics for the endpoint
  let userGet = endpoint.retry(10, timeout, userGetLoadBalancer);

  // User.Register service method creation
  let userRegisterPublisher = staticPublisher(userInstances, makeUserFactory('register', options.timeout), logger);
  let userRegisterLoadBalancer = endpoint.roundRobin(userRegisterPublisher);
  let userRegister = endpoint.retry(10, timeout, userRegisterLoadBalancer);

  // Events
  // Create a Kafka provider
  let kafka = new Kafka(options.kafka);
  // Use Kafka provider for events
  let events = new Events(kafka);
  // subscribe to user events provided by kafka (topic:user)
  let userEvents = yield events.subscribe('user');
  // listen to user.created events (kafka messages)
  userEvents.on('created', function*(message) {
    logger.log('topic', 'user', 'event', 'created', 'message', message);
  });
  // start provider kafka (consumer, producer)
  yield kafka.start();

  // listen to SIGINT signals
  process.on('SIGINT', function() {
    logger.log('signal', 'SIGINT');
    co(function*(){
      // shutdown kafka
      yield kafka.end();
      process.exit(0);
    }).catch(function(err){
      logger.log('error', err);
      process.exit(1);
    });
  });

  // return microservice object
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

  // call endpoint user.register (gRPC:user.User.service.get)
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
  console.error('client error', err.stack);
  process.exit(1);
});

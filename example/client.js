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

function makeUserFactory(method, timeout) {
  return function*(instance) {
    let conn = new proto.user.User(instance, grpc.credentials.createInsecure());
    let client = new Client(conn, method);
    console.log('client created');
    return client.endpoint;
  }
}

function* init(options) {
  let logger = options.logger;
  let timeout = options.timeout;
  // Register microservices here
  // User
  let userInstances = options.instances;
  let userGetPublisher = yield StaticPublisher(userInstances, makeUserFactory('get', options.timeout), logger);
  let userGetLoadBalancer = endpoint.roundRobin(userGetPublisher);
  let userGet = endpoint.retry(10, timeout, userGetLoadBalancer);

  return {
    user: {
      get: userGet
    }
  };
}

co(function*() {
  let options = {
    instances: ["localhost:50051"],
    logger: {
      log: console.log
    },
    timeout: 100
  };
  let ms = yield init(options);

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

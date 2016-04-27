'use strict';

// gRPC
let grpc = require('grpc');
let co = require('co');
const PROTO_PATH = __dirname + '/../protos/user.proto';
let proto = grpc.load(PROTO_PATH);

// chassis
let endpoint = require('../lib/endpoint');
let StaticPublisher = require('../lib/loadbalancer/static').StaticPublisher;

// checkUser middleware example
function checkUser(requestBody, options) {
  let id = requestBody['@id'];
  let name = requestBody.name;
  let email = requestBody.email;
  try {
    let resp = options.microservice.user.get(id, name, email);
    return {
      exists: true
    }
  } catch (e) {
    if (e.message === 'User does not exist') {
      return {
        exists: false
      }
    }
    return {
      error: e
    }
  }
}

function userGetFactory(instance) {
  let client = new proto.user.User(instance, grpc.credentials.createInsecure());
  let deadline = 1000;
  return function*(request) {
    function get(req) {
      return function(cb) {
        client.get(req, cb);
      }
    }
    return yield get(request);
  }
}

function Microservice(options) {
  // Register microservices here
  // User
  let userInstances = options.instances;
  let userGetPublisher = new StaticPublisher(userInstances, userGetFactory);
  let userGetLoadBalancer = endpoint.roundRobin(userGetPublisher);
  let userGet = endpoint.retry(10, 1000, userGetLoadBalancer);
  this.user = {
    get: function*(req){
      return yield userGet(req);
    }
  }
}

co(function*(){
  let options = {
    instances: ["localhost:50051"]
  };
  let ms = new Microservice(options);
  let resp = yield ms.user.get({id:'/users/me'});
  console.log(resp);
}).catch(function(err){
  console.error(err);
});

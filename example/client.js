'use strict';

let co = require('co');
let util = require('util');
let Client = require('../lib/microservice').Client;


let config = {
  transports: {
    grpc: {
      proto: "/../protos/user.proto",
      package: "user",
      service: "User",
      timeout: 3000
    }
  },
  endpoints: {
    get: {
      loadbalancer:{
        name: "roundRobin"
      },
      publisher: {
        name: "static",
        instances: ["grpc://localhost:50051"]
      }
    },
    register: {
      loadbalancer:{
        name: "random",
        seed: 1
      },
      publisher: {
        name: "static",
        instances: ["grpc://localhost:50051"]
      }
    }
  }
};

co(function*() {
  let client = new Client(config);
  let user = yield client.connect();

  let results = yield [
    user.register({
      guest: false,
      name: 'example' ,
      email: '',
      password: '',
    }, {retry:3, timeout: 1000}),
    user.get({
      id: '/users/admin'
    }, {timeout: 1000}),
    user.get({
      id: '/users/me'
    }, {timeout: 1000}),
    user.get({
      id: '/users/does_not_exist'
    }, {timeout: 1000}),
  ];
  client.logger.log('INFO', util.format('calls finished with %s results', results.length));
  for (let i = 0; i < results.length; i++) {
    let result = results[i];
    if (!result) {
      console.error(util.format('result %d is undefined',i));
      continue
    }
    if (result.error) {
      console.error(util.format('result %d error: %s', i, result.error));
    } else {
      console.log(util.format('result %d: %j', i, result.data));
    }
  }
}).catch(function(err) {
  console.error('client error', err.stack);
  process.exit(1);
});

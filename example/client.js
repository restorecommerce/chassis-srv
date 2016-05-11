'use strict';

let co = require('co');
let util = require('util');
let Client = require('../lib/microservice').Client;


let config = {
  transports: {
    grpc: {
      proto: "/../protos/user.proto",
      package: "user",
      service: "User"
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
      name: 'example'
    }, {retry:3}),
    user.get({
      id: '/users/admin'
    }),
    user.get({
      id: '/users/me'
    }),
    user.get({
      id: '/users/does_not_exist'
    })
  ];
  client.logger.log('INFO', util.format('calls finished with %s results', results.length));
  for (let result of results) {
    if (result.error) {
      console.error(result.error);
    } else {
      console.log(result.data);
    }
  }
}).catch(function(err) {
  console.error('client error', err.stack);
  process.exit(1);
});

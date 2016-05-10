'use strict';

module.exports.Server = require('./server').Server;

/*

// server example
let server = new Server(config.server);
let service = new Service(server.events);
yield server.bind(service);
server.middleware.push(new Logging()); // Logging is custom middleware
server.endpoints.register.middleware.push(new LogTime()); // custom middleware
yield server.start();

// config
{
  "server": {
    "events": {
      "provider": {
          "name" : "kafka",
          "config": {
            "groupId": "restore-chassis-example-server",
            "clientId": "restore-chassis-example-server",
            "connectionString": "localhost:9092"
          }
      }
    },
    "endpoints": {
      "get": {
        transport: ["grpc"]
      },
      "register": {
        transport: ["grpc"]
      }
    },
    transports: [
      {
        "name": "grpc",
        "config": {
          "proto": "/../protos/user.proto",
          "package": "user",
          "service": "User",
          "addr": "localhost:50051"
        }
      }
    ]
  },
  "client": {
    "endpoints": {
      "get":{
        "publisher": {
          "name": "static",
          "instances": ["localhost:50051"]
        },
        "loadbalancer": [
          {
            "name": "roundRobin"
          }
        ],
        "middleware": [
          {
            "name": "retry",
            "max": 10,
            "timeout": 3000
          }
        ]
      },
      "register":{
        "publisher": {
          "name": "static",
          "instances": ["localhost:50051"]
        },
        "loadbalancer": [
          {
            "name": "random",
            "seed": 1
          }
        ],
        "middleware": [
          {
            "name": "retry",
            "max": 10,
            "timeout": 3000
          }
        ]
      },
    }
  }
}
*/

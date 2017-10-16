# chassis-srv [![Build Status](https://travis-ci.org/restorecommerce/chassis-srv.svg?branch=master)](https://travis-ci.org/restorecommerce/chassis-srv) [![Coverage Status](https://coveralls.io/repos/github/restorecommerce/chassis-srv/badge.svg?branch=master)](https://coveralls.io/github/restorecommerce/chassis-srv?branch=master)

## Features

- Expose your business logic as RPC endpoints
- Middleware for server
- Includes endpoint discovery, load balancing, retry and timeout logic
- Microservices Health check Endpoint
- Uses ES6 features

## Install

Make sure you have typescript (tsc) installed before using chassis-srv `npm install -g typescript`.
To install the chassis-srv run ``npm install restorecommerce/chassis-srv``.

## Examples

Code examples are in the example directory.
The examples require a running Kafka instance.
Commands to run the examples:

```bash
cd example/notify
node notifyd.js
node listen.js
node emit.js
```

## Architecture

The chassis is split into a cache, config, database, logger and server part.
A Server exposes endpoints via transports.
The cache part handles loading of caches based on configuration files.
Databases can be loaded with database part.
Log handling is provided by the logger part.

### Transport

A transport communicates between a server and a client.
It handles encoding/decoding of data and sending/receiving.
The following transport providers are available:

- [gRPC](http://www.grpc.io) (Client,Server)
- pipe (in-process communication, designed for testing)

### Endpoint

An endpoint is one function of a service. At the client side an endpoint is an exposed service function of one server.
On the server it is one exposed business logic function. Endpoints connect to each other via transports.

### Configuration

[service-config](https://github.com/restorecommerce/service-config) provides configuration management which uses [nconf](https://github.com/indexzero/nconf).
The ``config.get`` function loads the configuration from files located in the subdirectory 'cfg' of the current working directory.
Environment variables overwrite configuration values from files.
``config.load`` loads the configuration file from a different location.

```js
const config = require('chassis-srv').config;
yield config.load(pathToTheParentOfCfg);
yield config.get();
```

### Logging

[logger](https://github.com/restorecommerce/logger) provides logging which uses [winston](https://github.com/winstonjs/winston).
Clients, the server and the events provider provide the logger.
The configuration file contains logger settings.
The logger is available from ``Client.logger``, ``Server.logger`` or ``Events.logger``.

Default logging levels are:
- silly
- verbose
- debug
- info
- warn
- error

To create a log call ``logger.<level>(message, ...args)``. The ``level`` being one of the levels defined above, ``message`` is a string and ``...args `` is a list of objects.

### Health

The Health check  of microservices is done using a RPC endpoint.
```js
const config = require('chassis-srv').config;
const cfg = yield config.get();
const client = new Client(cfg.get('client:health'));
health = yield client.connect();
const resp = yield health.check({
  service: 'serviceName',
});
```
The response contains a Status field which could be : 'SERVING' , 'NOT_SERVING' or 'UNKNOWN'.

### Server

A server provides service endpoints. Endpoints expose each business logic function via a transports. Clients connect to these endpoints.
When a client calls a server endpoint it traverses from the transport through possible middleware to the business logic function.
The business logic processes the request and respond with either a result or an error. The transport transports the response back to the client.

The following code starts a server and provides the service endpoints.

```js
const chassis = require('chassis-srv');
const cfg = yield chassis.config.get();
const server = new chassis.Server(cfg.get('server'));
const service = new Service();
yield server.bind('serviceName', service);
yield server.start();
```

It is possible to bind different service to one server by calling ``yield server.bind(serviceName, service);`` multiple times.

#### Config

Each configured endpoint specifies which transport to use, to provide an endpoint.
Configuration for specified endpoints goes into the ``transports`` section.

```json
{
  "server": {
    "services": {
      "notifyd": {
        "create": {
          "transport": ["notifydGRPC"]
        },
        "createStream": {
          "transport": ["notifydGRPC"]
        }
      }
    },
    "transports": [{
      "name": "notifydGRPC",
      "provider": "grpc",
      "services": {
        "notifyd": "io.restorecommerce.notify.Notifyd"
      },
      "addr": "localhost:50051",
      "protoRoot": "protos/",
      "protos": ["io/restorecommerce/notify.proto"],
    }]
  }
}
```

#### Service

The business logic is an object with functions which get wrapped and served as endpoints.
Functions get wrapped up based on the configuration file.

#### Middleware

The request traverses the middleware before reaching the service function.
The middleware can call the next middleware until the last middleware calls the service function.

```js
function makeMiddleware() {
  return function*(next) {
    return function*(call, context){
      return yield next(call, context);
    };
  };
}
server.middleware.push(makeMiddleware());
```

### database

Database provider are available for the following databases:

* ArangoDB
* NeDB

All providers follow the same API which is similar to the NeDB/MongoDB API.

The following code creates a database connection and inserts a new document.

```js
const chassis = require('chassis-srv');
const cfg = yield chassis.config.get();
const db = yield chassis.database.get(cfg.get('ephemeral'));
const notification = {
  id: 'unique',
};
yield db.insert('notifications', notification);
```

The configuration file looks like this.

```json
{
  "database": {
    "ephemeral": {
      "provider": "nedb",
      "collections": {
        "notifications": {}
      }
    }
  }
}
```

The field ``id`` is the main unique identifier.
Conversion happens between the main unique identifier and the equivalent unique ID in each database provider.

### cache

Caches can be loaded with the cache loading function ``cache.get``.
Cache providers are registered with the ``cache.register`` functions.
The cache manager is the (node-cache-manager)[https://github.com/BryanDonovan/node-cache-manager].
By default only the memory provider is registered.

To create a cache manager call the ``cache.get`` function as follows.

```js
const chassis = require('chassis-srv');
const cfg = yield chassis.config.get();
const memory = yield chassis.cache.get(cfg.get('cache:memory'), logger);
```

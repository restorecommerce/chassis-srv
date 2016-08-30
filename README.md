# chassis-srv [![Build Status](https://travis-ci.org/restorecommerce/chassis-srv.svg?branch=master)](https://travis-ci.org/restorecommerce/chassis-srv) [![Coverage Status](https://coveralls.io/repos/github/restorecommerce/chassis-srv/badge.svg?branch=master)](https://coveralls.io/github/restorecommerce/chassis-srv?branch=master)

In development. The API is not stable.

## Features

- Expose your business logic as RPC endpoints
- Emit and listen to events from other microservices like when you would use Node.js events
- Middleware for client and server
- Includes endpoint discovery, load balancing, retry and timeout logic
- Uses ES6 features

## Install

To install the chassis just run ``npm install restorecommerce/chassis-srv``.

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

The chassis is split into a cache, config, database, events, logger, client and server part.
The client connects via transports to other servers and offers these endpoints.
A Server exposes endpoints via transports.
The events provide a pub/sub model like the NodeJS events module.
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

### Events

The chassis provides a similar event API to [Node.js events](https://nodejs.org/api/events.html).
A provider broadcasts emitted events to listeners.
The provider takes care of packaging the event and distributing it to listeners.
The following events providers are available:

- [Kafka](https://kafka.apache.org/)
- Local (in-process events, designed for testing)

### Configuration

[restore-server-config](https://github.com/restorecommerce/server-config) provides configuration management which uses [nconf](https://github.com/indexzero/nconf).
The ``config.get`` function loads the configuration from files located in the subdirectory 'cfg' of the current working directory.
Environment variables overwrite configuration values from files.
``config.load`` loads the configuration file from a different location.

```js
const config = require('restore-chassis-srv').config;
yield config.load(pathToTheParentOfCfg);
yield config.get();
```

### Logging

[restore-logger](https://github.com/restorecommerce/logger) provides logging which uses [winston](https://github.com/winstonjs/winston).
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

### Client

Clients connect to servers via transports and provide endpoints. When calling an endpoint the request traverses on the client side possible middleware, retry and timeout logic, load balancing and finally it reaches the transport. The transport encodes the request and sends it to the server. The response from the server is directly provided as a result or an error.

#### Retry

Failing endpoints retry calling with the retry mechanism. When providing multiple instances of the endpoint to the publisher, depending on the used load balancer, the retried endpoint is not the same instance. The retry number specifies the amount of additional attempts.

```js
yield service.endpoint({}, {retry:3}),
```

#### Timeout

It is possible to add a timeout to an endpoint call. The timeout number is in milliseconds.

```js
yield service.endpoint({}, {timeout:100}),
```

#### Middleware

The call traverses middleware before calling the endpoint. The middleware can call the next middleware until the last middleware calls the endpoint.

```js
function makeMiddleware() {
  return function*(next) {
    return function*(request, context){
      return yield next(request, context);
    };
  };
}
client.middleware.push(makeMiddleware());
```

#### Publisher

A publisher provides endpoints to a loadbalancer. Most publisher call a factory function to generate an endpoint from an instance.

Publishers:

- FixedPublisher
- StaticPublisher

#### LoadBalancer

A loadbalancer picks an endpoint from the publisher. Which endpoint gets selected depends on it's strategy.

LoadBalancers:

- Random
- RoundRobin

#### Config

The client requires a configuration file which specifies to which services to connect,
what transport to use, which endpoints to create, how to discover endpoints and how to balance calls.

By default the client uses the RoundRobin loadbalancer.
Setting the config value config.loadbalancer enables a different default loadbalancers.
Providing a client.publisher config value, sets a default publisher for all endpoints.
Each endpoint can overwrite the default loadbalancer and publisher.

Short example config file.

```json
{
  "client": {
    "user": {
      "transports": {
        "grpc": {
          "service": "io.restorecommerce.notify.Notifyd",
          "protoRoot": "protos/",
          "protos": ["io/restorecommerce/notify.proto"],
          "timeout": 3000
        }
      },
      "publisher": {
        "name": "static",
        "instances": ["grpc://localhost:50051"]
      },
      "endpoints": {
        "create": {},
        "createStream": {}
      }
    }
  }
}
```

Extended example configuration file

```json
{
  "client": {
    "user": {
      "transports": {
        "grpc": {
          "service": "io.restorecommerce.notify.Notifyd",
          "protoRoot": "protos/",
          "protos": ["io/restorecommerce/notify.proto"],
          "timeout": 3000
        }
      },
      "endpoints": {
        "create": {
          "loadbalancer": {
            "name": "roundRobin"
          },
          "publisher": {
            "name": "static",
            "instances": ["grpc://localhost:50051"]
          }
        },
        "createStream": {
          "loadbalancer": {
            "name": "random",
            "seed": 1
          },
          "publisher": {
            "name": "static",
            "instances": ["grpc://localhost:50051"]
          }
        }
      }
    }
  }
}
```

### Server

A server provides service endpoints. Endpoints expose each business logic function via a transports. Clients connect to these endpoints.
When a client calls a server endpoint it traverses from the transport through possible middleware to the business logic function.
The business logic processes the request and respond with either a result or an error. The transport transports the response back to the client.

The following code starts a server and provides the service endpoints.

```js
const cfg = yield chassis.config.get();
const server = new chassis.microservices.Server(cfg.get('server'));
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

### Events

The following example subscribes to a topic named ``com.example.visits`` and
listens to events called ``visit``.
On an event the ``listener`` is called with the event message.
The listener are either generator functions or normal functions.

```js
const chassis = require('restore-chassis-src');
const topicName = 'com.example.visits';
const eventName = 'visit';
const cfg = yield chassis.config.get();
const events = new chassis.events.Events(cfg.get('events:example'));
const listener = function*(message) {};
const topic = yield events.topic(topicName);
yield topic.on(eventName, listener);
```

To emit an event to the topic call:

```js
yield topic.emit(eventName, { url: 'example.com' });
```

### database

Database provider are available for the following databases:

* ArangoDB
* NeDB

All providers follow the same API which is similar to the NeDB/MongoDB API.

The following code creates a database connection and inserts a new document.

```js
const chassis = require('restore-chassis-srv');
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
const chassis = require('restore-chassis-srv');
const cfg = yield chassis.config.get();
const memory = yield chassis.cache.get(cfg.get('cache:memory'), logger);
```

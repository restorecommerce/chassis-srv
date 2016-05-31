# restore-cassis

## Features

- Expose your busniss logic as RPC endpoints
- Emit and listen to events from other microservices like if you would use NodeJS events
- Middleware for client and server
- Includes endpoint discovery, load balancing, retry and timeout

## Install

The chassis has a few dependencies from the init_modules module collection. Which are required for the database provider. To install the chassis run the following commands. You need to adapt the paths to your local directory structure.

```
npm-link-shared svn.n-fuse.de/svn/nf/invend/trunk/int_modules/ gitlab.n-fuse.de/restorecommerce/chassis-srv/ restore-gss restore-aql-function
npm install
```

## Architecture

The chassis is split into a server and a client part. Both parts require configuration file(s). The client connects via transports to other servers and provides these endpoints. A Server exposes endpoints via transports, it can also listen to evens and emit them.

### Transport

A transport communicates between a server and a client. It handles encoding/decoding of data and sending/receving. The following transport providers are available:

- [gRPC](http://www.grpc.io) (Client,Server)

### Endpoint

An endpoint is one function of a service. At the client side an endpoint is an exposed service function of one server. On the server it is one exposed business logic function. Endpoints are connected via transports.

### Events

The chassis provides a similar event API to [Node.js events](https://nodejs.org/api/events.html). An emitted event is broadcasted by a provider to listeners. The provider takes care of packaging the event and distributing it to listeners. The following events providers are available:

- [Kafka](https://kafka.apache.org/)

### Configuration

Configuration is handled by [restore-server-config](https://github.com/restorecommerce/server-config) which uses [nconf](https://github.com/indexzero/nconf). The chassis loads the required configuration from files located in the subdirectory 'cfg' of the current working directory. Environment variables overwrite configuration values from files.

### Logging

Logging is handled by [restore-logger](https://github.com/restorecommerce/logger) which uses [winston](https://github.com/winstonjs/winston). A logger is created with each client and server. The logger can be configured.

### Client

Clients connect to servers via transports and provide endpoints. When calling an endpoint the request traverses on the client side possible middleware, retry and timeout logic, load balancing and finally it reaches the transport. The transport encodes the request and sends it to the server. The response from the server is directly provided as a result or an error.

#### Retry

Failing endpoints can be retried with the retry mechanism. When providing multiple instances of the endpoint to the publisher, depending on the used load balancer, the retried endpoint is not the same instance. The retry number specifies the amount of additional attempts.

```javascript
yield service.endpoint({}, {retry:3}),
```

#### Timeout

Endpoints can be called with a timeout. The timeout number is in milliseconds.

```javascript
yield service.endpoint({}, {timeout:100}),
```

#### Middleware

Middleware is called before the endpoint. The middleware can call the next middleware until the last middleware calls the endpoint.

```javascript
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

- StaticPublisher

#### LoadBalancer

A loadbalancer picks an endpoint from the publisher. Which endpoint gets selected depends on it's strategy.

LoadBalancers:

- random
- roundRobin

#### Config

The client requires a configuration file which specifies to which services to connect, what transport to use, which endpoints to create, how to discover endpoints and how to balance calls.

By default the client uses the roundRobin loadbalancer.
A different default loadbalancer can be set by adding a config value config.loadbalancer.
Providing a client.publisher config value, sets a default publisher for all endpoints.
Each endpoint can overwrite the default loadbalancer and publisher.

Short example config file.
```json
{
  "client": {
    "user": {
      "transports": {
        "grpc": {
          "package": "io.restorecommerce.user.User",
          "timeout": 3000
        }
      },
      "publisher": {
        "name": "static",
        "instances": ["grpc://localhost:50051"]
      },
      "endpoints": {
        "get": {},
        "register": {}
      }
    }
  }
}
```

Extended example config file
```json
{
  "client": {
    "user": {
      "transports": {
        "grpc": {
          "package": "io.restorecommerce.user.User",
          "timeout": 3000
        }
      },
      "endpoints": {
        "get": {
          "loadbalancer": {
            "name": "roundRobin"
          },
          "publisher": {
            "name": "static",
            "instances": ["grpc://localhost:50051"]
          }
        },
        "register": {
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

A server can provide service endpoints, listen to events, emit events. Each business logic function is exposed via a transport as an endpoint. Clients connect to these endpoints. When a client calls a server endpoint it traverses from the transport through possible middleware to the business logic function. The business logic processes the request and respond with either a result or an error. The response is transported back to the client.

#### Config

In the following configuration only the endpoint part is configured. Listening and emitting events is not possible. Each configured endpoint specifies which transport to use to provide an endpoint. Every transport, specified in the endpoints section, needs to be listed in the transports with it's configuration.

```json
{
  "server": {
    "endpoints": {
      "activate": {
        "transport": ["grpc"]
      },
      "changePassword": {
        "transport": ["grpc"]
      },
      "get": {
        "transport": ["grpc"]
      },
      "register": {
        "transport": ["grpc"]
      },
      "unregister": {
        "transport": ["grpc"]
      }
    },
    "transports": [{
      "name": "grpc",
      "package": "io.restorecommerce.user.User",
      "addr": "localhost:50051"
    }]
  }
}
```

In the following configuration only the events part of the server is configured. No endpoints are provided by the server. Only listening and emitting events is possible. The event provider is Kafka.

```json
{
  "server": {
    "events": {
      "provider": {
        "name": "kafka",
        "groupId": "restore-chassis-example-server",
        "clientId": "restore-chassis-example-server",
        "connectionString": "localhost:9092",
      }
    }
  }
}
```

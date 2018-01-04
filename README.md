# chassis-srv [![Build Status](https://travis-ci.org/restorecommerce/chassis-srv.svg?branch=master)](https://travis-ci.org/restorecommerce/chassis-srv) [![Coverage Status](https://coveralls.io/repos/github/restorecommerce/chassis-srv/badge.svg?branch=master)](https://coveralls.io/github/restorecommerce/chassis-srv?branch=master)

An engine for microservice operations.

## Features

- Expose your business logic as RPC endpoints
- Customize server communication with middlewares
- Endpoint discovery, load balancing, retry and timeout logic
- Uses ES6 features
- Handle multiple microservice recurrent functionalities, such as logging, database access, cache handling or exposing system commands.

## Architecture

The chassis consists of a cache, command interface, config, database, logger and server part.
A [Server](src/microservice/server.ts) can be instantiated in order to generically expose gRPC endpoints 
given a protobuf interface and a transport config.
The cache part handles loading of caches based on configuration files.
A provider-based mechanism allows to access different databases.
A configurable log infrastructure is provided.

### Cache

Caches can be loaded with the cache loading function ``cache.get``. Cache providers are registered with the ``cache.register`` functions. Caches are managed with (node-cache-manager)[https://github.com/BryanDonovan/node-cache-manager].

### Command interface

A shared interface for system commands is also implemented. For more details
about all operations please refer
[command-interface](https://github.com/restorecommerce/chassis-srv/command-interface.md).


### Config
  
Configs are loaded using the [nconf](https://github.com/indexzero/nconf)-based module [service-config](https://github.com/restorecommerce/service-config). Such configuration files may contain endpoint specifications 
along with their associated transports or simple access credentials for backing services such as a database or a Kafka server.

### Database 

The following database providers are implemented:

* ArangoDB
* NeDB

Query messages bear similarity in structure with the NeDB/MongoDB API. CRUD operations are performed using [resource-base-interface](https://github.com/restorecommerce/resource-base-interface).

### Logging

Logginf functionality is provided through [logger](https://github.com/restorecommerce/logger), which uses [winston](https://github.com/winstonjs/winston). Logger output transport, severity levels and other options are configurable.

Default logging levels are:
- silly
- verbose
- debug
- info
- warn
- error

### Server

A server provides service endpoints. Endpoints expose each business logic function via a transports. Clients connect to these endpoints.
When a client calls a server endpoint it traverses from the transport through possible middleware to the business logic function.
The business logic processes the request and respond with either a result or an error. The transport transports the response back to the client.

The following code starts a server and provides the service endpoints. Note that multiple services can be binded with the same `Server` instance.

#### Transports

Although this module is mainly based on one type of transport for business logic exposure (gRPC), it is also possible
to use `pipe` ((in-process communication, designed for testing). Transport details are configurable for each endpoint.

#### Endpoints

An endpoint is a wrapped gRPC method accessible from any gRPC clients. At the client side an endpoint is an exposed service function of one server.
On the server it is one exposed business logic function. Endpoints connect to each other via transports.

#### Middleware

The request traverses the middleware before reaching the service function.
The middleware can call the next middleware until the last middleware calls the service function.

## Usage

See [tests](tests/).


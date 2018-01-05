# chassis-srv 
<img src="http://img.shields.io/npm/v/%40restorecommerce%2Fkafka%2Dclient.svg?style=flat-square" alt="">[![Build Status][build]](https://travis-ci.org/restorecommerce/chassis-srv?branch=master)[![Dependencies][depend]](https://david-dm.org/restorecommerce/chassis-srv)[![Coverage Status][cover]](https://coveralls.io/github/restorecommerce/chassis-srv?branch=master)

[version]: http://img.shields.io/npm/v/chassis-srv.svg?style=flat-square
[build]: http://img.shields.io/travis/restorecommerce/chassis-srv/master.svg?style=flat-square
[depend]: https://img.shields.io/david/restorecommerce/chassis-srv.svg?style=flat-square
[cover]: http://img.shields.io/coveralls/restorecommerce/chassis-srv/master.svg?style=flat-square

An engine for diverse microservice operations.

## Features

- Expose your business logic as RPC endpoints
- Customize server communication with middlewares
- Endpoint discovery, load balancing, retry and timeout logic
- Handle multiple microservice recurrent functionalities, such as logging, database access, cache handling or exposing system commands.

## Architecture

The chassis consists of a cache, command interface, config, database, logger and server part.
The cache part handles loading of caches based on configuration files.
A provider-based mechanism allows to access different databases.
A configurable log infrastructure is also provided.
A [Server](src/microservice/server.ts) can be instantiated in order to generically expose [gRPC](https://grpc.io/docs/) endpoints given a [Protocol Buffer](https://developers.google.com/protocol-buffers/docs/overview) interface and a transport config.

### Cache

Multiple cache providers can be registered and loaded within a microservice. Such providers are managed with (node-cache-manager)[https://github.com/BryanDonovan/node-cache-manager].

### Command interface

A shared interface for system commands (useful information retrieval, system control, etc) is also implemented. For more details
about all operations please refer
[command-interface](https://github.com/restorecommerce/chassis-srv/command-interface.md).


### Config
  
Configs are loaded using the [nconf](https://github.com/indexzero/nconf)-based module [service-config](https://github.com/restorecommerce/service-config). Such configuration files may contain endpoint specifications 
along with their associated transports or simple access configs for backing services such as a database or even a Kafka instance.

### Database 

The following database providers are implemented:

* [ArangoDB](https://www.arangodb.com/documentation/)
* [NeDB](https://github.com/louischatriot/nedb)

The structure of query messages is similar in structure with the NeDB/MongoDB API.

### Logging

Logging functionality is provided through [logger](https://github.com/restorecommerce/logger), which uses [winston](https://github.com/winstonjs/winston). Logger output transport, severity levels and other options are configurable.

Default logging levels are:
- silly
- verbose
- debug
- info
- warn
- error

### Server

A [Server](src/microservice/server.ts) provides service endpoints. An endpoint is a wrapped gRPC method accessible from any gRPC clients. 
At the client side an endpoint is an exposed service function of one server.
On the server it is one exposed business logic function. Endpoints connect to each other via transports. Clients connect to these endpoints. 
Endpoint calls may be intercepted with multiple chained middlewares, depending on the business logic. Service responses always include a result or an error. 
When a `Server` is instantiated, it is possible to bind one or more services to it, each of them exposing its own RPC endpoints with an associated transport configuration (port, protobuf interfaces, service name, etc). 
Although this module is mainly based on one type of transport for business logic exposure (gRPC), it is also possible to use `pipe` (in-process communication, designed for testing). Note that other transport types beside `gRPC` and `pipe` are theoretically possible, although that would require an extension of the `Server` class with a custom transport config. 

## Usage

See [tests](tests/).


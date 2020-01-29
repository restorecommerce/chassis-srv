# chassis-srv
[![Build Status][build]](https://travis-ci.org/restorecommerce/chassis-srv?branch=master)[![Dependencies][depend]](https://david-dm.org/restorecommerce/chassis-srv)[![Coverage Status][cover]](https://coveralls.io/github/restorecommerce/chassis-srv?branch=master)

[build]: http://img.shields.io/travis/restorecommerce/chassis-srv/master.svg?style=flat-square
[depend]: https://img.shields.io/david/restorecommerce/chassis-srv.svg?style=flat-square
[cover]: http://img.shields.io/coveralls/restorecommerce/chassis-srv/master.svg?style=flat-square

A chassis for [Restorecommerce](https://github.com/restorecommerce/) microservices.

## Features

- Business logic exposed via gRPC
- Retry and timeout logic
- Endpoint calls with custom middleware
- Provide multiple microservice functionalities from the Restorecommerce ecosystem, such as logging, database access, cache handling or exposing system commands.

## Architecture

The chassis consists of 8 components:

- a configuration loader
- a multi-transport configurable log infrastructure
- a base Restorecommerce microservice structure provided by the [Server](src/microservice/server.ts) class, which emits state-related events and can be bound to a number of [gRPC](https://grpc.io/docs/) endpoints, given a [Protocol Buffer](https://developers.google.com/protocol-buffers/docs/overview) interface and a transport config
- custom middleware
- a cache-loader based on configuration files
- a provider-based mechanism to access different databases
- a base implementation for a [command-interface](command-interface.md)
- periodic storage for [Apache Kafka](https://kafka.apache.org/) topic offsets

### Config

Configs are loaded using the [nconf](https://github.com/indexzero/nconf)-based module [service-config](https://github.com/restorecommerce/service-config). Such configuration files may contain endpoint specifications
along with their associated transports or simple access configs for backing services such as a database or even a Kafka instance.


### Logging

Logging functionality is provided through [logger](https://github.com/restorecommerce/logger), which uses [winston](https://github.com/winstonjs/winston). Logger output transport, severity levels and other options are configurable.

Default logging levels are:
- `silly`
- `verbose`
- `debug`
- `info`
- `warn`
- `error`

### Server

A [Server](src/microservice/server.ts) instance can provide multiple service endpoints and emits events related with the microservice's state. An endpoint is a wrapped gRPC method accessible from any gRPC clients. It is also possible to configure the Server with number of times a request should be [`retried and timeout configurations`](./test/microservice_test.ts#L440). Service responses always include a result or an error. When a `Server` is instantiated, it is possible to bind one or more services to it, each of them exposing its own RPC endpoints with an associated transport configuration (port, protobuf interfaces, service name, etc). Note that other transport types beside `gRPC` are theoretically possible, although that would require an extension of the `Server` class with a custom transport config.

### Middleware

Endpoint calls may be intercepted with any number of [custom chained middlewares](./test/middleware_test.ts). The request traverses the middleware before reaching the service function. The middleware can call the next middleware until the last middleware calls the service function.

### Cache

Multiple cache providers can be registered and loaded within a microservice. Such providers are managed with [node-cache-manager](https://github.com/BryanDonovan/node-cache-manager).

### Database

The following database providers are implemented:

* [ArangoDB](https://www.arangodb.com/documentation/)
* [NeDB](https://github.com/louischatriot/nedb)

Providers include generic database handling operations (find, insert, upsert delete, truncate, etc). Query parameter structure for all exposed operations is similar with the structure used in [MongoDB](https://docs.mongodb.com/manual/tutorial/getting-started/) queries.
The ArangoDB provider supports graph database creation and exposes a simple API to manage vertices and edges.
It also provides a flexible traversal method. For more details, see [graph tests](test/graphs_test.ts) and the [ArangoDB graphs documentation](https://docs.arangodb.com/3.3/HTTP/Gharial/).
Database providers can be used as a database abstration by any service that owns a set of resources. Furthermore, services can later expose their database operations via gRPC. Exposure of these operations is easily achieved using the [resource-base-interface](https://github.com/restorecommerce/resource-base-interface).

### Command interface

An interface for system commands (useful information retrieval, system control, etc) is also provided. For more details about all implemented operations please refer
[command-interface](command-interface.md).
This interface can be directly exposed as a gRPC endpoint and it can be extended by a microservice for custom functionalities.

### Offset Store

This stores the offset values for each Kafka topic within each microservice at a fixed interval to a [Redis](https://redis.io/) database. Such intervals are configurable through the `offsetStoreInterval` configuration value.
The offset values are stored with key `{kafka:clientId}:{topicName}`.
In case of a service failure, a microservice can then read the last offset it stored before crashing and thus consume all pending messages since that moment.
This feature can be disabled if the `latestOffset` configuration value is set to `true` - in this case, the service subscribes to the latest topic offset value upon system restart.

## Development

### Tests

See [tests](test/). To execute the tests a set of _backing services_ are needed.
Refer to [System](https://github.com/restorecommerce/system) repository to start the backing-services before running the tests.

- To run tests

```sh
npm run test
```

## Usage

- Install dependencies

```sh
npm install
```

- Build

```sh
# compile the code
npm run build
```

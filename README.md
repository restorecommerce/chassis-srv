# restore-cassis

## Architecture

The chassis is split into a server and a client part.
Both parts require configuration file(s).
The client connects via transports to other servers and provides these endpoints.
A Server exposes endpoints via transports, it can also listen to evens and emit them.

### Transport

A transport communicates between a server and a client.
It handles encoding/decoding of data and sending/receving.
The following transport providers are available:
+ [gRPC](http://www.grpc.io) (Client,Server)

### Endpoint

An endpoint is one function of a service.
At the client side an endpoint is an exposed service function of one server.
On the server it is one exposed business logic function.
Endpoints are connected via transports.

### Events

The chassis provides a similar event API to [Node.js events](https://nodejs.org/api/events.html).
An emitted event is broadcasted by a provider to listeners.
The provider takes care of packaging the event and distributing it to listeners.
The following events providers are available:
+ [Kafka](https://kafka.apache.org/)

### Configuration

Configuration is handled by [restore-server-config](https://github.com/restorecommerce/server-config) which uses [nconf](https://github.com/indexzero/nconf).
The chassis loads the required configuration from files located in
the subdirectory 'cfg' of the current working directory. Environment variables
overwrite configuration values from files.

### Logging

Logging is handled by [restore-logger](https://github.com/restorecommerce/logger)
which uses [winston](https://github.com/winstonjs/winston).
A logger is created with each client and server. The logger can be configured.


### Client

Clients connect to servers via transports and provide endpoints.
When calling an endpoint the request traverses on the client side
possible middleware, retry and timeout logic, load balancing and
finally it reaches the transport. The transport encodes the request and sends it
to the server.
The response from the server is directly provided as a result or an error.

#### Config

The client requires a configuration file which specifies
to which services to connect, what transport to use, which endpoints to create,
how to discover endpoints and how to balance calls.

Example config file
```json
{
  "client": {
    "user": {
      "transports": {
        "grpc": {
          "proto": "/protos/user.proto",
          "package": "user",
          "service": "User",
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

A server can provide service endpoints, listen to events, emit events.
Each business logic function is exposed via a transport as an endpoint.
Clients connect to these endpoints.
When a client calls a server endpoint it traverses from the transport through
possible middleware to the business logic function.
The business logic processes the request and respond with either a result or an error.
The response is transported back to the client.

#### Config

In the following configuration only the endpoint part is configured.
Listening and emitting events is not possible. Each configured endpoint specifies
which transport to use to provide an endpoint.
Every transport, specified in the endpoints section, needs to be listed in the
transports with it's configuration.
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
      "config": {
        "proto": "/../../protos/user.proto",
        "package": "user",
        "service": "User",
        "addr": "localhost:50051"
      }
    }]
  }
}
```

In the following configuration only the events part of the server is configured.
No endpoints are provided by the server. Only listening and emitting events is possible.
The event provider is Kafka.
```json
{
  "server": {
    "events": {
      "provider": {
        "name": "kafka",
        "config": {
          "groupId": "restore-chassis-example",
          "clientId": "restore-chassis-example",
          "connectionString": "localhost:9092"
        }
      }
    }
  }
}
```

## Features

### done:

+ endpoint
  + publisher
    + static
  + loadbalancer
      + random
      + roundrobin
+ log
+ service
  + client
  + server
+ transport
  + grpc

### TODO:
Some of these points depend on the orchestration software in use.
Kubernetes has service discovery, load balancing and config provision build in.

[Mindmap of the docker ecosystem](https://www.mindmeister.com/389671722/docker-ecosystem)

+ config
  + file
  + consul/etcd/zookeeper
+ circuitbreaker
  + hystrixjs
+ database
  + arangodb
  + mongodb
  + redis
+ endpoint
    + publisher
      + consul/etcd/zookeeper
+ health checks
+ metrics
  + prometheus
  + elasticsearch (Kibana)
+ ratelimit
+ log
  + tracing
    + opentracing

## gRPC

### status codes

```js
grpc.status = {
  OK: 0,
  CANCELLED: 1,
  UNKNOWN: 2,
  INVALID_ARGUMENT: 3,
  DEADLINE_EXCEEDED: 4,
  NOT_FOUND: 5,
  ALREADY_EXISTS: 6,
  PERMISSION_DENIED: 7,
  UNAUTHENTICATED: 16,
  RESOURCE_EXHAUSTED: 8,
  FAILED_PRECONDITION: 9,
  ABORTED: 10,
  OUT_OF_RANGE: 11,
  UNIMPLEMENTED: 12,
  INTERNAL: 13,
  UNAVAILABLE: 14,
  DATA_LOSS: 15
}
```

Explanation from gRPC Go documentation
``` go
const (
    // OK is returned on success.
    OK  Code = 0

    // Canceled indicates the operation was cancelled (typically by the caller).
    Canceled Code = 1

    // Unknown error.  An example of where this error may be returned is
    // if a Status value received from another address space belongs to
    // an error-space that is not known in this address space.  Also
    // errors raised by APIs that do not return enough error information
    // may be converted to this error.
    Unknown Code = 2

    // InvalidArgument indicates client specified an invalid argument.
    // Note that this differs from FailedPrecondition. It indicates arguments
    // that are problematic regardless of the state of the system
    // (e.g., a malformed file name).
    InvalidArgument Code = 3

    // DeadlineExceeded means operation expired before completion.
    // For operations that change the state of the system, this error may be
    // returned even if the operation has completed successfully. For
    // example, a successful response from a server could have been delayed
    // long enough for the deadline to expire.
    DeadlineExceeded Code = 4

    // NotFound means some requested entity (e.g., file or directory) was
    // not found.
    NotFound Code = 5

    // AlreadyExists means an attempt to create an entity failed because one
    // already exists.
    AlreadyExists Code = 6

    // PermissionDenied indicates the caller does not have permission to
    // execute the specified operation. It must not be used for rejections
    // caused by exhausting some resource (use ResourceExhausted
    // instead for those errors).  It must not be
    // used if the caller cannot be identified (use Unauthenticated
    // instead for those errors).
    PermissionDenied Code = 7

    // Unauthenticated indicates the request does not have valid
    // authentication credentials for the operation.
    Unauthenticated Code = 16

    // ResourceExhausted indicates some resource has been exhausted, perhaps
    // a per-user quota, or perhaps the entire file system is out of space.
    ResourceExhausted Code = 8

    // FailedPrecondition indicates operation was rejected because the
    // system is not in a state required for the operation's execution.
    // For example, directory to be deleted may be non-empty, an rmdir
    // operation is applied to a non-directory, etc.
    //
    // A litmus test that may help a service implementor in deciding
    // between FailedPrecondition, Aborted, and Unavailable:
    //  (a) Use Unavailable if the client can retry just the failing call.
    //  (b) Use Aborted if the client should retry at a higher-level
    //      (e.g., restarting a read-modify-write sequence).
    //  (c) Use FailedPrecondition if the client should not retry until
    //      the system state has been explicitly fixed.  E.g., if an "rmdir"
    //      fails because the directory is non-empty, FailedPrecondition
    //      should be returned since the client should not retry unless
    //      they have first fixed up the directory by deleting files from it.
    //  (d) Use FailedPrecondition if the client performs conditional
    //      REST Get/Update/Delete on a resource and the resource on the
    //      server does not match the condition. E.g., conflicting
    //      read-modify-write on the same resource.
    FailedPrecondition Code = 9

    // Aborted indicates the operation was aborted, typically due to a
    // concurrency issue like sequencer check failures, transaction aborts,
    // etc.
    //
    // See litmus test above for deciding between FailedPrecondition,
    // Aborted, and Unavailable.
    Aborted Code = 10

    // OutOfRange means operation was attempted past the valid range.
    // E.g., seeking or reading past end of file.
    //
    // Unlike InvalidArgument, this error indicates a problem that may
    // be fixed if the system state changes. For example, a 32-bit file
    // system will generate InvalidArgument if asked to read at an
    // offset that is not in the range [0,2^32-1], but it will generate
    // OutOfRange if asked to read from an offset past the current
    // file size.
    //
    // There is a fair bit of overlap between FailedPrecondition and
    // OutOfRange.  We recommend using OutOfRange (the more specific
    // error) when it applies so that callers who are iterating through
    // a space can easily look for an OutOfRange error to detect when
    // they are done.
    OutOfRange Code = 11

    // Unimplemented indicates operation is not implemented or not
    // supported/enabled in this service.
    Unimplemented Code = 12

    // Internal errors.  Means some invariants expected by underlying
    // system has been broken.  If you see one of these errors,
    // something is very broken.
    Internal Code = 13

    // Unavailable indicates the service is currently unavailable.
    // This is a most likely a transient condition and may be corrected
    // by retrying with a backoff.
    //
    // See litmus test above for deciding between FailedPrecondition,
    // Aborted, and Unavailable.
    Unavailable Code = 14

    // DataLoss indicates unrecoverable data loss or corruption.
    DataLoss Code = 15
)
```

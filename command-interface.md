# command-interface

The command interface defines common functions for controlling and retrieving operational information from services through a unique endpoint named `Command`. This endpoint is mainly targeted for exposure through a [gRPC](https://grpc.io/docs/) interface and event-driven communication through Kafka. Request and response message structures  are defined using [Protocol Buffers](https://developers.google.com/protocol-buffers/) in the [commandinterface.proto](https://github.com/restorecommerce/protos/blob/master/io/restorecommerce/commandinterface.proto) file. Due to the high variability among all command possible parametes, the `payload` field is defined as a `google.protobuf.Any` message (see [google] protos), as well as all gRPC response messages. The `CommandResponse` message is mainly used on Kafka events, as it contains a `services` field, which identifies all services bound to a specific microservice. 

The `CommandResource` message defines generically a command as a database resource. This message structure should be used to define all commands and associated fields in the database, so that they can be visualized whenever it is useful.
The following system commands are implemented:

- check (microservice health check)
- restore (re-process [Apache Kafka](https://kafka.apache.org/) event messages to restore system data and state)
- reset (reset system data and state)
- version (return runtime version information)

Unimplemented:
- reconfigure (reload configurations)

Note that the provided implementation's commands can be extended or even overriden when it is partially or totally incompatible with a service's context. It is also straightforward to include new commands by extending the given [CommandInterface](src/command-interface/index.ts) class.

## gRPC Interface

### Command 

| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| name | string | required | name of the command |
| payload | `google.protobuf.Any` | optional | command-specific parameters |

## Implemented Commands

### Check

This command allows the health status retrieval for a service (note that a [restorecommerce](https://github.com/restorecommerce/) microservice may have several service names bound to it). 

Possible `payload` fields in a request:

| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| service | string | required | name of the service to be checked |

Possible fields in a response:
| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| status | string | required | serving status; it can be SERVING, NOT_SERVING and UNKNOWN |

### Restore

This command is used for restoring the state of an implementing service, as well as all data managed by that service. The default implementation checks the configuration files for all DB instances bound to the implementing service and maps a set of Kafka events to a a set of CRUD operations. 
These Kafka events are emitted by the service every time a modifying operation occurs in the database. The same events are re-processed in order to restore all data. 

Possible `payload` fields in a request:

| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| topics | [ ]Topic | required | list of topics for message re-processing |

`Topic`

| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| topic | string | required | topic name associated with a resource |
| offset | number | optional | offset at which to start the restore process; default is 0 |
| ignore_offset | [ ]number | optional | topic offset values to ignore while restoring |

### Reset

This command is used to wipe all data managed by a service.
Currently only the ArangoDB provider is supported and this command's default implementation truncates the DB. There are no specific parameters either for the request payload and for the response.

### Version

This command returns the NPM package and Node.js version of the implementing service. 

Response fields:

| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| version | string | required | NPM package version |
| nodejs | string | required | Node.js version |


## Usage

See [tests](test/command_test.ts).


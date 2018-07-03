# Command Interface

The generic command interface allows querying information from and triggering actions on microservices. Commands are usually used for administrative or operational concerns and should not be used for actions triggered by ordinary users. There are common commands but also such that are only understood by individual services. The command interface supports the following communication patterns:

- Fire-and-forget
- Request-reply

Technically, the command interface is described by the `Command` endpoint. This endpoint is available as [gRPC](https://grpc.io/docs/) interface and event-driven communication through Kafka. Request and response message structures are defined using [Protocol Buffers](https://developers.google.com/protocol-buffers/) in the [commandinterface.proto](https://github.com/restorecommerce/protos/blob/master/io/restorecommerce/commandinterface.proto) file. Due to the high variability among all command possible parametes, the `payload` field is defined as a `google.protobuf.Any` message (see [google](https://github.com/restorecommerce/protos/tree/master/google/protobuf) protos), as well as all gRPC response messages. The `CommandResponse` message is mainly used on Kafka events, as it contains a `services` field, which identifies all services bound to a specific microservice. 

The `CommandResource` resource can be used to build an introspectable catalog of available commands in a system made up by a set of microservices. Individual commands are then represented by entries in the collection of these resources. The data structure for such entries is defined in [command.proto](https://github.com/restorecommerce/protos/blob/master/io/restorecommerce/command.proto).
A command can be concisely described so that although the command interface itself is generic, a UI for each command can be built dynamically from interpreting command resource instances. For example:

```json
{
  "name": "health_check",
  "parameters": [
    {
      "field": "service",
      "description": "Name of the service to be checked (note that a microservice may have more than one 'service')"
    }
   ],
   "description": "A microservice health check."
}
```

The following common system commands are available (also see below):

- check (microservice health check)
- restore (re-process [Apache Kafka](https://kafka.apache.org/) event messages to restore system data)
- reset (reset system data and state)
- version (return runtime version information)

Unimplemented:

- reconfigure (reload configurations for one or more microservices)

Note that the provided implementation's commands can be extended or even overriden when it is partially or totally incompatible with a service's context. It is also straightforward to include new commands by extending the given [CommandInterface](src/command-interface/index.ts) class.

## gRPC Interface

### Command 

| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| name | string | required | name of the command |
| payload | `google.protobuf.Any` | optional | command-specific parameters |

## Common Commands

### Check

This command allows to retrieve a healt status for a service (note that a restorecommerce microservice may have several service names bound to it). 

Possible `payload` fields in a request:

| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| service | string | required | name of the service to be checked |

Possible fields in a response:

| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| status | string | required | serving status; it can be `SERVING`, `NOT_SERVING` and `UNKNOWN` |

### Restore

This command allows to restore the state of an implementing service, as well as all data managed by that service. The default implementation checks the configuration files for all DB instances bound to the implementing service and maps a set of Kafka events to a set of CRUD operations. 
These Kafka events are emitted by the service every time a resource is created/ modified in the store. The same events are processed from a Kafka consumer offset in order to restore all data since a previous a point in time.

**Note**: this event processing can only be done in the correct order with single partitioned-topics, as Kafka ensures offset order per-partition.

Possible `payload` fields in a request:

| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| data | [ ]RestoreData | required | list of topics for message re-processing |

`RestoreData`

| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| entity | string | required | The resource's entity name |
| base_offset | number | optional | Base offset at which to start the restore process; default is `0` |
| ignore_offset | [ ]number | optional | Topic offset values to ignore while restoring |

### Reset

This allows to wipe all data owned by a microservice.
The `chassis-srv` default implementation only supports the chassis ArangoDB database provider as a valid provider. When `reset` is called, each of the specified resource's DB is truncated. There are no specific parameters either for the request payload and for the response.

### Version

This command returns the NPM package and Node.js version of the implementing service. 

Response fields:

| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| version | string | required | NPM package version |
| nodejs | string | required | Node.js version |


## Usage

See [tests](test/command_test.ts).


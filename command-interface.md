# command-interface

The command-interface defines common functions for controlling and retrieving operational information from services. The commands are defined using [gRPC](https://grpc.io/docs/) interface. The message structures are defined using [Protocol Buffers](https://developers.google.com/protocol-buffers/) in the [commandinterface.proto](https://github.com/restorecommerce/protos/blob/master/io/restorecommerce/commandinterface.proto) file.

The following commands are available:

- check (health check)
- restore (re-process [Apache Kafka](https://kafka.apache.org/) event messages)
- reset (reset any state)
- sendMailNotification (triggers sending an email notification via Kafka)
- version (return runtime version information)
- reconfigure (reload configuration, not yet implemented)

## gRPC Interface

This interface describes the following gRPC endpoints.

### Check

This command is be used to get the health status of the implementing service. Requests are performed using `io.restorecommerce.commandinterface.HealthCheckRequest` and response are `io.restorecommerce.commandinterface.HealthCheckResponse`.

`io.restorecommerce.commandinterface.HealthCheckRequest`

| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| service | string | required | name of the implementing service |

`io.restorecommerce.commandinterface.HealthCheckResponse`

| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| status | ServingStatus | required | ServingStatus is enum of SERVING, NOT_SERVING and UNKNOWN status |

### Restore

This command is used for restoring the system of implementing service.
The implementing service would emit messages to Kafka Topic and upon receiving this command it would re-read those event messages from Kafka Topic and restore the system status to the point before failure.
Requests are performed using `io.restorecommerce.commandinterface.RestoreRequest` and response are `io.restorecommerce.commandinterface.RestoreResponse` an empty message.

`io.restorecommerce.commandinterface.RestoreRequest`

| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| topics | [ ]io.restorecommerce.commandinterface.RestoreTopic | required | list of topics for restoration |

`io.restorecommerce.commandinterface.RestoreTopic`

| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| topic | string | required | topic name to restore |
| offset | number | optional | offset at which to start the restore process, default is `0` |
| ignore_offset | [ ]number | optional | offset values to ignore while restoring |

### Reset

This command is used to wipe all state maintained by a serice.
Currently only the ArangoDB provider is supported and this command would truncate the DB. Both reqeusts and responses are emtpy messages, requests are performed using `io.restorecommerce.commandinterface.ResetRequest` and response are `io.restorecommerce.commandinterface.ResetResponse`.

### Version

This command returns npm package and nodejs version of the implementing service. Request is `google.protobuf.Empty` message and response is `io.restorecommerce.commandinterface.VersionResponse`.

`io.restorecommerce.commandinterface.VersionResponse`

| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| version | string | required | version of npm package |
| nodejs | string | required | nodejs version |


## Usage

See [tests](test/command_test).

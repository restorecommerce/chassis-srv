# command-interface

<img src="http://img.shields.io/npm/v/%40restorecommerce%2Fcommand%2Dinterface.svg?style=flat-square" alt="">[![Build Status][build]](https://travis-ci.org/restorecommerce/command-interface?branch=master)[![Dependencies][depend]](https://david-dm.org/restorecommerce/command-interface)[![Coverage Status][cover]](https://coveralls.io/github/restorecommerce/command-interface?branch=master)

[version]: http://img.shields.io/npm/v/command-interface.svg?style=flat-square
[build]: http://img.shields.io/travis/restorecommerce/command-interface/master.svg?style=flat-square
[depend]: https://img.shields.io/david/restorecommerce/command-interface.svg?style=flat-square
[cover]: http://img.shields.io/coveralls/restorecommerce/command-interface/master.svg?style=flat-square

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

### SendMailNotification

This command triggers sending email notification by emitting message to Kafka. This message is consumed by [notification-srv](https://github.com/restorecommerce/notification-srv) which internally uses [mailer](https://github.com/restorecommerce/mailer) to send email. Requests are performed using `io.restorecommerce.commandinterface.NotificationRequest` and responses are empty message `io.restorecommerce.commandinterface.NotificationResponse`.
This command could also be scheduled to be recurring using scheduling-srv and hence we have the additional fields for job details in the `NotificationRequest` message.

`io.restorecommerce.commandinterface.NotificationRequest`

| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| topic | string | required | topic name which the notification-srv is listening to |
| eventName | string | required | name of the event |
| message | string | optional | message to send |
| id | number | optional | job id |
| schedule_type | string | optional | type of schedule ONCE, RECURR etc |
| job_resource_id | string | optional | Job reference ID in the database |
| job_unique_name | string | optional | unique job name in redis |


## Usage

See [tests](test/).

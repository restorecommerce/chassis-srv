### 0.3.8 (February 18th, 2022)

- fixed offset store config

### 0.3.7 (February 11th, 2022)

- updated dependencies
- removed emitting healthcheck resposne to kafka
- migrate from ioredis to redis

### 0.3.6 (January 28th, 2022)

- restructured graph traversal api
- updated dependencies

### 0.3.5 (December 12th, 2021)

- updated RC dependencies

### 0.3.4 (December 9th, 2021)

- updated dependencies

### 0.3.3 (December 2nd, 2021)

- fix empty uniqueness vertices check

### 0.3.2 (September 6th, 2021)

- fix removeVertex response

### 0.3.1 (August 9th, 2021)

- fix options for protoLoader.loadSync to restore enums as strings

### 0.3.0 (August 4th, 2021)

- updated grpc-client, arangojs
- fix command interface to not to throw errors and send error response back, fixed command interface tests and updated arangojs in package.json
- migrated from grpc to grpc-js and fixed the tests.
- included error array changes

### 0.2.3 (May 18th, 2021)

- improved error logging

### 0.2.2 (May 5th, 2021)

- updated kafka-client

### 0.2.0 (April 27th, 2021)

#### Contains breaking changes!

- switch to kafkajs
- changed config format for events
- updated dependencies

### 0.1.12 (March 19th, 2021)

- migrated from redis to ioredis module (command interface and offset store)
- modified flushCache to stream kesy and delete
- updated dependencies

### 0.1.11 (March 9th, 2021)

- fix for removing buffer fields in response message from logging
- added mask fields to remove logging data
- updated dependencies

### 0.1.10 (February 15th, 2021)

- fix to send response stream object and return write response for back pressure handling on server write
- updated request stream on server to return stream object
- updated dependencies

### 0.1.9 (February 11th, 2021)

- Fix oneOf fields implementation to work for both resource service and device service

### 0.1.8 (January 22nd, 2020)

- Remove of unnecessary oneOf fields from the create, update, upsert requests,
which cause gRPC protobuff error

### 0.1.7 (November 18th, 2020)

- Update dependencies

### 0.1.6 (October 15th, 2020)

- Update logger and service-config
- Add redis readiness check
- Add dependency readiness checks

### 0.1.5 (October 9th, 2020)

- Add standard GRPC health service

### 0.1.4 (August 19th, 2020)

- updated kafka-client and logger

### 0.1.3 (July 30th, 2020)

- added check for collection exists for arangoDB

### 0.1.2 (July 27th, 2020)

- added flush cache on command interface

### 0.1.1 (July 21st, 2020)

- fix to update keys for setApiKey and configUpdate

### 0.1.0 (July 21st, 2020)

- restructured config of command interface

### 0.0.9 (July 21st, 2020)

- added setApiKey command, updated tests and documentation

### 0.0.8 (July 8th, 2020)

- updated grpc-client, kafka-client and other dependencies

### 0.0.7 (July 8th, 2020)

- fix to send complete error object in streaming case

### 0.0.6 (July 2nd, 2020)

- fix to send error details

### 0.0.5 (July 2nd, 2020)

- map errors

### 0.0.4 (July 2nd, 2020)

- fix request streaming error handling and updated dependecies

### 0.0.3 (March 4th, 2020)

- added support to remove buffer fields

### 0.0.2 (January 29th, 2020)

- added config_update command on command-interface

### 0.0.1 (January 29th, 2020)

Initial share.

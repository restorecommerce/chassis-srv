import * as _ from 'lodash';
import { Server } from './../microservice/server';
import * as errors from './../microservice/errors';
import * as database from './../database';
import { Events, Topic } from '@restorecommerce/kafka-client';
import { EventEmitter } from 'events';
import * as async from 'async';
import { Logger } from 'winston';
import Redis from 'ioredis';
import { Kafka as KafkaJS } from 'kafkajs';

// For some reason this is required
const crypto = require('crypto');

const ServingStatus = {
  UNKNOWN: 'UNKNOWN',
  SERVING: 'SERVING',
  NOT_SERVING: 'NOT_SERVING',
};

/**
 * Generic interface to expose system operations.
 */
export interface ICommandInterface {
  command(call, context);
}

interface RestoreData {
  base_offset: number;
  ignore_offset: number[];
  entity: string; // resource name
}

interface FlushCacheData {
  db_index?: number;
  pattern?: string;
}

/**
 * Base implementation.
 * Currently includes:
 * * 'check' - returns UNKNOWN, SERVING or NOT_SERVING
 * * 'version' - returns NPM service version and Node.js version
 * * 'reset' - truncated all DB instances specified in config files
 * * 'restore' - re-reads Kafka events to restore a set of ArangoDB collections' data
 *  Unimplemented:
 * * reconfigure
 *
 * In case of custom data/events handling or service-specific operations regarding
 * a certain method, such method should be extended or overriden.
 */
export class CommandInterface implements ICommandInterface {
  logger: Logger;
  config: any;
  health: any;
  service: any;
  kafkaEvents: Events;
  commands: any;
  commandTopic: Topic;
  bufferedCollection: Map<string, string>;
  redisClient: Redis;
  constructor(server: Server, config: any, logger: Logger, events: Events, redisClient: Redis) {
    if (_.isNil(events)) {
      if (logger.error) {
        logger.error('No Kafka client was provided. Disabling all commands.');
        return;
      }
    }
    if (!config.get('server:services')) {
      throw new Error('missing config server.services');
    }

    this.config = config;
    this.logger = logger;
    this.redisClient = redisClient;

    if (!this.config.get('events:kafka:topics:command')) {
      throw new Error('Commands topic configuration was not provided.');
    }

    this.kafkaEvents = events;

    // Health
    this.health = {
      status: ServingStatus.UNKNOWN,
    };
    this.service = {};
    const service = this.service;
    const health = this.health;
    _.forEach(config.get('server:services'), (serviceCfg, serviceName) => {
      service[serviceName] = {
        bound: false,
        transport: {},
      };
    });
    server.on('bound', (serviceName) => {
      service[serviceName].bound = true;
      health.status = ServingStatus.NOT_SERVING;
    });
    server.on('serving', (transports) => {
      health.status = ServingStatus.SERVING;
      _.forEach(transports, (transport, transportName) => {
        _.forEach(service, (srv, serviceName) => {
          service[serviceName].transport[transportName] = ServingStatus.SERVING;
        });
      });
    });
    server.on('stopped', (transports) => {
      health.status = ServingStatus.NOT_SERVING;
      _.forEach(transports, (transport, transportName) => {
        _.forEach(service, (srv, serviceName) => {
          service[serviceName].transport[transportName] = ServingStatus.NOT_SERVING;
        });
      });
    });

    // list of available commands
    this.commands = {
      reset: this.reset,
      restore: this.restore,
      reconfigure: this.reconfigure,
      health_check: this.check,
      version: this.version,
      config_update: this.configUpdate,
      set_api_key: this.setApiKey,
      flush_cache: this.flushCache
    };
    const topicCfg = config.get('events:kafka:topics:command');

    events.topic(topicCfg.topic).then(topic => this.commandTopic = topic).catch(err => {
      this.logger.error('Error occurred while retrieving command kafka topic', err);
    });

    // check for buffer fields
    this.bufferedCollection = new Map<string, string>();
    if (this.config.get('fieldHandlers:bufferFields')) {
      for (let bufferedCollection in this.config.get('fieldHandlers:bufferFields')) {
        const buffFields = this.config.get('fieldHandlers:bufferFields');
        this.bufferedCollection.set(bufferedCollection,
          buffFields[bufferedCollection]);
      }
      this.logger.info('Buffered collections are:', this.bufferedCollection);
    }
  }
  /**
   * Generic command operation, which demultiplexes a command by its name and parameters.
   * @param call
   * @param context
   */
  async command(call, context?: any): Promise<any> {
    if (_.isNil(call.request) && _.isNil(call.name)) {
      const result = {
        error: {
          code: 400,
          message: 'No command name provided',
        }
      };
      return this.encodeMsg(result);
    }
    const name = call.name || call.request.name;

    if (_.isNil(this.commands[name])) {
      const result = {
        error: {
          code: 400,
          message: `Command name ${name} does not exist`
        }
      };
      return this.encodeMsg(result);
    }
    const payload = call.payload ? this.decodeMsg(call.payload) :
      (call.request.payload ? this.decodeMsg(call.request.payload) : null);
    // calling operation bound to the command name
    const result = await this.commands[name].apply(this, [payload]);

    return this.encodeMsg(result);
  }

  /**
   * Reconfigure service
   * @param call
   * @param context
   */
  reconfigure(): any {
    this.logger.info('reconfigure is not implemented');
    return {
      error: {
        code: 501,
        message: 'reconfigure is not implemented',
      }
    };
  }

  /**
   * Restore the system by re-reading Kafka messages.
   * This base implementation restores documents from a set of
   * ArangoDB database collections, using the chassis-srv database provider.
   * @param topics list of Kafka topics to be restored
   */
  async restore(payload: any): Promise<any> {
    if (_.isEmpty(payload) || _.isEmpty(payload.data)) {
      // throw new errors.InvalidArgument('Invalid payload for restore command');
      return {
        error: {
          code: 400,
          message: 'Invalid payload for restore command'
        }
      };
    }

    const restoreData: RestoreData[] = payload.data || [];

    // the Kafka config should contains a key-value pair, mapping
    // a label with the topic's name
    const kafkaEventsCfg = this.config.get('events:kafka');
    const kafkaCfg = this.config.get('events:kafka:topics');
    if (_.isNil(kafkaCfg) || kafkaCfg.length == 0) {
      return {
        error: {
          code: 500,
          message: 'Kafka topics config not available'
        }
      };
    }

    const topicLabels = _.keys(kafkaCfg).filter((elem, index) => {
      return elem.includes('.resource');
    }).map((elem) => {
      return elem.replace('.resource', '');
    });

    const restoreSetup = {};
    const restoreEventSetup = {};

    restoreData.forEach((data) => {
      const ignoreOffset = (data.ignore_offset || []).filter((offset) => {
        const isNumber = Number(offset) != NaN;
        if (!isNumber) {
          this.logger.warn(`Invalid value for "ignore_offset" parameter in restore: ${offset}`);
        }
        return isNumber;
      });
      restoreSetup[data.entity] = {
        baseOffset: Number(data.base_offset) || 0,
        ignoreOffset
      };
    });

    const restoreCollections = _.keys(restoreSetup);

    try {
      const dbCfgs = this.config.get('database');
      const dbCfgNames = _.keys(dbCfgs);
      for (let i = 0; i < dbCfgNames.length; i += 1) {
        const dbCfgName = dbCfgNames[i];
        const dbCfg = dbCfgs[dbCfgName];
        const collections = dbCfg.collections;
        let graphName, edgeConfigDefs;
        if (this.config.get('graph')) {
          graphName = this.config.get('graph:graphName');
          edgeConfigDefs = this.config.get('graph:edgeDefinitions');
        }
        const db = await database.get(dbCfg, this.logger, graphName, edgeConfigDefs);

        if (_.isNil(collections)) {
          this.logger.warn('No collections found on DB config');
          return {};
        }

        let intersection: string[] = _.intersection(restoreCollections, collections);
        if (intersection.length > 0) {
          intersection = _.intersection(intersection, topicLabels);
          for (let resource of intersection) {
            const topicName = kafkaCfg[`${resource}.resource`].topic;
            restoreEventSetup[topicName] = {
              topic: await this.kafkaEvents.topic(topicName),
              events: this.makeResourcesRestoreSetup(db, resource),
              baseOffset: restoreSetup[resource].baseOffset,
              ignoreOffset: restoreSetup[resource].ignoreOffset
            };
          }
        }
      }

      if (_.isEmpty(restoreEventSetup)) {
        this.logger.warn('No data was setup for the restore process.');
      } else {
        const that = this;
        // Start the restore process
        this.logger.warn('restoring data');

        for (let topicName in restoreEventSetup) {
          const topicSetup: any = restoreEventSetup[topicName];
          const restoreTopic: Topic = topicSetup.topic;
          const topicEvents: any = topicSetup.events;

          // saving listeners for potentially subscribed events on this topic,
          // so they don't get called during the restore process
          const previousEvents: string[] = _.cloneDeep(restoreTopic.subscribed);
          const listenersBackup = new Map<string, Function[]>();
          for (let event of previousEvents) {
            listenersBackup.set(event, (restoreTopic.emitter as EventEmitter).listeners(event));
            await restoreTopic.removeAllListeners(event);
          }

          // const eventNames = _.keys(restoreTopic.events);
          const baseOffset: number = topicSetup.baseOffset;
          const targetOffset: number = (await restoreTopic.$offset(-1)) - 1;
          const ignoreOffsets: number[] = topicSetup.ignoreOffset;
          const eventNames = _.keys(topicEvents);

          this.logger.debug(`topic ${topicName} has current offset ${targetOffset}`);

          const restoreGroupId = kafkaEventsCfg.groupId + '-restore-' + crypto.randomBytes(32).toString('hex');

          const consumer = (this.kafkaEvents.provider.client as KafkaJS).consumer({
            groupId: restoreGroupId
          });

          const drainEvent = (message, done) => {
            const msg = message.value;
            const eventName = message.key.toString();
            const context = _.pick(message, ['offset', 'partition', 'topic']);
            const eventListener = topicEvents[message.key];
            // decode protobuf
            let decodedMsg = that.kafkaEvents.provider.decodeObject(kafkaEventsCfg, eventName, msg);
            decodedMsg = _.pick(decodedMsg, _.keys(decodedMsg)); // preventing protobuf.js special fields
            eventListener(decodedMsg, context, that.config.get(), eventName).then(() => {
              done();
            }).catch((err) => {
              that.logger.error(`Exception caught invoking restore listener for event ${eventName}:`, err);
              done(err);
            });

            if (message.offset >= targetOffset) {
              for (let event of eventNames) {
                restoreTopic.removeAllListeners(event).then(() => { }).catch((err) => {
                  that.logger.error('Error removing listeners after restore', err);
                });
              }
              for (let event of previousEvents) {
                const listeners = listenersBackup.get(event);
                for (let listener of listeners) {
                  restoreTopic.on(event, listener).then(() => { }).catch((err) => {
                    that.logger.error('Error subscribing to listeners after restore', err);
                  });
                }
              }

              consumer.stop().then(() => consumer.disconnect()).then(() => {
                this.kafkaEvents.provider.admin.deleteGroups([restoreGroupId]).then(() => {
                  that.logger.debug('restore kafka group deleted');
                  const msg = {
                    topic: topicName,
                    offset: message.offset
                  };
                  that.commandTopic.emit('restoreResponse', {
                    services: _.keys(that.service),
                    payload: that.encodeMsg(msg)
                  }).then(() => {
                    that.logger.info('Restore response emitted');
                  }).catch((err) => {
                    that.logger.error('Error emitting command response', err);
                  });
                  that.logger.info('restore process done');
                }).catch(err => {
                  that.logger.error('Error deleting restore kafka group:', err);
                });
              }).catch(err => {
                that.logger.error('Error stopping consumer:', err);
              });
            }
          };

          const asyncQueue = that.startToReceiveRestoreMessages(restoreTopic, drainEvent);

          await consumer.connect().catch(err => {
            that.logger.error(`error connecting consumer:`, err);
            throw err;
          });

          await consumer.subscribe({
            topic: topicName,
          });

          await consumer.run({
            eachMessage: async (payload) => {
              if (payload.message.key.toString() in topicEvents && !_.includes(ignoreOffsets, parseInt(payload.message.offset))) {
                asyncQueue.push(payload.message);
                that.logger.debug(`received message ${payload.message.offset}/${targetOffset}`);
              }
            }
          });

          await consumer.seek({
            topic: topicName,
            partition: 0,
            offset: baseOffset.toString(10)
          });
        }

        this.logger.debug('waiting until all messages are processed');
      }
    } catch (err) {
      console.log('Err is...........', err);
      this.logger.error('Error occurred while restoring the system', err.message);
      await this.commandTopic.emit('restoreResponse', {
        services: _.keys(this.service),
        payload: this.encodeMsg({
          error: err.message
        })
      });
    }

    return {};
  }

  private startToReceiveRestoreMessages(restoreTopic: Topic,
    drainEvent: Function): any {
    const asyncQueue = async.queue((msg, done) => {
      setImmediate(() => drainEvent(msg, err => {
        if (err) {
          done(err);
        } else {
          done();
        }
      }));
    }, 1);

    asyncQueue.drain(() => {
      // commit state first, before resuming
      this.logger.verbose('Committing offsets upon async queue drain');
      restoreTopic.commitCurrentOffsets().then(() => {
        this.logger.info('Offset committed successfully');
      });
    });

    this.logger.info('Async queue draining started.');
    return asyncQueue;
  }

  /**
   * Reset system data related to a service. Default implementation truncates
   * a set of ArangoDB instances, using the chassis-srv database provider.
   */
  async reset(): Promise<any> {
    this.logger.info('reset process started');
    if (this.health.status !== ServingStatus.NOT_SERVING) {
      this.logger.warn('reset process starting while server is serving');
    }

    let errorMsg = null;
    try {
      const dbCfgs = this.config.get('database');
      const dbCfgNames = _.keys(dbCfgs);
      for (let i = 0; i < dbCfgNames.length; i += 1) {
        const dbCfgName = dbCfgNames[i];
        const dbCfg = dbCfgs[dbCfgName];
        const db = await database.get(dbCfg, this.logger);
        switch (dbCfg.provider) {
          case 'arango':
            await db.truncate();
            this.logger.info(`arangodb ${dbCfg.database} truncated`);
            break;
          default:
            this.logger.error(
              `unsupported database provider ${dbCfg.provider} in database config ${dbCfgName}`);
            break;
        }
      }
    } catch (err) {
      this.logger.error('Unexpected error while resetting the system', err.message);
      errorMsg = err.message;
    }

    const eventObject = {
      services: _.keys(this.service),
      payload: null
    };

    if (errorMsg) {
      eventObject.payload = this.encodeMsg({
        error: errorMsg
      });
    } else {
      eventObject.payload = this.encodeMsg({
        status: 'Reset concluded successfully'
      });
    }
    await this.commandTopic.emit('resetResponse', eventObject);

    this.logger.info('reset process ended');

    if (errorMsg) {
      return {
        error: errorMsg
      };
    }
    return {
      status: 'Reset concluded successfully'
    };
  }

  /**
   * Check the service status
   * @param call List of services to be checked
   * @param context
   */
  async check(payload: any): Promise<any> {
    if (_.isNil(payload)) {
      return {
        error: {
          code: 400,
          message: 'Invalid payload for restore command'
        }
      };
    }
    const serviceName = payload.service;

    if (_.isNil(serviceName) || _.size(serviceName) === 0) {
      await this.commandTopic.emit('healthCheckResponse', {
        services: _.keys(this.service),
        payload: this.encodeMsg({
          status: this.health.status,
        })
      });
      return {
        status: this.health.status,
      };
    }
    const service = this.service[serviceName];
    if (_.isNil(service)) {
      const errorMsg = 'Service ' + serviceName + ' does not exist';
      this.logger.warn(errorMsg);
      return {
        error: {
          code: 404,
          message: errorMsg
        }
      };
    }
    let status = ServingStatus.UNKNOWN;
    // If one transports serves the service, set it to SERVING
    _.forEach(service.transport, (transportStatus) => {
      if (transportStatus === ServingStatus.SERVING) {
        status = transportStatus;
      }
    });
    await this.commandTopic.emit('healthCheckResponse', {
      services: [serviceName],
      payload: this.encodeMsg({
        status,
      })
    });
    return {
      status,
    };
  }

  /**
   * Retrieve current NPM package and Node version of service
   */
  async version(): Promise<any> {
    const response = {
      nodejs: process.version,
      version: process.env.npm_package_version,
    };
    await this.commandTopic.emit('versionResponse', {
      services: _.keys(this.service),
      payload: this.encodeMsg(response)
    });
    return response;
  }

  /**
   * Update config for acs-client to disable it
   * @param payload JSON object containing key value pairs for configuration
   */
  async configUpdate(payload: any): Promise<any> {
    if (_.isNil(payload)) {
      return {
        error: {
          code: 400,
          message: 'Invalid payload for configUpdate command'
        }
      };
    }
    let response;
    try {
      let configProperties = Object.keys(payload);
      for (let key of configProperties) {
        this.config.set(key, payload[key]);
      }
      response = {
        status: 'Configuration updated successfully'
      };
      await this.commandTopic.emit('configUpdateResponse', {
        services: _.keys(this.service),
        payload: this.encodeMsg(response)
      });
    } catch (error) {
      this.logger.error('Error executing configUpdate Command', { message: error.message });
      response = error.message;
    }
    return response;
  }

  /**
   * Sets provided authentication apiKey on configuration
   * @param payload JSON object containing key value pairs for authentication apiKey
   */
  async setApiKey(payload: any): Promise<any> {
    if (_.isNil(payload)) {
      return {
        error: {
          code: 400,
          message: 'Invalid payload for setApiKey command'
        }
      };
    }
    let response;
    try {
      let configProperties = Object.keys(payload);
      for (let key of configProperties) {
        this.config.set(key, payload[key]);
      }
      response = {
        status: 'ApiKey set successfully'
      };
      await this.commandTopic.emit('setApiKeyResponse', {
        services: _.keys(this.service),
        payload: this.encodeMsg(response)
      });
    } catch (err) {
      this.logger.error('Error executing setApiKey Command', { message: err.message });
      response = err.message;
    }

    return response;
  }

  /**
  * Flush the cache based on DB index and prefix passed, if no dbIndex is passed
  * then the complete Cache is flushed.
  *
  * @param prefix An optional prefix to flush instead of entire cache
  */
  async flushCache(payload: any): Promise<any> {
    let flushCachePayload: FlushCacheData;
    if (payload && payload.data) {
      flushCachePayload = payload.data;
    }
    let dbIndex, pattern, response;
    if (flushCachePayload) {
      dbIndex = flushCachePayload.db_index;
      pattern = flushCachePayload.pattern;
    }
    if (dbIndex === undefined || !dbIndex) {
      dbIndex = 0;
    }

    // select the particular dbIndex
    await this.redisClient.select(dbIndex);
    try {
      if (pattern != undefined) {
        let flushPattern = '*' + pattern + '*';
        this.logger.debug('Flushing cache wiht pattern', { dbIndex, flushPattern });
        let stream, pipeline;
        try {
          stream = this.redisClient.scanStream({ match: flushPattern, count: 100 });
          pipeline = this.redisClient.pipeline();
        } catch (err) {
          this.logger.error('Error creating stream / pipeline in Redis', { message: err.message });
          response = err.message;
        }
        let localKeys = [];
        if (stream && pipeline) {
          await new Promise((resolve, reject) => {
            stream.on('data', (resultKeys) => {
              this.logger.info('Data Received:', localKeys.length);
              for (let i = 0; i < resultKeys.length; i++) {
                localKeys.push(resultKeys[i]);
                pipeline.del(resultKeys[i]);
              }
              if (localKeys.length > 100) {
                pipeline.exec(() => { this.logger.info('one batch delete complete'); });
                localKeys = [];
                pipeline = this.redisClient.pipeline();
              }
            });
            stream.on('end', () => {
              pipeline.exec(() => { this.logger.info('final batch delete complete'); });
              response = {
                status: 'Successfully flushed cache pattern'
              };
              resolve(response);
            });
            stream.on('error', (err) => {
              this.logger.error('error', err);
              response = err.message;
              resolve(err);
            });
          });
        }
      } else {
        this.logger.debug('Flushing cache', { dbIndex });
        await new Promise((resolve, reject) => {
          if (dbIndex || dbIndex === 0) {
            // Flush all keys in the given dbIndex (flushDB)
            this.redisClient.flushdb(async (err, reply) => {
              if (err) {
                this.logger.error('Failed flushing cache with DB index', { err, dbIndex });
                return reject();
              }

              if (reply) {
                this.logger.debug('Successfully flushed cache with DB index', { dbIndex });
                response = {
                  status: `Successfully flushed cache with DB index ${dbIndex}`
                };
                return resolve(response);
              }
            });
          } else {
            // Flush Complete Redis Cache (flushAll)
            this.redisClient.flushall(async (err, reply) => {
              if (err) {
                this.logger.error('Failed flushing complete cache', { err });
                return reject();
              }
              if (reply) {
                this.logger.debug('Successfully flushed complete cache');
                response = {
                  status: 'Successfully flushed complete cache'
                };
                return resolve(response);
              }
            });
          }
        });
      }
    } catch (err) {
      response = err.message;
    }
    await this.commandTopic.emit('flushCacheResponse', {
      services: _.keys(this.service),
      payload: this.encodeMsg(response)
    });
    return response;
  }

  // Helper functions

  /**
   * Generic resource restore setup.
   * @param db
   * @param resource
   */
  makeResourcesRestoreSetup(db: any, resource: string): any {
    const that = this;
    return {
      [`${resource}Created`]: async function restoreCreated(message: any,
        ctx: any, config: any, eventName: string): Promise<any> {
        that.decodeBufferField(message, resource);
        await db.insert(`${resource}s`, message);
        return {};
      },
      [`${resource}Modified`]: async function restoreModified(message: any,
        ctx: any, config: any, eventName: string): Promise<any> {
        that.decodeBufferField(message, resource);
        await db.update(`${resource}s`, { id: message.id }, _.omitBy(message, _.isNil));

        return {};
      },
      [`${resource}Deleted`]: async function restoreDeleted(message: any,
        ctx: any, config: any, eventName: string): Promise<any> {
        await db.delete(`${resource}s`, { id: message.id });
        return {};
      }
    };
  }

  /**
   * Check if the message contains buffered field, if so decode it.
   * @param message
   * @param collectionName
   */
  decodeBufferField(message: any, resource: string): any {
    if (this.bufferedCollection.has(resource)) {
      const bufferField = this.bufferedCollection.get(resource);
      // check if received message contains buffered data, if so
      // decode the bufferField and store in DB
      if (message[bufferField] && message[bufferField].value) {
        message[bufferField] = JSON.parse(message[bufferField].value.toString());
      }
    }
  }

  /**
  *
  * @param msg google.protobuf.Any
  * @returns Arbitrary JSON
  */
  decodeMsg(msg: any): any {
    const decoded = Buffer.from(msg.value, 'base64').toString();
    return JSON.parse(decoded);
  }

  /**
   *
   * @param msg Arbitrary JSON
   * @returns google.protobuf.Any formatted message
   */
  encodeMsg(msg: any): any {
    if (msg) {
      const stringified = JSON.stringify(msg);
      const encoded = Buffer.from(stringified).toString('base64');
      const ret = {
        type_url: 'payload',
        value: encoded
      };
      return ret;
    }
  }

}

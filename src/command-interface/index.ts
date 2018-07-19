import * as _ from 'lodash';
import { Server } from './../microservice/server';
import * as errors from './../microservice/errors';
import * as database from './../database';
import * as Logger from '@restorecommerce/logger';
import { Events, Topic } from '@restorecommerce/kafka-client';
import { EventEmitter } from 'events';

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
  constructor(server: Server, config: any, logger: Logger, events: Events) {
    if (_.isNil(events)) {
      if (logger.error) {
        logger.error('No Kafka client was provided. Disabling all commands.');
        return;
      }
    }
    if (!_.has(config, 'server.services')) {
      throw new Error('missing config server.services');
    }

    this.config = config;
    this.logger = logger;

    if (!_.has(this.config, 'events')
      || !_.has(this.config.events, 'kafka')
      || !_.has(this.config.events.kafka, 'topics')
      || !_.has(this.config.events.kafka.topics, 'command')) {
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
    _.forEach(config.server.services, (serviceCfg, serviceName) => {
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
      version: this.version
    };
    const topicCfg = config.events.kafka.topics.command;
    this.commandTopic = events.topic(topicCfg.topic);
    // check for buffer fields
    this.bufferedCollection = new Map<string, string>();
    if (this.config.fieldHandlers && this.config.fieldHandlers.bufferFields) {
      for (let bufferedCollection in this.config.fieldHandlers.bufferFields) {
        this.bufferedCollection.set(bufferedCollection,
          this.config.fieldHandlers.bufferFields[bufferedCollection]);
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
      throw new errors.InvalidArgument('No command name provided');
    }
    const name = call.name || call.request.name;

    if (_.isNil(this.commands[name])) {
      throw new errors.InvalidArgument(`Command name ${name} does not exist`);
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
    throw new errors.Unimplemented('reconfigure is not implemented');
  }

  /**
   * Restore the system by re-reading Kafka messages.
   * This base implementation restores documents from a set of
   * ArangoDB database collections, using the chassis-srv database provider.
   * @param topics list of Kafka topics to be restored
   */
  async restore(payload: any): Promise<any> {
    if (_.isEmpty(payload) || _.isEmpty(payload.data)) {
      throw new errors.InvalidArgument('Invalid payload for restore command');
    }

    const restoreData: RestoreData[] = payload.data || [];

    // the Kafka config should contains a key-value pair, mapping
    // a label with the topic's name
    const kafkaEventsCfg = this.config.events.kafka;
    const kafkaCfg = this.config.events.kafka.topics;
    if (_.isNil(kafkaCfg) || kafkaCfg.length == 0) {
      throw new errors.Internal('Kafka topics config not available');
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
      const dbCfgs = this.config.database;
      const dbCfgNames = _.keys(dbCfgs);
      for (let i = 0; i < dbCfgNames.length; i += 1) {
        const dbCfgName = dbCfgNames[i];
        const dbCfg = dbCfgs[dbCfgName];
        const collections = dbCfg.collections;
        let graphName;
        if (this.config.graph) {
          graphName = this.config.graph.graphName;
        }
        const db = await database.get(dbCfg, this.logger, graphName);

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
              topic: this.kafkaEvents.topic(topicName),
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
          const listener = async function listener(message: any, ctx: any,
            config: any, eventName: string, done: any): Promise<any> {
            that.logger.debug(`received message ${ctx.offset}/${targetOffset}`);
            if (_.includes(ignoreOffsets, ctx.offset)) {
              return;
            }
            try {
              const eventListener = topicEvents[eventName];
              await eventListener(message, ctx, config, eventName, done);
            } catch (e) {
              that.logger.debug('Exception caught:', e.message);
            }
          };
          for (let eventName of eventNames) {
            await restoreTopic.on(eventName, listener, { startingOffset: baseOffset, queue: true, forceOffset: true });
          }
          // Fix - to handle case in case target offset is not reached
          // by consuming all the emitted messages
          restoreTopic.consumer.on('message', async (message) => {
            if (message.offset >= targetOffset) {
              for (let event of eventNames) {
                await restoreTopic.removeAllListeners(event);
              }

              for (let event of previousEvents) {
                const listeners = listenersBackup.get(event);
                for (let listener of listeners) {
                  await restoreTopic.on(event, listener);
                }
              }

              const msg = {
                topic: topicName,
                offset: message.offset
              };
              await that.commandTopic.emit('restoreResponse', {
                services: _.keys(that.service),
                payload: that.encodeMsg(msg)
              });

              that.logger.info('restore process done');
            }
          });
        }

        this.logger.debug('waiting until all messages are processed');
      }
    } catch (err) {
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
      const dbCfgs = this.config.database;
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
    return {};
  }

  /**
   * Check the service status
   * @param call List of services to be checked
   * @param context
   */
  async check(payload: any): Promise<any> {
    if (_.isNil(payload)) {
      throw new errors.InvalidArgument('Invalid payload for restore command');
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
        error: errorMsg
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
        ctx: any, config: any, eventName: string, done: any): Promise<any> {
        try {
          that.decodeBufferField(message, resource);
          await db.insert(`${resource}s`, message);
          if (done) {
            done();
          }
        } catch (err) {
          that.logger.error(`Exception caught when restoring ${resource}Created
            message`, message);
          if (done) {
            done(err);
          }
        }
        return {};
      },
      [`${resource}Modified`]: async function restoreModified(message: any,
        ctx: any, config: any, eventName: string, done: any): Promise<any> {
        try {
          that.decodeBufferField(message, resource);
          await db.update(`${resource}s`, { id: message.id }, _.omitBy(message, _.isNil));
          if (done) {
            done();
          }
        } catch (err) {
          that.logger.error(`Exception caught when restoring ${resource}Modified
            message`, message);
          if (done) {
            done(err);
          }
        }
        return {};
      },
      [`${resource}Deleted`]: async function restoreDeleted(message: any,
        ctx: any, config: any, eventName: string, done: any): Promise<any> {
        try {
          await db.delete(`${resource}s`, { id: message.id });
          if (done) {
            done();
          }
        } catch (err) {
          that.logger.error(`Exception caught when restoring ${resource}Deleted
            message`, message);
          if (done) {
            done(err);
          }
        }
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

    const stringified = JSON.stringify(msg);
    const encoded = Buffer.from(stringified).toString('base64');
    const ret = {
      type_url: 'payload',
      value: encoded
    };
    return ret;
  }

}

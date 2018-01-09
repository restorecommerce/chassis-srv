'use strict';
import * as _ from 'lodash';
import * as co from 'co';
import { Server } from './../microservice/server';
import * as errors from './../microservice/errors';
import * as database from './../database';
import * as Logger from '@restorecommerce/logger';
import { Events, Topic } from '@restorecommerce/kafka-client';

const ServingStatus = {
  UNKNOWN: 0,
  SERVING: 1,
  NOT_SERVING: 2,
};

/**
 * Generic interface to expose system operations.
 */
export interface ICommandInterface {
  check(call, context);
  version(call, context);
  reconfigure(call, context);
  reset(call, context);
  restore(call, context);
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
  constructor(server: Server, config: any, logger: Logger, events?: Events) {
    if (!_.has(config, 'server.services')) {
      throw new Error('missing config server.services');
    }

    this.config = config;
    this.logger = logger;

    // disable reset and restore if there are no databases in configs
    if (!_.has(this.config, 'events')) {
      this.logger.warn('Missing events config. Disabling restore and reset operations.');
      this.reset = undefined;
      this.restore = undefined;
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
  }

  /**
   * Reconfigure service
   * @param call
   * @param context
   */
  reconfigure(call: any, context?: any): any {
    this.logger.info('reconfigure is not implemented');
    throw new errors.Unimplemented('reconfigure is not implemented');
  }

  /**
   * Restore the system by re-reading Kafka messages. Default implementation
   * restores collection documents from a set of ArangoDB databases, using
   * the chassis-srv database provider.
   * @param call list of Kafka topics to be restored
   * @param context
   */
  async restore(call: any, context?: any): Promise<any> {

    let topics;
    if (call && call.request) {
      topics = call.request.topics;
    } else {
      topics = call.topics;
    }

    if (_.isNil(topics)) {
      throw new errors.NotFound('Invalid event configuration provided in restore operation');
    }

    const events = {};

    const dbCfgs = this.config.database;
    const dbCfgNames = _.keys(dbCfgs);
    for (let i = 0; i < dbCfgNames.length; i += 1) {
      const dbCfgName = dbCfgNames[i];
      const dbCfg = dbCfgs[dbCfgName];
      const collections = dbCfg.collections;
      if (_.isNil(collections)) {
        throw new errors.NotFound('No collections found on DB config');
      }
      const db = await co(database.get(dbCfg, this.logger));
      for (let topic of topics) {
        for (let collection of collections) {
          if (topic.topic.includes(collection)) {
            events[topic.topic] = {
              topic: this.kafkaEvents.topic(topic.topic),
              events: this.makeResourcesRestoreSetup(db, collection)
            };
            break;
          }
        }
        if (!events[topic.topic]) {
          throw new errors.NotFound(`topic ${topic.topic} is not registered for the restore process`);
        }
      }
    }

    const commandTopic = this.kafkaEvents.topic(this.config.events.kafka.topics.command.topic);
    const logger = this.logger;
    // Start the restore process
    logger.warn('restoring data');
    for (let topic of topics) {
      const restoreTopic = events[topic.topic];
      const eventNames = _.keys(restoreTopic.events);
      const targetOffset = (await restoreTopic.topic.$offset(-1)) - 1;
      const ignoreOffsets = topic.ignore_offset;
      this.logger.debug(`topic ${topic.topic} has current offset ${targetOffset}`);
      for (let eventName of eventNames) {
        const listener = restoreTopic.events[eventName];
        const listenUntil = async function listenUntil(message: any, ctx: any,
          config: any, eventNameRet: string): Promise<any> {
          logger.debug(`received message ${ctx.offset}/${targetOffset}`, ctx);
          if (_.includes(ignoreOffsets, ctx.offset)) {
            return;
          }
          try {
            await listener(message, ctx, config, eventNameRet);
          } catch (e) {
            logger.debug('Exception caught :', e.message);
          }
          if (ctx.offset >= targetOffset) {
            await commandTopic.emit('restoreResponse', {
              topic: topic.topic,
              offset: ctx.offset
            });

            for (let k = 0; k < eventNames.length; k += 1) {
              const eventToRemove = eventNames[k];
              logger.debug('Number of listeners before removing :',
                restoreTopic.topic.listenerCount(eventToRemove));
              await restoreTopic.topic.removeAllListeners(eventToRemove);
              logger.debug('Number of listeners after removing :',
                restoreTopic.topic.listenerCount(eventToRemove));
            }
          }
        };
        logger.debug(`listening to topic ${topic.topic} event ${eventName}
          until offset ${targetOffset} while ignoring offset`, ignoreOffsets);
        await restoreTopic.topic.on(eventName, listenUntil);
        logger.debug(`reseting commit offset of topic ${topic.topic} to ${topic.offset}`);
        restoreTopic.topic.$reset(eventName, topic.offset);
        logger.debug(`reset done for topic ${topic.topic} to commit offset ${topic.offset}`);
      }
    }
    logger.debug('waiting until all messages are processed');
    logger.info('restore process done');
    return {};
  }

  /**
   * Reset system data related to a service. Default implementation truncates
   * a set of ArangoDB instances, using the chassis-srv database provider.
   * @param call
   * @param context
   */
  async reset(call: any, context?: any): Promise<any> {
    this.logger.info('reset process started');
    if (this.health.status !== ServingStatus.NOT_SERVING) {
      this.logger.warn('reset process starting while server is serving');
    }
    const dbCfgs = this.config.database;
    const dbCfgNames = _.keys(dbCfgs);
    for (let i = 0; i < dbCfgNames.length; i += 1) {
      const dbCfgName = dbCfgNames[i];
      const dbCfg = dbCfgs[dbCfgName];
      const db = await co(database.get(dbCfg, this.logger));
      switch (dbCfg.provider) {
        case 'arango':
          await co(db.truncate());
          this.logger.info(`arangodb ${dbCfg.database} truncated`);
          break;
        default:
          this.logger.error(
            `unsupported database provider ${dbCfg.provider} in database config ${dbCfgName}`);
          break;
      }
    }
    this.logger.info('reset process ended');
    return {};
  }

  /**
   * Check the service status
   * @param call List of services to be checked
   * @param context
   */
  check(call: any, context?: any): any {
    let serviceName;
    if (call && call.request) {
      serviceName = call.request.service;
    } else {
      serviceName = call.service;
    }
    if (_.isNil(serviceName) || _.size(serviceName) === 0) {
      return {
        status: this.health.status,
      };
    }
    const service = this.service[serviceName];
    if (_.isNil(service)) {
      this.logger.info('service ' + serviceName + ' does not exist');
      throw new errors.NotFound(`service ${serviceName} does not exist`);
    }
    let status = ServingStatus.UNKNOWN;
    // If one transports serves the service, set it to SERVING
    _.forEach(service.transport, (transportStatus) => {
      if (transportStatus === ServingStatus.SERVING) {
        status = transportStatus;
      }
    });
    return {
      status,
    };
  }

  /**
   * Retrieve current NPM package and Node version of service
   * @param call
   * @param context
   */
  version(call: any, context?: any): any {
    this.logger.info('process version');
    return {
      nodejs: process.version,
      version: process.env.npm_package_version,
    };
  }

  // Helper functions

  /**
   * Generic resource restore setup.
   * @param db
   * @param db
   */
  makeResourcesRestoreSetup(db: any, collectionName: string): any {
    return {
      [`${collectionName}Created`]: async function restoreCreated(message: any, context: any,
        config: any, eventName: string): Promise<any> {
        await co(db.insert(`${collectionName}s`, message));
        return {};
      },
      [`${collectionName}Modified`]: async function restoreModified(message: any, context: any,
        config: any, eventName: string): Promise<any> {
        await co(db.update(collectionName, { id: message.id }, _.omitBy(message, _.isNil)));
        return {};
      },
      [`${collectionName}Deleted`]: async function restoreDeleted(message: any, context: any,
        config: any, eventName: string): Promise< any> {
        await co(db.delete(collectionName, { id: message.id }));
        return {};
      }
    };
  }
}

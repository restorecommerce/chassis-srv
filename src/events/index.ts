'use strict';

import * as _ from "lodash";
const Logger = require('../logger');

/**
 * A key, value map containing event providers.
 * Event providers are registered with the register function.
 */
const eventProviders = {};

/**
 * Register a event provider.
 *
 * @param  {string} name     Event provider identifier
 * @param  {constructor} provider Event provider constructor function
 */
export function registerEventProvider(name: string, provider: any): void {
  eventProviders[name] = provider;
}

const kafka = require('./provider/kafka');

registerEventProvider(kafka.Name, kafka.Kafka);
const local = require('./provider/local');

registerEventProvider(local.Name, local.Local);

/**
 * Events manages an event provider.
 */
export class Events {
  config: any;
  logger: any;
  provider: any;
  /**
   * @param [Object] config Event configuration.
   * @param [Logger] logger
   */
  constructor(config?: any, logger?: any) {
    // config
    if (_.isNil(config)) {
      throw new Error('missing argument config');
    }
    this.config = config;

    // logger
    if (_.isNil(logger)) {
      if (_.isNil(this.config.logger)) {
        this.logger = new Logger();
      } else {
        this.logger = new Logger(this.config.logger);
      }
    } else {
      this.logger = logger;
    }

    // provider
    const providerName = this.config.provider;
    if (_.isNil(providerName)) {
      this.logger.error('config does not have event provider name', this.config);
      throw new Error('config does not have event provider name');
    }
    const Provider = eventProviders[providerName];
    if (_.isNil(Provider)) {
      throw new Error(`events provider ${providerName} is not registered`);
    }
    this.provider = new Provider(this.config, this.logger);
  }

  /**
   * Start the provider.
   * Allows sending and receiving events after this call.
   * Suspends the function until the provider is started.
   */
  * start(): any {
    return yield this.provider.start();
  }

  /**
   * Stop the provider.
   * No events will be received or can be send after this call.
   * Suspends the function until the provider is stopped.
   */
  * end(): any {
    return yield this.provider.end();
  }

  /**
   * Returns a topic from the provider.
   *
   * @param  {string} name Topic name
   * @return {Topic}      Topic
   */
  * topic(name: string): any {
    if (_.isNil(name)) {
      throw new Error('missing argument name');
    }
    if (!_.isString(name)) {
      throw new Error('argument name is not of type string');
    }
     // topic() api called inside Local / Kafka class - which then
     // invokes the actual topic constructor
    return yield this.provider.topic(name, this.config);
  }
}

// module.exports.Events = Events;

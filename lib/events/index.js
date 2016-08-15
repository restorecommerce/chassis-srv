'use strict';

const _ = require('lodash');
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
function registerEventProvider(name, provider) {
  eventProviders[name] = provider;
}
module.exports.registerEventProvider = registerEventProvider;

const kafka = require('./provider/kafka');
registerEventProvider(kafka.Name, kafka.Kafka);
const local = require('./provider/local');
registerEventProvider(local.Name, local.Local);

/**
 * Events manages an event provider.
 */
class Events {
  /**
   * @param [Object] config Event configuration.
   * @param [Logger] logger
   */
  constructor(config, logger) {
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
  * start() {
    return yield this.provider.start();
  }

  /**
   * Stop the provider.
   * No events will be received or can be send after this call.
   * Suspends the function until the provider is stopped.
   */
  * end() {
    return yield this.provider.end();
  }

  /**
   * Returns a topic from the provider.
   *
   * @param  {string} name Topic name
   * @return {Topic}      Topic
   */
  * topic(name) {
    if (_.isNil(name)) {
      throw new Error('missing argument name');
    }
    if (!_.isString(name)) {
      throw new Error('argument name is not of type string');
    }
    return yield this.provider.topic(name);
  }
}

module.exports.Events = Events;

'use strict';

const _ = require('lodash');
const configuration = require('../../').config;
const Logger = require('../logger');

const eventProviders = {};

/**
 * register event provider
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
  constructor(name, config, logger) {
    // name
    if (_.isNil(name)) {
      throw new Error('missing argument name');
    }
    if (!_.isString(name)) {
      throw new Error('argument name is not of type string');
    }
    // config
    let conf = config;
    if (_.isNil(config)) {
      const cfg = configuration.get(logger);
      if (!cfg) {
        throw new Error('no configuration found');
      }
      conf = cfg.get(`events:${name}`);
      if (_.isNil(conf)) {
        throw new Error('no events configuration found');
      }
    }

    // logger
    let log;
    if (_.isNil(logger)) {
      if (_.isNil(conf.logger)) {
        log = new Logger();
      } else {
        log = new Logger(conf.logger);
      }
    } else {
      log = logger;
    }

    // provider
    const providerName = conf.provider;
    if (_.isNil(providerName)) {
      log.error('config does not have event provider name', conf);
      throw new Error('config does not have event provider name');
    }
    const Provider = eventProviders[providerName];
    if (_.isNil(Provider)) {
      throw new Error(`events provider ${providerName} is not registered`);
    }
    this.provider = new Provider(conf, log);
    this.name = name;
  }

  /**
   * Start the provider.
   * Allows sending and receiving events after this call.
   */
  * start() {
    return yield this.provider.start();
  }

  /**
   * Stop the provider.
   * No events will be received or can be send after this call.
   */
  * end() {
    return yield this.provider.end();
  }

  /**
   * Returns a topic.
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

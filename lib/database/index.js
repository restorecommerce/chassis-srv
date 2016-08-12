'use strict';

const configuration = require('../config');

/**
 * A key, value map containing database providers.
 * Database providers are registered with the register function.
 */
const databases = {};

/**
 * Register a database provider.
 *
 * @param  {string} name     database provider identifier
 * @param  {constructor} provider database provider constructor function
 */
function register(name, provider) {
  databases[name] = provider;
}

module.exports.register = register;

// Add default providers
register('arango', require('./provider/arango').create);
register('nedb', require('./provider/nedb').create);

/**
 * Get a new database connection.
 * @param {string} name Database configuration name.
 * @param [Logger] logger
 * @return New, active and ready database connection.
 */
function* get(name, logger) {
  const cfg = configuration.get();
  const config = cfg.get(`database:${name}`);
  if (!config) {
    throw new Error(`could not find database configuration for provider ${name}`);
  }
  const db = databases[config.provider];
  if (!db) {
    throw new Error(`database provider ${config.provider} does not exist`);
  }
  return yield db(config, logger);
}

module.exports.get = get;

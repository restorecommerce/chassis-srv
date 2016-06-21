'use strict';

const configuration = require('../config');
const util = require('util');

const databases = {};

/**
 * register database provider
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

function* get(name, logger) {
  const cfg = configuration.get();
  const config = cfg.get(util.format('database:%s', name));
  if (!config) {
    throw new Error(
      util.format('could not find database configuration for provider %s',
        name));
  }
  const db = databases[config.provider];
  if (!db) {
    throw new Error(
      util.format('database provider %s does not exist', config.provider));
  }
  return yield db(config, logger);
}

module.exports.get = get;

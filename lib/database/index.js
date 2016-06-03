'use strict';

var configuration = require('../config');
var util = require('util');

var databases = {};

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

function* get(name, logger) {
  let cfg = configuration.get();
  let config = cfg.get(util.format('database:%s', name));
  if (!config) {
    throw new Error(
      util.format('could not find database configuration for provider %s',
        name));
  }
  let db = databases[config.provider];
  if (!db) {
    throw new Error(
      util.format('database provider %s does not exist', config.provider));
  }
  return yield db(config, logger);
}

module.exports.get = get;

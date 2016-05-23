'use strict';

var configuration = require('../config');
var util = require('util');

var databases = {};

/**
 * register database provider
 * @param  {string} name     database provider identifier
 * @param  {constructor} provider database provider constructor function
 */
function register(name, provider) {
  databases[name] = provider;
}
module.exports.register = register;

// Add default providers
register('gss', require('../database/gss').create);

function* get(name, logger) {
  let cfg = configuration.get();
  let config = cfg.get(util.format('database:%s', name));
  let db = databases[config.provider];
  if (!db) {
    throw new Error(util.format('database provider %s does not exist', config.provider));
  }
  return yield db(cfg, logger);
}

module.exports.get = get;

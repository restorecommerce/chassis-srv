'use strict';

const configuration = require('../config');
const _ = require('lodash');
const cacheManager = require('cache-manager');

const providers = {};

/**
 * register cache provider
 *
 * @param  {string} name     cache provider identifier
 * @param  {constructor} provider cache store constructor
 */
function register(name, provider) {
  providers[name] = provider;
}
module.exports.register = register;

// register defaults

register('memory', (config, logger) => {
  const options = {
    store: 'memory',
    max: config.max,
    maxAge: config.maxAge,
    dispose: config.dispose,
    length: config.length,
    stale: config.stale,
  };
  return cacheManager.caching(options);
});

function* get(name, logger) {
  const cfg = configuration.get();
  const cacheConfigs = cfg.get(`cache:${name}`);
  if (!cacheConfigs) {
    throw new Error(`could not find cache configuration for provider ${name}`);
  }
  if (cacheConfigs.length === 0) {
    throw new Error(`empty config cache.${name}`);
  }
  const stores = _.map(cacheConfigs, (cacheConfig, i) => {
    const providerName = cacheConfig.provider;
    if (_.isNil(providerName)) {
      throw new Error(`config cache.${name}.[${i}] does not contain a provider name`);
    }
    const provider = providers[providerName];
    if (_.isNil(provider)) {
      throw new Error(`unknown ${providerName} cache store provider,
      use function register to registrate the provider`);
    }
    return provider(cacheConfig, logger);
  });
  if (stores.length === 1) {
    return stores[0];
  }
  return cacheManager.multiCaching(stores);
}

module.exports.get = get;

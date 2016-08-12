'use strict';

const configuration = require('../config');
const _ = require('lodash');
const cacheManager = require('cache-manager');

/**
 * A key, value map containing cache providers.
 * Cache providers are registered with the register function.
 */
const providers = {};

/**
 * Register a cache provider.
 * Providers need to be compatible to the node-cache-manager module.
 * https://github.com/BryanDonovan/node-cache-manager
 * @param  {string} name     cache provider identifier
 * @param  {constructor} provider cache store constructor
 */
function register(name, provider) {
  providers[name] = provider;
}

module.exports.register = register;

// register defaults
// add memory provider by default, since it is included with the cache-manager.
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

/**
 * Get a new cache instance.
 * @param {string} name Cache configuration name.
 * @param [Logger] logger
 * @return Cache instance
 */
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

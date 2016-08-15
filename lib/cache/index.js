'use strict';

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
 * @param {Object} config Cache configuration
 * @param [Logger] logger
 * @return Cache instance
 */
function* get(config, logger) {
  if (_.isNil(config)) {
    throw new Error('missing argument config');
  }
  const stores = _.map(config, (cacheConfig, i) => {
    const providerName = cacheConfig.provider;
    if (_.isNil(providerName)) {
      throw new Error(`provider ${providerName} is not registered`);
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

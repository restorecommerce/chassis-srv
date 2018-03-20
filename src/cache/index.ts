'use strict';

import * as _ from 'lodash';
import * as cacheManager from 'cache-manager';


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
export function register(name: string, provider: any): void {
  providers[name] = provider;
}

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
    ttl: config.ttl,
  };
  return cacheManager.caching(options);
});

/**
 * Get a new cache instance.
 * @param {Object} config Cache configuration
 * @param [Logger] logger
 * @return Cache instance
 */
export function get(config: any, logger: any): any {
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

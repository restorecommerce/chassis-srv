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
export function register(name: string, provider: any): any {
  databases[name] = provider;
}


// Add default providers
register('arango', require('./provider/arango').create);
register('nedb', require('./provider/nedb').create);

/**
 * Get a new database connection.
 * @param {Object} config Database configuration.
 * @param [Logger] logger
 * @return {Promise} New, active and ready database connection.
 */
export async function get(config: any, logger: any, graphName?: string): Promise<any> {
  const db = databases[config.provider];
  if (!db) {
    throw new Error(`database provider ${config.provider} does not exist`);
  }
  return await db(config, logger, graphName);
}

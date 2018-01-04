'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.register = register;
// Add default providers
register('arango', require('./provider/arango').create);
register('nedb', require('./provider/nedb').create);
/**
 * Get a new database connection.
 * @param {Object} config Database configuration.
 * @param [Logger] logger
 * @return New, active and ready database connection.
 */
function* get(config, logger) {
    const db = databases[config.provider];
    if (!db) {
        throw new Error(`database provider ${config.provider} does not exist`);
    }
    return yield db(config, logger);
}
exports.get = get;

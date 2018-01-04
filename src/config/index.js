'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const readConfig = require("@restorecommerce/service-config");
// singleton
let config;
/**
 * Loads the configuration and stores it in the config singleton.
 * @param {string} baseDir Directory which contains the folder cfg with the config files.
 * @param [Logger] logger
 */
function load(baseDir, logger) {
    return (cb) => {
        readConfig(baseDir, logger, (err, cfg) => {
            if (err) {
                cb(err, cfg);
            }
            else {
                config = cfg;
                cb(null, cfg);
            }
        });
    };
}
exports.load = load;
/**
 * Get config from singleton.
 * If singelton is undefined load id from current working directory.
 * @param [Logger] logger
 * @return {Object} nconf configuration object
 */
function* get(logger) {
    if (config) {
        return config;
    }
    yield load(process.cwd(), logger);
    return config;
}
exports.get = get;

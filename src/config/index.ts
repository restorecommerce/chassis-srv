'use strict';

import * as readConfig from "@restorecommerce/service-config";

// singleton
let config;

/**
 * Loads the configuration and stores it in the config singleton.
 * @param {string} baseDir Directory which contains the folder cfg with the config files.
 * @param [Logger] logger
 */
export async function load(baseDir: string, logger?: any): Promise<any> {
  return new Promise((resolve, reject) => {
    readConfig(baseDir, logger, (err, cfg) => {
      if (err)
        reject(err);
      config = cfg;
      resolve(cfg);
    });
  });
}

/**
 * Get config from singleton.
 * If singelton is undefined load id from current working directory.
 * @param [Logger] logger
 * @return {Object} nconf configuration object
 */
export async function get(logger?: any): Promise<any> {
  if (config) {
    return config;
  }
  config = await load(process.cwd(), logger);
  return config;
}

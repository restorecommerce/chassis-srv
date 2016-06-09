'use strict';

const readConfig = require('restore-server-config');

let config;

function load(baseDir, logger) {
  config = readConfig(baseDir, logger);
}

module.exports.get = function get(logger) {
  if (config) {
    return config;
  }
  load(process.cwd(), logger);
  return config;
};

module.exports.load = load;

'use strict';

const readConfig = require('restore-server-config');

let config;

function load(baseDir) {
  config = readConfig(baseDir);
}

module.exports.get = function get() {
  if (config) {
    return config;
  }
  load(process.cwd());
  return config;
};

module.exports.load = load;

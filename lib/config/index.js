'use strict';

var readConfig = require('restore-server-config');

var config;

function load(baseDir) {
  config = readConfig(baseDir);
}

module.exports.get = function() {
  if (config) {
    return config;
  }
  load(process.cwd());
  return config;
};

module.exports.load = load;

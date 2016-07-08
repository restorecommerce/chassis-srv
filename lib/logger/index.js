'use strict';

const RestoreLogger = require('restore-logger');
const _ = require('lodash');

class Logger extends RestoreLogger {
  constructor(config) {
    const conf = {
      value: config,
      get() {
        return this.value;
      },
    };
    if (_.isNil(config)) {
      conf.value = {
        console: {
          handleExceptions: false,
          level: 'silly',
          colorize: true,
          prettyPrint: true,
        },
      };
    }
    super(conf);
  }
}

module.exports = Logger;

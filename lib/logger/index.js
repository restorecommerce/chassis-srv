'use strict';

const RestoreLogger = require('restore-logger');
const _ = require('lodash');

/**
 * Logger based on a customized winston logger.
 */
class Logger extends RestoreLogger {
  /**
   * @param {Object} config Logger configuration
   */
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

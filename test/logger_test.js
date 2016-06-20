'use strict';

/* eslint no-console: ["error", { allow: ["error"] }] */

// logger which only logs errors
module.exports = {
  silly() {},
  verbose() {},
  debug() {},
  info() {},
  warn() {},
  error(...args) {
    console.error.apply(this, args);
  },
  log(level, ...args) {
    if (level === 'error' && this) {
      console.error.apply(this, level, args);
    }
  },
};

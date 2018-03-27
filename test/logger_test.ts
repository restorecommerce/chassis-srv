'use strict';

// logger which only logs errors
export default {
  silly() { },
  verbose() { },
  debug() { },
  info() { },
  warn() { },
  error(...args) {
    console.error.apply(this, args);
  },
  log(level, ...args) {
    if (level === 'error' && this) {
      console.error.apply(this, level);
    }
  },
};

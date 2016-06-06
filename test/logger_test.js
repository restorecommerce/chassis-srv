'use strict';

module.exports = {
  silly: function(){},
  verbose: function(){},
  debug: function(){},
  info: function(){},
  warn: function(){},
  error: function(){
    console.log.apply(this, arguments);
  },
  log: function() {
    let level = arguments[0].toLowerCase();
    if (level === 'error') {
      console.log.apply(this, arguments);
    }
  },
};

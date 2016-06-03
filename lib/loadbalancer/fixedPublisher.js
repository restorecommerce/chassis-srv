'use strict';

var co = require('co');

/**
 * fixedPublisher yields a set of fixed endpoints provided to it.
 *
 * @param  {array.generator} endpoints   Fixed endpoints.
 */
function* fixedPublisher(endpoints) {
  while (true) {
    yield co(function*() {
      return endpoints;
    });
  }
}

module.exports.fixedPublisher = fixedPublisher;

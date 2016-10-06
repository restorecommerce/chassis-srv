'use strict';

/*  eslint-disable require-yield */

const co = require('co');

/**
 * fixedPublisher yields a set of fixed endpoints provided to it.
 *
 * @param  {array.generator} endpoints   Fixed endpoints.
 */
function* fixedPublisher(endpoints) {
  while (endpoints !== undefined) {
    yield co(function* send() {
      return endpoints;
    });
  }
}

module.exports.fixedPublisher = fixedPublisher;

'use strict';

var co = require('co');

/**
 * fixedPublisher yields a set of fixed endpoints provided to it.
 * @param  {array.function*} endpoints   Fixed endpoints.
 * @return {array.function*}           A Publisher.
 */
function* fixedPublisher(endpoints) {
  while (true) {
    yield co(function*(){
      return endpoints;

    });
  }
}

module.exports.fixedPublisher = fixedPublisher;

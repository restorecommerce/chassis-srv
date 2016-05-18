'use strict';

/**
 * fixedPublisher yields a set of fixed endpoints provided to it.
 * @param  {array.function*} endpoints   Fixed endpoints.
 * @return {Object}           A Publisher.
 */
function* fixedPublisher(endpoints) {
  while (true) {
    console.log('fixedPublisher', endpoints);
    yield endpoints;
  }
}

module.exports.fixedPublisher = fixedPublisher;

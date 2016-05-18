'use strict';

var co = require('co');

/**
 * roundRobin is a simple load balancer that returns each of the published endpoints in sequence.
 * @param  {function*} publisher An endpoint publisher.
 * @return {Promise.function*}           An endpoint.
 */
function* roundRobin(publisher) {
  if (!publisher) {
    throw new Error('missing publisher');
  }
  var counter = 0;
  while(true) {
    yield co(function*() {
      let p = publisher.next();
      if (p.done) throw new Error('publisher is done');
      let endpoints = yield p.value;
      if (!endpoints || endpoints.length === 0) {
        throw new Error('publisher did not return endpoints');
      }
      return endpoints[counter % endpoints.length];
    });
    counter++;
  }
}

module.exports.roundRobin = roundRobin;

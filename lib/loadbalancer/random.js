'use strict';

let Random = require('random-js');
var co = require('co');

/**
 * random is a simple load balancer that returns a randomly selected endpoint;
 * @param  {function*} publisher An endpoint publisher.
 * @param  {number} seed      Seed for random generator.
 * @return {function*}           An endpoint.
 */
function* random(publisher, seed) {
  if (!publisher) {
    throw new Error('missing publisher');
  }
  let random = new Random(Random.engines.mt19937().seed(seed));
  while(true) {
    yield co(function*() {
      let p = publisher.next();
      if (p.done) throw new Error('publisher is done');
      let endpoints = yield p.value;
      if (!endpoints || endpoints.length === 0) {
        throw new Error('publisher did not return endpoints');
      }
      let m = Math.max(endpoints.length-1, 0);
      return endpoints[random.integer(0, m)];
    });
  }
}

module.exports.random = random;

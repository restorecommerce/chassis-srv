'use strict';

let Random = require("random-js");

/**
 * random is a simple load balancer that returns a randomly selected endpoint;
 * @param  {function*} publisher An endpoint publisher.
 * @param  {number} seed      Seed for random generator.
 * @return {function*}           An endpoint.
 */
function* random(publisher, seed) {
  let random = new Random(Random.engines.mt19937().seed(seed));
  for (var endpoints of publisher) {
    if (endpoints.length !== 0) {
      let m = Math.max(endpoints.length-1, 0);
      yield endpoints[random.integer(0, m)];
    }
  }
}

module.exports.random = random;

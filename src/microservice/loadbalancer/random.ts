'use strict';

const Random = require('random-js');
import * as co from "co";
// const co = require('co');

function* send(publisher: any, rnd: any): any {
  const p = publisher.next();
  if (p.done) {
    throw new Error('publisher is done');
  }
  const endpoints = yield p.value;
  if (!endpoints || endpoints.length === 0) {
    throw new Error('publisher did not return endpoints');
  }
  const m = Math.max(endpoints.length - 1, 0);
  return endpoints[rnd.integer(0, m)];
}

/**
 * random is a simple load balancer that returns a randomly selected endpoint;
 *
 * @param  {generator} publisher An endpoint publisher.
 * @param  {number} seed      Seed for random generator.
 */
export function* random(publisher: any, seed: number): any {
  if (!publisher) {
    throw new Error('missing publisher');
  }
  const rnd = new Random(Random.engines.mt19937().seed(seed));
  while (publisher !== undefined) {
    yield co(send(publisher, rnd)).catch((err) => {
      throw err;
    });
  }
}

// module.exports.random = random;

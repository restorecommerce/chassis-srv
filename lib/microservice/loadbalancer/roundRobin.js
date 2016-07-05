'use strict';

const co = require('co');

function* send(publisher, counter) {
  const p = publisher.next();
  if (p.done) {
    throw new Error('publisher is done');
  }
  const endpoints = yield p.value;
  if (!endpoints || endpoints.length === 0) {
    throw new Error('publisher did not return endpoints');
  }
  return endpoints[counter % endpoints.length];
}

/**
 * roundRobin is a simple load balancer that returns each of the published endpoints in sequence
 *
 * @param  {generator} publisher An endpoint publisher.
 */
function* roundRobin(publisher) {
  if (!publisher) {
    throw new Error('missing publisher');
  }
  let counter = 0;
  while (publisher !== undefined) {
    yield co(send(publisher, counter)).catch((err) => {
      throw err;
    });
    counter++;
  }
}

module.exports.roundRobin = roundRobin;

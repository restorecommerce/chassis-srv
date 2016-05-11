'use strict';

/**
 * roundRobin is a simple load balancer that returns each of the published endpoints in sequence.
 * @param  {function*} publisher An endpoint publisher.
 * @return {function*}           An endpoint.
 */
function* roundRobin(publisher) {
  if (!publisher) {
    throw new Error('missing publisher');
  }
  var counter = 0;
  for (var endpoints of publisher) {
    if (!endpoints || endpoints.length === 0) {
      throw new Error('publisher did not return endpoints');
    }
    yield endpoints[counter % endpoints.length];
    counter++;
  }
}

module.exports.roundRobin = roundRobin;

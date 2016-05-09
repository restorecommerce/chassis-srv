'use strict';

/**
 * roundRobin is a simple load balancer that returns each of the published endpoints in sequence.
 * @param  {function*} publisher An endpoint publisher.
 * @return {function*}           An endpoint.
 */
function* roundRobin(publisher) {
  var counter = 0;
  for (var endpoints of publisher) {
    if (endpoints.length === 0) {
      throw new Error('no endpoints');
    } else {
      yield endpoints[counter % endpoints.length];
    }
    counter++;
  }
}

module.exports.roundRobin = roundRobin;

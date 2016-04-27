'use strict';

let util = require('util');

// retry wraps the load balancer to make it behave like a simple endpoint.
function retry(max, timeout, loadbalancer) {
  // TODO Add timeout
  return function*(request) {
    let errors = [];
    let timer = setTimeout(function(){
      throw new Error(util.format('deadline exceeded: %s', errors.join(';')));
    }, timeout);
    for(let i = 1; i <= max; i++) {
      let e = loadbalancer.next();
      try {
        let resp = yield e.value(request);
        clearTimeout(timer);
        return resp;
      } catch (e) {
        errors.push(e);
      }
    }
    throw new Error(util.format('retry attempts exceeded (%d): %s', max, errors.join(';')));
  };
}

// roundRobin is a simple load balancer that returns each of the published endpoints in sequence.
function* roundRobin(publisher) {
  for (var counter = 0;;counter++) {
    let endpoints = publisher.endpoints();
    yield endpoints[counter%endpoints.length];
  }
}

module.exports = {
  retry: retry,
  roundRobin: roundRobin
}

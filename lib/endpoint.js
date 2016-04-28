'use strict';

let util = require('util');

// retry wraps the load balancer to make it behave like a simple endpoint.
function retry(max, timeout, loadbalancer) {
  return function*(request) {
    let errors = [];
    let timedout = false;
    let timer = setTimeout(function(){
      timedout = true;
    }, timeout);
    for(let i = 1; i <= max; i++) {
      if (timedout) {
        throw new Error(util.format('deadline exceeded: %s', errors.join(';')));
      }
      try {
        let e = loadbalancer.next();
        let resp = yield e.value(request);
        clearTimeout(timer);
        return yield resp;
      } catch (e) {
        if (e.message === 'no endpoints') {
          clearTimeout(timer);
          throw e;
        }
        errors.push(e);
      }
    }
    clearTimeout(timer);
    throw new Error(util.format('retry attempts exceeded (%d): %s', max, errors.join(';')));
  };
}

// roundRobin is a simple load balancer that returns each of the published endpoints in sequence.
function* roundRobin(publisher) {
  for (var counter = 0;;counter++) {
    let endpoints = publisher.endpoints();
    if (endpoints.length === 0) {
      throw new Error('no endpoints');
    } else {
      yield endpoints[counter%endpoints.length];
    }
  }
}

module.exports = {
  retry: retry,
  roundRobin: roundRobin
}

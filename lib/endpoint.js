'use strict';

let util = require('util');
let attempt = require('retry');
let wait = require('wait.for-es6');

// retry wraps the load balancer to make it behave like a simple endpoint.
function retry(max, timeout, loadbalancer) {
  return function*(request) {
    function run(callback) {
      let errors = [];
      let operation = attempt.operation({
        retries: max,
        minTimeout: 0,
        maxTimeout: 10,
        unref: false
      });
      operation.attempt(function(currentAttempt) {
        let endpoint = loadbalancer.next();
        if (!endpoint.value) {
          let err = new Error('no endpoints');
          if (operation.retry(err)) {
            return;
          }
          callback(err ? operation.mainError() : null, null);
          return;
        }
        try {
          endpoint.value(request, function(err, result) {
            if (operation.retry(err)) {
              return;
            }
            callback(err ? operation.mainError() : null, result);
          });
        } catch (err) {
          if (operation.retry(err)) {
            return;
          }
          callback(err ? operation.mainError() : null, result);
        }
      });
    }
    let resp = (yield wait.for(run))[0];
    return resp;
  };
}

// roundRobin is a simple load balancer that returns each of the published endpoints in sequence.
function* roundRobin(publisher) {
  for (var counter = 0;; counter++) {
    let endpoints = publisher.endpoints();
    if (endpoints.length === 0) {
      yield null;
    } else {
      yield endpoints[counter % endpoints.length];
    }
  }
}

module.exports = {
  retry: retry,
  roundRobin: roundRobin
}

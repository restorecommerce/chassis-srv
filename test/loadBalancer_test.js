'use strict';

var mocha = require('mocha');
var coMocha = require('co-mocha');
coMocha(mocha);

var assert = require('assert');
var should = require('should');
var util = require('util');
var co = require('co');
var logger = require('./logger_test.js');
var isGeneratorFn = require('is-generator').fn;
var loadBalancer = require('../lib/loadbalancer');

function* endpoint(request, context) {
  return yield {
    result: 'ok',
  };
}

describe('fixed publisher', function() {
  it('should always yield its input', function*() {
    let endpoints = [endpoint];
    let publisher = loadBalancer.fixedPublisher(endpoints);
    let n = publisher.next();
    assert(!n.done);
    assert(n.value);
    assert(n.value.then);
    let result = yield n.value;
    assert.equal(endpoints, result);
  });
});

describe('static publisher', function() {
  let factory = function*(instance) {
    assert.equal(instance, 'test');
    return endpoint;
  };
  it('should always yield the same endpoints', function*() {
    let instances = ['test'];
    let publisher = loadBalancer.staticPublisher(instances, factory, logger);
    let n = publisher.next();
    assert(!n.done);
    assert(n.value);
    assert(n.value.then);
    let resultA = yield n.value;

    n = publisher.next();
    assert(!n.done);
    assert(n.value);
    assert(n.value.then);
    let resultB = yield n.value;

    assert.equal(resultA, resultB);
  });
  it('should throw an error with no instances', function*() {
    let result = yield co(function*() {
      let publisher = loadBalancer.staticPublisher([], factory, logger);
      let n = publisher.next();
      return yield n.value;
    }).then(function(result) {
      assert.ok(false, 'should not call then');
    }).catch(function(err) {
      assert(err);
    });
    assert(result === undefined);
  });
});

var tests = [{
  name: 'random',
  loadBalancer: function(publisher) {
    return loadBalancer.random(publisher, 1);
  },
}, {
  name: 'roundRobin',
  loadBalancer: function(publisher) {
    return loadBalancer.roundRobin(publisher);
  },
}];

tests.forEach(function(test) {
  describe(util.format('%s loadBalancer', test.name), function() {
    let zeroEndpoints = [];
    let oneEndpoints = [endpoint];
    let endpoints = [endpoint, endpoint, endpoint];

    describe('with no publisher, calling next', function() {
      it('should throw an error', function*() {
        let lb = test.loadBalancer();
        assert.throws(lb.next);
      });
    });

    describe('with fixedPublisher and three endpoints, calling next',
      function() {
        let publisher = loadBalancer.fixedPublisher(endpoints);
        let lb = test.loadBalancer(publisher);
        let r = lb.next();
        it('should not end the loadBalancer', function*() {
          assert.ok(!r.done);
        });
        it('should return one endpoint promise', function*() {
          assert(r.value);
          assert(r.value.then);
        });
        it('should return generator function which when called yields a result',
          function*() {
            // yield r.value because it is a promise
            let endpoint = yield r.value;
            assert.ok(isGeneratorFn(endpoint));
            let result = yield endpoint({}, {});
            result.should.have.property('result', 'ok');
          });
      });

    describe('with fixedPublisher and one endpoint, calling next', function() {
      let publisher = loadBalancer.fixedPublisher(oneEndpoints);
      let lb = test.loadBalancer(publisher);
      let r = lb.next();
      it('should not end the loadBalancer', function*() {
        assert.ok(!r.done);
      });
      it('should return one endpoint promise', function*() {
        assert(r.value);
        assert(r.value.then);
      });
      it('should return a generator function which when called yields a result',
        function*() {
          // yield r.value because it is a promise
          let endpoint = yield r.value;
          assert.ok(isGeneratorFn(endpoint));
          let result = yield endpoint({}, {});
          result.should.have.property('result', 'ok');
        });
    });

    describe('with fixedPublisher and zero endpoint, calling next', function() {
      let publisher = loadBalancer.fixedPublisher(zeroEndpoints);
      let lb = test.loadBalancer(publisher);
      it('should throw an error', function*() {
        let result = yield co(function*() {
          let r = lb.next();
          let endpoint = yield r.value;
          return endpoint;
        }).then(function(result) {
          assert.ok(false, 'should not call then');
        }).catch(function(err) {
          assert(err);
        });
        assert(result === undefined);
      });
      it('should throw an error after calling it again', function*() {
        let result = yield co(function*() {
          let r = lb.next();
          let endpoint = yield r.value;
          return endpoint;
        }).then(function(result) {
          assert.ok(false, 'should not call then');
        }).catch(function(err) {
          assert(err);
        });
        assert(result === undefined);
      });
    });
  });
});

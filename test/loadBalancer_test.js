'use strict';

/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
const mocha = require('mocha');
const coMocha = require('co-mocha');

coMocha(mocha);

const should = require('should');
const co = require('co');
const logger = require('./logger_test.js');
const isGeneratorFn = require('is-generator').fn;
const loadBalancer = require('../').microservice.loadbalancer;

/* global describe it */

function* endpoint(request, context) {
  return yield {
    result: 'ok',
  };
}

describe('fixed publisher', () => {
  it('should always yield its input', function* checkFixedPublisher() {
    const endpoints = [endpoint];
    const publisher = loadBalancer.fixedPublisher(endpoints);
    const n = publisher.next();
    n.done.should.not.be.ok();
    should.exist(n.value);
    should.exist(n.value.then);
    n.value.then.should.be.Function();
    const result = yield n.value;
    should.exist(result);
    endpoints.should.equal(result);
  });
});

describe('static publisher', () => {
  const factory = function makeFactory(instance) {
    should.exist(instance);
    instance.should.equal('test');
    return endpoint;
  };
  it('should always yield the same endpoints', function* checkStaticPublisherWithEndpoints() {
    const instances = ['test'];
    const publisher = loadBalancer.staticPublisher(instances, factory, logger);
    let n = publisher.next();
    n.done.should.not.be.ok();
    should.exist(n.value);
    should.exist(n.value.then);
    const resultA = yield n.value;

    n = publisher.next();
    n.done.should.not.be.ok();
    should.exist(n.value);
    should.exist(n.value.then);
    const resultB = yield n.value;

    resultA.should.equal(resultB);
  });
  it('should throw an error with no instances', function* checkStaticPublisherWithoutEndpoints() {
    const result = yield co(function* getEndpoint() {
      const publisher = loadBalancer.staticPublisher([], factory, logger);
      const n = publisher.next();
      return yield n.value;
    }).then((res) => {
      should.ok(false, 'should not call then');
    }).catch((err) => {
      should.exist(err);
      err.should.be.Error();
      err.message.should.equal('no endpoints');
    });
    should.not.exist(result);
  });
});

const tests = [{
  name: 'random',
  loadBalancer(publisher) {
    return loadBalancer.random(publisher, 1);
  },
}, {
  name: 'roundRobin',
  loadBalancer(publisher) {
    return loadBalancer.roundRobin(publisher);
  },
}];

tests.forEach((test) => {
  describe(`${test.name} loadBalancer`, () => {
    const zeroEndpoints = [];
    const oneEndpoints = [endpoint];
    const endpoints = [endpoint, endpoint, endpoint];

    describe('with no publisher, calling next', () => {
      it('should throw an error', () => {
        const lb = test.loadBalancer();
        lb.next.should.throw();
      });
    });

    describe('with fixedPublisher and three endpoints, calling next',
      () => {
        const publisher = loadBalancer.fixedPublisher(endpoints);
        const lb = test.loadBalancer(publisher);
        const r = lb.next();
        it('should not end the loadBalancer', () => {
          r.done.should.not.be.ok();
        });
        it('should return one endpoint promise', () => {
          should.exist(r.value);
          should.exist(r.value.then);
        });
        it('should return generator function which when called yields a result',
          function* getEndpoint() {
            // yield r.value because it is a promise
            const e = yield r.value;
            should.ok(isGeneratorFn(e));
            const result = yield e({}, {});
            result.should.have.property('result', 'ok');
          });
      });

    describe('with fixedPublisher and one endpoint, calling next', () => {
      const publisher = loadBalancer.fixedPublisher(oneEndpoints);
      const lb = test.loadBalancer(publisher);
      const r = lb.next();
      it('should not end the loadBalancer', () => {
        r.done.should.not.be.ok();
      });
      it('should return one endpoint promise', () => {
        should.exist(r.value);
        should.exist(r.value.then);
      });
      it('should return a generator function which when called yields a result',
        function* getEndpoint() {
          // yield r.value because it is a promise
          const e = yield r.value;
          should.ok(isGeneratorFn(e));
          const result = yield e({}, {});
          result.should.have.property('result', 'ok');
        });
    });

    describe('with fixedPublisher and zero endpoint, calling next', () => {
      const publisher = loadBalancer.fixedPublisher(zeroEndpoints);
      const lb = test.loadBalancer(publisher);
      it('should throw an error', function* checkGetEndpoint() {
        const result = yield co(function* getEndpoint() {
          const r = lb.next();
          return yield r.value;
        }).then((res) => {
          should.ok(false, 'should not call then');
        }).catch((err) => {
          should.exist(err);
          err.should.be.Error();
          err.message.should.equal('publisher did not return endpoints');
        });
        should.not.exist(result);
      });
      it('should throw an error after calling it again', function* checkGetEndpoint() {
        const result = yield co(function* getEndpoint() {
          const r = lb.next();
          return yield r.value;
        }).then((res) => {
          should.ok(false, 'should not call then');
        }).catch((err) => {
          should.exist(err);
          err.should.be.Error();
          err.message.should.equal('publisher did not return endpoints');
        });
        should.not.exist(result);
      });
    });
  });
});

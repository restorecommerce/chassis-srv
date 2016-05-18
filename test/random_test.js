'use strict';

var mocha = require('mocha')
var coMocha = require('co-mocha')
coMocha(mocha)

var assert = require('assert');
var should = require('should');
var isGeneratorFn = require('is-generator').fn
var loadBalancer = require('../lib/loadbalancer');

function* endpoint(request, context){
  return yield {result:'ok'};
}

describe('random loadBalancer', function () {
  let zeroEndpoints = [];
  let oneEndpoints = [endpoint];
  let endpoints = [endpoint, endpoint, endpoint];

  describe('with fixedPublisher and three endpoints, calling next', function () {
    let publisher = loadBalancer.fixedPublisher(endpoints);
    let random = loadBalancer.random(publisher, 1);
    let r = random.next();
    it('should not end the loadBalancer', function* (){
      assert.ok(!r.done);
    });
    it('should return one endpoint promise', function* (){
      assert(r.value);
      assert(r.value.then);
    });
    it('the endpoint should be a generator function and calling it should return a result', function* (){
      // yield r.value because it is a promise
      let endpoint = yield r.value;
      assert.ok(isGeneratorFn(endpoint));
      let result = yield endpoint({},{});
      result.should.have.property('result', 'ok');
    });
  });

  describe('with fixedPublisher and one endpoint, calling next', function () {
    let publisher = loadBalancer.fixedPublisher(oneEndpoints);
    let random = loadBalancer.random(publisher, 1);
    let r = random.next();
    it('should not end the loadBalancer', function* (){
      assert.ok(!r.done);
    });
    it('should return one endpoint promise', function* (){
      assert(r.value);
      assert(r.value.then);
    });
    it('the endpoint should be a generator function and calling it should return a result', function* (){
      // yield r.value because it is a promise
      let endpoint = yield r.value;
      assert.ok(isGeneratorFn(endpoint));
      let result = yield endpoint({},{});
      result.should.have.property('result', 'ok');
    });
  });

  describe('with fixedPublisher and zero endpoint, calling next', function () {
    let publisher = loadBalancer.fixedPublisher(zeroEndpoints);
    let random = loadBalancer.random(publisher, 1);
    it('should throw an error', function* (){
      var fn = function*(){
        let r = random.next();
        let endpoint = yield r.value;
      };
      assert.throws(fn().next, 'publisher did not return endpoints');
    });
  });
});

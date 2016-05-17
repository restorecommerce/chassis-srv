'use strict';

var mocha = require('mocha')
var coMocha = require('co-mocha')
coMocha(mocha)

var assert = require('assert');
var co = require('co');
var isGenerator = require('is-generator');


var loadBalancer = require('../lib/loadbalancer');

function* fixedPublisher(endpoints) {
  while(true) {
    yield endpoints;
  }
}

function* endpoint(){
  return {error: null};
}

describe('random loadBalancer', function () {
  let endpoints = [endpoint()];
  let publisher = fixedPublisher(endpoints);
  let random = loadBalancer.random(publisher, 1);

  describe('calling next', function () {
    let r = random.next();
    let endpoint = r.value;
    it('should not end the loadBalancer', function* (){
      assert.ok(!r.done);
    });
    it('should return one endpoint', function* (){
      assert(r.value);
    });
    it('the endpoint should be a generator function', function* (){
      console.log(endpoint)
      assert.ok(isGenerator(endpoint));
    });
  });
});

'use strict';

var mocha = require('mocha');
var coMocha = require('co-mocha');
coMocha(mocha);

var assert = require('assert');
var should = require('should');
var util = require('util');
var co = require('co');
var isGenerator = require('is-generator');
var isGeneratorFn = require('is-generator').fn;
var chain = require('../lib/endpoint').chain;

function* endpoint(request, context) {
  return yield {
    chain: context.chain,
  };
}

function makeMiddleware(n) {
  return function*(next) {
    return function*(request, context) {
      context.chain.push(n);
      return yield next(request, context);
    };
  };
}

describe('endpoint.chain', function() {
  let middleware;
  let tree = [];
  let e;
  it('should chain middleware', function*() {
    let middlewares = [];
    for (let i = 0; i < 5; i++) {
      tree.push(i);
      middlewares.push(makeMiddleware(i));
    }
    middleware = chain(middlewares);
  });
  it('should return a generator function which yields an endpoint (generator)',
    function*() {
      assert(isGeneratorFn(middleware));
      e = yield middleware(endpoint);
      assert(isGeneratorFn(e));
    });
  it('should call middlewares in sequence from first to last', function*() {
    let result = yield e({}, {
      chain: [],
    });
    assert.deepEqual(tree, result.chain);
  });
});

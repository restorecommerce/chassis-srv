'use strict';

/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
const mocha = require('mocha');
const coMocha = require('co-mocha');
coMocha(mocha);

const should = require('should');
const isGeneratorFn = require('is-generator').fn;
const chain = require('../').microservice.endpoint.chain;

/* global describe it*/

function* endpoint(request, context) {
  return yield {
    chain: context.chain,
  };
}

function makeMiddleware(n) {
  return function* genMiddleware(next) {
    return function* middleware(request, context) {
      context.chain.push(n);
      return yield next(request, context);
    };
  };
}

describe('endpoint.chain', () => {
  let middleware;
  const tree = [];
  let e;
  it('should chain middleware', function* checkChainMiddleware() {
    const middlewares = [];
    for (let i = 0; i < 5; i++) {
      tree.push(i);
      middlewares.push(makeMiddleware(i));
    }
    middleware = chain(middlewares);
  });
  it('should return a generator function which yields an endpoint (generator)',
    function* checkMiddlewareCreating() {
      should.ok(isGeneratorFn(middleware));
      e = yield middleware(endpoint);
      should.ok(isGeneratorFn(e));
    });
  it('should call middlewares in sequence from first to last', function* checkMiddlewareCalling() {
    const result = yield e({}, {
      chain: [],
    });
    should.exist(result);
    should.exist(result.chain);
    result.chain.should.deepEqual(tree);
  });
});

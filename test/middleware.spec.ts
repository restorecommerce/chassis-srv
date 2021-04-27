import * as should from 'should';
import { chainMiddleware as chain } from '../src';

/* global describe it*/

function endpoint(request, context) {
  return {
    chain: context.chain,
  };
}

function makeMiddleware(n) {
  return function genMiddleware(next) {
    return async function middleware(request, context) {
      context.chain.push(n);
      return await next(request, context);
    };
  };
}

describe('endpoint.chain', () => {
  let middleware: any;
  const tree = [];
  let e;
  it('should chain middleware', function checkChainMiddleware() {
    const middlewares = [];
    for (let i = 0; i < 5; i += 1) {
      tree.push(i);
      middlewares.push(makeMiddleware(i));
    }
    middleware = chain(middlewares);
  });
  it('should return an async function which gives an endpoint',
    async function checkMiddlewareCreating() {
      e = await middleware(endpoint);
      should.exist(e);
    });
  it('should call middlewares in sequence from first to last', async function checkMiddlewareCalling() {
    const result = await e({}, {
      chain: [],
    });
    should.exist(result);
    should.exist(result.chain);
    result.chain.should.deepEqual(tree);
  });
});

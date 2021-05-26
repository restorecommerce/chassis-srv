import * as should from 'should';
import { chainMiddleware as chain } from '../src';

/* global describe it*/

const endpoint = (request, context) => {
  return {
    chain: context.chain,
  };
};

const makeMiddleware = (n) => {
  return (next) => {
    return async (request, context) => {
      context.chain.push(n);
      return await next(request, context);
    };
  };
};

describe('endpoint.chain', () => {
  let middleware: any;
  const tree = [];
  let e;
  it('should chain middleware', () => {
    const middlewares = [];
    for (let i = 0; i < 5; i += 1) {
      tree.push(i);
      middlewares.push(makeMiddleware(i));
    }
    middleware = chain(middlewares);
  });
  it('should return an async function which gives an endpoint',
    async () => {
      e = await middleware(endpoint);
      should.exist(e);
    });
  it('should call middlewares in sequence from first to last', async () => {
    const result = await e({}, {
      chain: [],
    });
    should.exist(result);
    should.exist(result.chain);
    result.chain.should.deepEqual(tree);
  });
});

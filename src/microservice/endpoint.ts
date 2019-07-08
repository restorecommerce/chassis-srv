import * as _ from 'lodash';
import * as rTracer from 'cls-rtracer';

const middlewareClsTracer = rTracer.koaMiddleware({
  useHeader: true,
  headerName: 'x-request-id'
});

/**
 * calls each middleware
 * @param middleware
 */
export function chainMiddleware(middleware: any): any {
  return async function middlewareChain(request, next: any): Promise<any> {
    let n = next;
    if (next) {
      for (let i = middleware.length - 1; i >= 0; i -= 1) {
        const reqClone = _.clone(request);
        Object.assign(request, { req: reqClone }, {res: reqClone});
        const result = await middleware[i](request, async () => {
          const grpcRequest = { request: request.request };
          delete grpcRequest.request.headers;
          return await next(grpcRequest);
        });
        if (i == 0) {
          return result;
        }
      }
    } else {
      n = request;
      for (let i = middleware.length - 1; i >= 1; i -= 1) {
        n = await middleware[i](n);
      }
    }
    return await middleware[0](n);
  };
}

/**
 * Calls middleware and business logic.
 * @param middleware
 * @param service
 * @param transportName
 * @param methodName
 * @param logger
 */
export function makeEndpoint(middleware: any[], service: any, transportName: string,
  methodName: string, logger: any): any {
  return async function callEndpoint(request: any, context: any): Promise<any> {
    const ctx = context || {};
    ctx.transport = transportName;
    ctx.method = methodName;
    ctx.logger = logger;
    let e;
    let rid = '';
    try {
      if (request && request.request && request.request.headers
        && request.request.headers['x-request-id']) {
        rid = request.request.headers['x-request-id'];
      }
      if (rid) {
        middleware.push(middlewareClsTracer);
      }

      if (middleware.length > 0) {
        logger.verbose(`[rid: ${rid}] received request to method ${ctx.method} over transport ${ctx.transport}`, request.request);
        const chain = chainMiddleware(middleware);
        const result = await chain(request, service[methodName].bind(service));
        const req = request.request;
        logger.verbose(`[rid: ${rid}] request to method ${ctx.method} over transport ${ctx.transport} result`, { req, result });
        return result;
      } else {
        e = service[methodName].bind(service);
      }

      logger.verbose(`received request to method ${ctx.method} over transport ${ctx.transport}`,
        request);
      const result = await e(request, ctx);
      logger.verbose(`request to method ${ctx.method} over transport ${ctx.transport} result`,
        { request, result });
      return result;
    } catch (err) {
      if (request.request) {
        request = request.request;
      }
      if (err instanceof SyntaxError || err instanceof RangeError ||
        err instanceof ReferenceError || err instanceof TypeError) {
        logger.error(`request to method ${ctx.method} over transport ${ctx.transport} error`,
          {
            request,
            err: err.stack
          });
      } else {
        logger.info(`request to method ${ctx.method} over transport ${ctx.transport} error`,
          { request, err });
      }
      throw err;
    }
  };
}

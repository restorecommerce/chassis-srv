/**
 * calls each middleware
 * @param middleware
 */
export function chainMiddleware(middleware: any): any {
  return async function middlewareChain(next: any): Promise<any> {
    let n = next;
    for (let i = middleware.length - 1; i >= 1; i -= 1) {
      n = await middleware[i](n);
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
    if (middleware.length > 0) {
      const chain = chainMiddleware(middleware);
      e = await chain(service[methodName].bind(service));
    } else {
      e = service[methodName].bind(service);
    }
    try {
      logger.verbose(`received request to method ${ctx.method} over transport ${ctx.transport}`,
        request);
      const result = await e(request, ctx);
      logger.verbose(`request to method ${ctx.method} over transport ${ctx.transport} result`,
        { request, result });
      return result;
    } catch (err) {
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

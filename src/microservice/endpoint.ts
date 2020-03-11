import * as _ from 'lodash';
import * as rTracer from 'cls-rtracer';
import { Logger } from '..';

const middlewareClsTracer = rTracer.koaMiddleware({
  useHeader: true,
  headerName: 'x-request-id'
});

/**
 * calls each middleware
 * @param middleware
 */
export const chainMiddleware = (middleware: any): any => {
  return async(request, next: any): Promise<any> => {
    let n = next;
    if (next) {
      for (let i = middleware.length - 1; i >= 0; i -= 1) {
        const reqClone = _.clone(request);
        Object.assign(request, { req: reqClone }, { res: reqClone });
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
};

/**
 * Calls middleware and business logic.
 * @param middleware
 * @param service
 * @param transportName
 * @param methodName
 * @param logger
 * @param cfg
 */
export const makeEndpoint = (middleware: any[], service: any, transportName: string,
  methodName: string, logger: Logger, cfg?: any): any => {
  return async(request: any, context: any): Promise<any> => {
    const ctx = context || {};
    ctx.transport = transportName;
    ctx.method = methodName;
    ctx.logger = logger;
    ctx.config = cfg;
    let e;
    let rid = '';
    let middlewareChain = [];
    if (middleware && middleware.length > 0) {
      middlewareChain.push(middleware);
    }
    /*
      bufferFields are defined in the config under each service's method as:
      "bufferFields": {
        "Request": "context"
      }

      As described in the proto file of each service,
      Request is the type of message and context is the type of data being sent.
     */

    // deep clone the request
    const deepClone = _.cloneDeep(request);
    const clonedRequest = deepClone.request;
    try {
      // Check if the cfg file contains any bufferFields
      if (ctx.config && ctx.config.services) {
        const service = ctx.config.services;
        const servicesKeys = Object.keys(ctx.config.services);
        for (let key of servicesKeys) {
          if (service[key] && service[key][ctx.method] && service[key][ctx.method].bufferFields) {
            let bufferFields = service[key][ctx.method].bufferFields;
            const bufferKeys = Object.keys(bufferFields);
            for (let key of bufferKeys) {
              const bufferField = bufferFields[key];
              // if any bufferField is found
              // delete it from the cloned object
              if (clonedRequest[bufferField]) {
                delete clonedRequest[bufferField];
              }
              // delete it from the test case
              if (clonedRequest.items[0].data) {
                delete clonedRequest.items[0].data;
              }
            }
          }
        }
      }
      logger.debug('invoking endpoint with request:', { request: clonedRequest });
      if (request && request.request && request.request.headers
        && request.request.headers['x-request-id']) {
        rid = request.request.headers['x-request-id'];
      }
      if (rid) {
        middlewareChain.push(middlewareClsTracer);
      }

      if (middlewareChain.length > 0) {
        logger.verbose(`[rid: ${rid}] received request to method ${ctx.method} over transport ${ctx.transport}`, clonedRequest);
        const chain = chainMiddleware(middlewareChain);
        const result = await chain(request, service[methodName].bind(service));
        logger.verbose(`[rid: ${rid}] request to method ${ctx.method} over transport ${ctx.transport} result`, { clonedRequest, result });
        return result;
      } else {
        e = service[methodName].bind(service);
      }

      logger.verbose(`received request to method ${ctx.method} over transport ${ctx.transport}`,
        clonedRequest);
      const result = await e(request, ctx);
      logger.verbose(`request to method ${ctx.method} over transport ${ctx.transport} result`,
        { clonedRequest, result });
      return result;
    } catch (err) {
      if (rid) {
        rid = `[rid: ${rid}]`;
      }
      if (err instanceof SyntaxError || err instanceof RangeError ||
        err instanceof ReferenceError || err instanceof TypeError) {
        logger.error(`${rid} request to method ${ctx.method} over transport ${ctx.transport} error`,
          {
            clonedRequest,
            err: err.stack
          });
      } else {
        logger.info(`${rid} request to method ${ctx.method} over transport ${ctx.transport} error`,
          { clonedRequest, err });
      }
      throw err;
    }
  };
};

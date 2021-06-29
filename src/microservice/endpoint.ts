import * as _ from 'lodash';
import * as rTracer from 'cls-rtracer';
import { Logger } from 'winston';
import { createServiceConfig } from '@restorecommerce/service-config';

const middlewareClsTracer = rTracer.koaMiddleware({
  useHeader: true,
  headerName: 'x-request-id'
});

const cfg = createServiceConfig(process.cwd());
const oneOfFieldsConfig = cfg.get('oneOfFields');

/**
 * calls each middleware
 * @param middleware
 */
export const chainMiddleware = (middleware: any): any => {
  return async (request, next: any): Promise<any> => {
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

// iterate iterates an object recursively
// and deletes an object's property if
// it matches the oneOfNotUsed field
const iterate = (obj, oneOfNotUsed) => {
  Object.keys(obj).forEach(key => {
    if (key === oneOfNotUsed) {
      delete (obj[key]);
    }
    if (typeof obj[key] === 'object' && !_.isNil(obj[key])) {
      iterate(obj[key], oneOfNotUsed);
    }
  });
};

const removeBufferFileds = (object, ctx) => {
  // Check if the cfg file contains any bufferFields and remove them
  if (!object) {
    object = {};
  }
  if (ctx.config && ctx.config.services) {
    const service = ctx.config.services;
    const servicesKeys = Object.keys(ctx.config.services);
    for (let key of servicesKeys) {
      // bufferFields
      if (service[key] && service[key][ctx.method] && service[key][ctx.method].bufferFields) {
        let bufferFields = service[key][ctx.method].bufferFields;
        const bufferKeys = Object.keys(bufferFields);
        for (let key of bufferKeys) {
          const bufferField = bufferFields[key];
          // if any bufferField is found
          // delete it from the cloned object
          if (object[bufferField]) {
            delete object[bufferField];
          }
          // delete it from the test case
          if (object.items && object.items[0]
            && object.items[0].data) {
            delete object.items[0].data;
          }
        }
      }
      // maskFields
      if (service[key] && service[key][ctx.method] && service[key][ctx.method].maskFields) {
        let maskFields = service[key][ctx.method].maskFields;
        for (let maskField of maskFields) {
          // if any maskField is configured, mask it
          if (object[maskField]) {
            const maskLength = object[maskField].length;
            object[maskField] = '*'.repeat(maskLength);
          }
          // delete it from the test case
          if (object.items && object.items[0]
            && object.items[0].data) {
            delete object.items[0].data;
          }
        }
      }
    }
  }
  return object;
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
  return async (request: any, context: any): Promise<any> => {
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

    // Check configuration if oneOf fields are configured for a resource
    // and then remove unnecessary oneOf fields from the request items to
    // avoid gRPC protobuf error.
    // To avoid accidental removal it is important
    // not to have fields which are named as one of the oneOf fields

    if (oneOfFieldsConfig && !_.isEmpty(oneOfFieldsConfig)) {
      if (ctx.method) {
        if (
          ctx.method === 'create' ||
          ctx.method === 'update' ||
          ctx.method === 'upsert'
        ) {
          // Read configuration for requested resource and make typeToFieldsMap
          // oneOfType => oneOfFields[]
          let oneOfFields = [];
          let typeToFieldsMap = new Map<string, string[]>();
          if (service && service.name) {
            let name = service.name;
            if (name in oneOfFieldsConfig) {
              oneOfFields = oneOfFieldsConfig[name];
              let oneOfFieldsKeys = Object.keys(oneOfFields);
              for (let oneOfFieldsKey of oneOfFieldsKeys) {
                typeToFieldsMap.set(oneOfFieldsKey, oneOfFields[oneOfFieldsKey]);
              }
            }
          }

          // Iterate through all the items and for each item check which of the
          // oneOf fields is set (can be multiple oneOf fields).
          // Then push the ones not being used in a list.
          // Finally based on this list remove fields which are not used
          // (recursively) from each item.
          if (!_.isEmpty(typeToFieldsMap)) {
            if (request && request.request && request.request.items) {
              for (let item of request.request.items) {
                let oneOfNotUsedList = [];
                let itemKeys = Object.keys(item);
                for (let itemKey of itemKeys) {
                  if (typeToFieldsMap.has(itemKey)) {
                    let oneOfUsed = item[itemKey];
                    let fieldsArr = typeToFieldsMap.get(itemKey);
                    for (let field of fieldsArr) {
                      if (field !== oneOfUsed) {
                        oneOfNotUsedList.push(field);
                      }
                    }
                  }
                }
                for (let oneOfNotUsed of oneOfNotUsedList) {
                  iterate(item, oneOfNotUsed);
                }
              }
            }
          }
        }
      }
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
    let Request = deepClone.request;
    try {
      if (Request && Request.request) {
        Request = Request.request;
      }
      Request = removeBufferFileds(Request, ctx);
      logger.debug('invoking endpoint with request:', Request);
      if (request && request.request && request.request.headers
        && request.request.headers['x-request-id']) {
        rid = request.request.headers['x-request-id'];
      }
      if (rid) {
        middlewareChain.push(middlewareClsTracer);
      }

      if (middlewareChain.length > 0) {
        logger.verbose(`[rid: ${rid}] received request to method ${ctx.method} over transport ${ctx.transport}`, Request);
        const chain = chainMiddleware(middlewareChain);
        const result = await chain(request, service[methodName].bind(service));
        let response = _.cloneDeep(result);
        response = removeBufferFileds(response, ctx);
        logger.verbose(`[rid: ${rid}] request to method ${ctx.method} over transport ${ctx.transport} response`, { Request, response });
        return result;
      } else {
        e = service[methodName].bind(service);
      }

      logger.verbose(`received request to method ${ctx.method} over transport ${ctx.transport}`,
        Request);
      const result = await e(request, ctx);
      let response = _.cloneDeep(result);
      response = removeBufferFileds(response, ctx);
      logger.verbose(`request to method ${ctx.method} over transport ${ctx.transport} response`,
        { Request, response });
      return result;
    } catch (err) {
      if (rid) {
        rid = `[rid: ${rid}]`;
      }
      if (err instanceof SyntaxError || err instanceof RangeError ||
        err instanceof ReferenceError || err instanceof TypeError) {
        logger.error(`${rid} request to method ${ctx.method} over transport ${ctx.transport} error`,
          {
            Request,
            err: err.stack
          });
      } else {
        logger.info(`${rid} request to method ${ctx.method} over transport ${ctx.transport} error`,
          { Request, err });
      }
      throw err;
    }
  };
};

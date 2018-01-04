'use strict';

/*  eslint-disable require-yield */

import * as path from "path";
import * as url from "url";
import * as ProtoBuf from "protobufjs";
import * as grpc from "grpc";
import * as co from "co";
import * as fs from "fs";
import * as _ from "lodash";
const errors = require('../../../errors');

/**
 * Name of the transport
 *
 * @const
 */
const NAME = 'grpc';


// function setGRPCLogger(logger: any): any {
//   // gRPC logger
//   const grpcLogger = {
//     error: logger.debug,
//   };
//   grpc.setLogger(grpcLogger);
// }

const errorMap = new Map([
  [grpc.status.CANCELLED, errors.Cancelled],
  [grpc.status.INVALID_ARGUMENT, errors.InvalidArgument],
  [grpc.status.NOT_FOUND, errors.NotFound],
  [grpc.status.ALREADY_EXISTS, errors.AlreadyExists],
  [grpc.status.PERMISSION_DENIED, errors.PermissionDenied],
  [grpc.status.UNAUTHENTICATED, errors.Unauthenticated],
  [grpc.status.FAILED_PRECONDITION, errors.FailedPrecondition],
  [grpc.status.ABORTED, errors.Aborted],
  [grpc.status.OUT_OF_RANGE, errors.OutOfRange],
  [grpc.status.UNIMPLEMENTED, errors.Unimplemented],
  [grpc.status.RESOURCE_EXHAUSTED, errors.ResourceExhausted],
  [grpc.status.DEADLINE_EXCEEDED, errors.DeadlineExceeded],
  [grpc.status.INTERNAL, errors.Internal],
  [grpc.status.UNAVAILABLE, errors.Unavailable],
  [grpc.status.DATA_LOSS, errors.DataLoss],
]);

function makeNormalServerEndpoint(endpoint: any, logger: any): any {
  return function normalServerEndpoint(call: any, callback: any): any {
    const req = call.request;
    if (!endpoint) {
      callback({
        code: grpc.status.UNIMPLEMENTED
      });
    }
    co(function* callEndpoint(): any {
      const result = yield endpoint({ request: req });
      return {
        error: null,
        result,
      };
    }).catch((error) => {
      let err = error;
      err.code = grpc.status.INTERNAL;
      errorMap.forEach((Err, key) => {
        if (err.constructor.name === Err.name) {
          err = new Err(err.details);
          err.code = key;
        }
      }, errorMap);
      return {
        error: err,
        result: null
      };
    })
      .then((resp) => {
        callback(resp.error, resp.result);
      })
      .catch((err) => {
        logger.error('grpc transport error', err, err.stack);
      });
  };
}

function makeResponseStreamServerEndpoint(endpoint: any,
  logger: any): any {
  return function responseStreamServerEndpoint(call: any): any {
    co(endpoint({
      request: call.request,
      * write(response: any): any {
        call.write(response);
      },
      * end(): any {
        call.end();
      },
    }));
  };
}

function makeRequestStreamServerEndpoint(endpoint: any, logger: any): any {
  return function requestStreamServerEndpoint(call: any, callback: any): any {
    const requests = [];
    const fns = [];
    let end = false;
    call.on('data', (req) => {
      if (fns.length) {
        fns.shift()(null, req);
      } else {
        requests.push(req);
      }
    });
    call.on('end', () => {
      end = true;
      while (fns.length) {
        fns.shift()(new Error('stream end'), null);
      }
    });
    co(endpoint({
      * read(): any {
        return yield function r(cb: any): any {
          if (requests.length) {
            cb(null, requests.shift());
          } else if (end) {
            throw new Error('stream end');
          } else {
            fns.push(cb);
          }
        };
      },
    })).then((result) => {
      callback(null, result);
    }).catch((err) => {
      callback(err);
    });
  };
}

function makeBiDirectionalStreamServerEndpoint(endpoint: any, logger: any): any {
  return function biDirectionalStreamServerEndpoint(call: any): any {
    const requests = [];
    const fns = [];
    let end = false;
    call.on('data', (req) => {
      if (fns.length) {
        fns.shift()(null, req);
      } else {
        requests.push(req);
      }
    });
    call.on('end', () => {
      end = true;
      while (fns.length) {
        fns.shift()(new Error('stream end'), null);
      }
    });
    co(endpoint({
      * write(response: any): any {
        call.write(response);
      },
      * read(): any {
        return yield function r(cb: any): any {
          if (requests.length) {
            cb(null, requests.shift());
          } else if (end) {
            throw new Error('stream end');
          } else {
            fns.push(cb);
          }
        };
      },
      * end(): any {
        call.end();
      },
    }));
  };
}

/**
 * wrapServerEndpoint wraps the endpoint to provide a gRPC service method.
 *
 * @param  {generator} endpoint Endpoint which will be served as a gRPC service method.
 * @param  {object} stream Settings for request,response or bi directional stream.
 * @return {function}          The function can be used as a gRPC service method.
 */
function wrapServerEndpoint(endpoint: any, logger: any, stream: any): any {
  if (_.isNil(endpoint)) {
    throw new Error('missing argument endpoint');
  }
  if (_.isNil(logger)) {
    throw new Error('missing argument logger');
  }
  if (stream.requestStream && stream.responseStream) {
    return makeBiDirectionalStreamServerEndpoint(endpoint, logger);
  }
  if (stream.requestStream) {
    return makeRequestStreamServerEndpoint(endpoint, logger);
  }
  if (stream.responseStream) {
    return makeResponseStreamServerEndpoint(endpoint, logger);
  }
  return makeNormalServerEndpoint(endpoint, logger);
}

function buildProtobuf(files: Object, protoroot: string, logger: any): Object {
  // build protobuf
  let root = new ProtoBuf.Root();

  _.forEach(files, (fileName, key) => {
    root.resolvePath = function(origin, target) {
    // origin is the path of the importing file
    // target is the imported path
    // determine absolute path and return it ...
    return protoroot + fileName;
    };
    root.loadSync(protoroot + fileName);
  });

  return root;
}

/**
 * Server transport provider.
 * @class
 */
export class Server {

  config: any;
  logger: any;
  server: grpc.Server;
  builder: any;
  proto: any;
  service: any;
  name: string;
  isBound: boolean;
  /**
   * Server is a gRPC transport provider for serving.
   *
   * @param {Object} config Configuration object.
   * Requires properties:addr,package,proto,service
   * Optional properties: credentials.ssl.certs
   */
  constructor(config: any, logger: any) {
    if (_.isNil(logger)) {
      throw new Error('gRPC server transport provider requires a logger');
    }
    if (!_.has(config, 'addr')) {
      throw new Error('server is missing addr config field');
    }
    if (!_.has(config, 'services')) {
      throw new Error('server is missing services config field');
    }
    this.config = config;
    this.logger = logger;

    console['error'] = logger.debug;
    // gRPC logger
    grpc.setLogger(console);

    this.server = new grpc.Server();

    // build protobuf
    const protoRoot = config.protoRoot || path.join(process.cwd(), 'protos');
    if (_.isNil(protoRoot) || _.size(protoRoot) === 0) {
      throw new Error('config value protoRoot is not set');
    }
    const protos = config.protos;
    if (_.isNil(protos) || _.size(protos) === 0) {
      throw new Error('config value protos is not set');
    }
   this.logger.verbose(`gRPC Server loading protobuf files from root ${protoRoot}`, protos);


    const proto = [];
    for ( let i = 0; i < protos.length; i++) {
      const filePath = {root: protoRoot, file: protos[i]};
      this.proto = grpc.load(filePath);
      proto[i] = this.proto;
    }

    let k = 0;
    this.service = _.transform(this.config.services, (service, protobufServiceName, serviceName) => {
        const serviceDef = _.get(proto[k], protobufServiceName);
        if (_.isNil(serviceDef)) {
            throw new Error(`Could not find ${protobufServiceName} protobuf service`);
        }
        _.set(service, serviceName, serviceDef.service);
        k++;
        logger.verbose('gRPC service loaded', serviceName);
    });
    this.name = NAME;
  }

  /**
   * bind maps the service to gRPC methods and binds the address.
   *
   * @param  {string} name Service name.
   * @param  {Object} service Business logic
   */
  * bind(name: string, service: Object): any {
    if (_.isNil(name)) {
      throw new Error('missing argument name');
    }
    if (!_.isString(name)) {
      throw new Error('argument name is not of type string');
    }
    if (_.isNil(service)) {
      throw new Error('missing argument service');
    }
    const protoService = this.service[name];
    if (_.isNil(protoService)) {
      throw new Error(`service ${name} does not exist in transport ${this.name}`);
    }
    // wrap all service methods
    const binding = {};
    const funcs = _.functionsIn(service);
    if (funcs.length === 0) {
      throw new Error('service object does not have functions');
    }
    for (let i = 0; i < funcs.length; i += 1) {
      const methodName = funcs[i];
      const methods = protoService;
      const methodDef = _.find(methods, (m) => {
        return m.originalName.toLowerCase() === methodName.toLowerCase();
      });
      const stream = {
        requestStream: false,
        responseStream: false,
      };
      if (methodDef) {
        stream.requestStream = methodDef.requestStream;
        stream.responseStream = methodDef.responseStream;
      }
      binding[methodName] = wrapServerEndpoint(service[methodName], this.logger, stream);
    }
    this.server.addService(protoService, binding);
  }

  /**
   * start launches the gRPC server and provides the service endpoints.
   */
  * start(): any {
    if (!this.isBound) {
      let credentials = grpc.ServerCredentials.createInsecure();
      if (_.has(this.config, 'credentials.ssl')) {
        credentials = grpc.credentials.createSsl(
          this.config.credentials.ssl.certs);
      }
      this.server.bind(this.config.addr, credentials);
      this.isBound = true;
    }
    this.server.start();
  }

  /**
   * end stops the gRPC server and no longer provides the service endpoints.
   */
  * end(): any {
    const server = this.server;
    const shutdown = function shutdownWrapper(): any {
      return function tryShutdown(cb: any): any {
        server.tryShutdown(cb);
      };
    };
    yield shutdown();
  }
}

module.exports.Name = NAME;
// module.exports.Client = Client;
// module.exports.Server = Server;
import {ServerReflection} from './reflection';
// const ServerReflection = require('./reflection.ts').ServerReflection;
export {ServerReflection};

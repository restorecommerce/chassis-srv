'use strict';

const util = require('util');
const path = require('path');
const url = require('url');
const ProtoBuf = require('protobufjs');
const grpc = require('grpc');
const co = require('co');
const fs = require('fs');
const glob = require('glob');
const _ = require('lodash');
const errors = require('../../../microservice/errors');

/**
 * Name of the transport
 *
 * @const
 */
const NAME = 'grpc';


function setGRPCLogger(logger) {
  // gRPC logger
  const grpcLogger = {
    error: logger.info,
  };
  grpc.setLogger(grpcLogger);
}

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

function makeNormalClientEndpoint(client, methodName) {
  return function* normalClientEndpoint(request, context) {
    const options = {};
    if (_.has(context, 'timeout')) {
      options.deadline = Date.now() + context.timeout;
    }
    const req = request || {};
    function callEndpointWrapper() {
      return function callEndpoint(callback) {
        try {
          client[methodName](req, options, callback);
        } catch (err) {
          // TODO Decide on how to handle endpoint connection disruptions
          if (err.message === 'Call cannot be created from a closed channel') {
            err.code = grpc.status.UNAVAILABLE;
          }
          callback(err);
        }
      };
    }
    try {
      const result = yield callEndpointWrapper();
      const response = {
        error: null,
        data: result,
      };
      return response;
    } catch (err) {
      if (err.code) {
        const Err = errorMap.get(err.code);
        if (Err) {
          return {
            error: new Err(err.message),
          };
        }
      }
      throw err;
    }
  };
}

function makeResponseStreamClientEndpoint(client, methodName) {
  return function* responseStreamClientEndpoint(request, context) {
    const responses = [];
    const fns = [];
    let end = false;
    const req = request || {};
    const call = client[methodName](req);
    call.on('data', (response) => {
      if (fns.length) {
        fns.shift()(null, response);
      } else {
        responses.push(response);
      }
    });
    call.on('end', () => {
      end = true;
      while (fns.length) {
        fns.shift()(new Error('stream end'), null);
      }
    });
    return {
      *read() {
        return yield function r(cb) {
          if (responses.length) {
            cb(null, responses.shift());
          } else if (end) {
            throw new Error('stream end');
          } else {
            fns.push(cb);
          }
        };
      },
    };
  };
}

function makeRequestStreamClientEndpoint(client, methodName) {
  return function* requestStreamClientEndpoint() {
    const responses = [];
    const fns = [];
    let end = false;
    const call = client[methodName]((err, response) => {
      if (fns.length) {
        fns.shift()(err, response);
      } else {
        responses.push(response);
      }
    });
    call.on('data', (response) => {
      if (fns.length) {
        fns.shift()(null, response);
      } else {
        responses.push(response);
      }
    });
    call.on('end', () => {
      end = true;
      while (fns.length) {
        fns.shift()(new Error('stream end'), null);
      }
    });
    return {
      *write(request, context) {
        // TODO context to options
        call.write(request);
      },
      *end() {
        return yield function r(cb) {
          call.end();
          if (responses.length) {
            cb(null, responses.shift());
          } else if (end) {
            throw new Error('stream end');
          } else {
            fns.push(cb);
          }
        };
      },
    };
  };
}

function makeBiDirectionalStreamClientEndpoint(client, methodName) {
  return function* biDirectionalStreamClientEndpoint() {
    const responses = [];
    const fns = [];
    let end = false;
    const call = client[methodName]();
    call.on('data', (response) => {
      if (fns.length) {
        fns.shift()(null, response);
      } else {
        responses.push(response);
      }
    });
    call.on('end', () => {
      end = true;
      while (fns.length) {
        fns.shift()(new Error('stream end'), null);
      }
    });
    return {
      *write(request, context) {
        // TODO context to options
        call.write(request);
      },
      *read() {
        // TODO has options?
        return yield function r(cb) {
          if (responses.length) {
            cb(null, responses.shift());
          } else if (end) {
            throw new Error('stream end');
          } else {
            fns.push(cb);
          }
        };
      },
      *end() {
        call.end();
      },
    };
  };
}

/**
 * wrapClientEndpoint wraps the method of conn into an endpoint.
 *
 * @param  {Object} conn   A gRPC Client.
 * @param  {string} method The endpoint method name of the service.
 * @param  {object} stream Settings for request,response or bi directional stream.
 * @return {object|generator}        Returns a generator for normal RPC.
 * Returns an object for streaming RPC.
 */
function wrapClientEndpoint(client, methodName, stream) {
  if (_.isNil(client)) {
    throw new Error('missing argument client');
  }
  if (_.isNil(methodName)) {
    throw new Error('missing argument methodName');
  }
  if (!client[methodName]) {
    throw new Error(util.format('conn has no method %s', methodName));
  }
  if (stream.requestStream && stream.responseStream) {
    return makeBiDirectionalStreamClientEndpoint(client, methodName);
  }
  if (stream.requestStream) {
    return makeRequestStreamClientEndpoint(client, methodName);
  }
  if (stream.responseStream) {
    return makeResponseStreamClientEndpoint(client, methodName);
  }
  return makeNormalClientEndpoint(client, methodName);
}

function makeNormalServerEndpoint(endpoint, logger) {
  return function normalServerEndpoint(call, callback) {
    const req = call.request;
    if (!endpoint) {
      callback({
        code: grpc.status.NOT_IMPLEMENTED
      });
    }
    co(function* callEndpoint() {
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

function makeResponseStreamServerEndpoint(endpoint, logger) {
  return function responseStreamServerEndpoint(call) {
    co(endpoint({
      request: call.request,
      *write(response) {
        call.write(response);
      },
      *end() {
        call.end();
      },
    }));
  };
}

function makeRequestStreamServerEndpoint(endpoint, logger) {
  return function requestStreamServerEndpoint(call, callback) {
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
      *read() {
        return yield function r(cb) {
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

function makeBiDirectionalStreamServerEndpoint(endpoint, logger) {
  return function biDirectionalStreamServerEndpoint(call) {
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
      *write(response) {
        call.write(response);
      },
      *read() {
        return yield function r(cb) {
          if (requests.length) {
            cb(null, requests.shift());
          } else if (end) {
            throw new Error('stream end');
          } else {
            fns.push(cb);
          }
        };
      },
      *end() {
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
function wrapServerEndpoint(endpoint, logger, stream) {
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

function buildProtobuf(files) {
  // build protobuf
  const builder = ProtoBuf.newBuilder({
    convertFieldsToCamelCase: true,
  });
  _.forEach(files, (fileName, key) => {
    const ok = builder.files[fileName];
    if (ok) {
      return;
    }
    try {
      const file = fs.readFileSync(fileName, 'utf8');
      ProtoBuf.loadProto(file, builder, fileName);
    } catch (e) {
      throw e;
    }
  });
  return builder;
}

class Server {
  /**
   * Server is a gRPC transport provider for serving.
   *
   * @param {Object} config Configuration object.
   * Requires properties:addr,package,proto,service
   * Optional properties: credentials.ssl.certs
   */
  constructor(config, logger) {
    if (_.isNil(logger)) {
      throw new Error('gRPC server transport provider requires a logger');
    }
    if (!_.has(config, 'addr')) {
      throw new Error('server is missing addr config field');
    }
    if (!_.has(config, 'services')) {
      throw new Error('server is missing services config field');
    }
    this.$config = config;
    this.$logger = logger;

    // gRPC logger
    setGRPCLogger(logger);

    this.$server = new grpc.Server();

    // build protobuf
    const protoRoot = config.protoRoot || path.join(process.cwd(), 'protos');
    const files = glob.sync(protoRoot + '/**/*.proto', { realpath: true });
    this.$logger.verbose(util.format('gRPC loading protobuf files from root %s', protoRoot), files);
    this.$builder = buildProtobuf(files);
    this.$proto = grpc.loadObject(this.$builder.ns);

    const that = this;
    this.$service = {};
    _.forEach(this.$config.services, (protobufServiceName, serviceName) => {
      const serviceDef = _.get(that.$proto, protobufServiceName);
      if (_.isNil(serviceDef)) {
        throw new Error(util.format('Could not find %s protobuf service', protobufServiceName));
      }
      that.$service[serviceName] = serviceDef.service;
      that.$logger.verbose('gRPC service loaded', serviceName);
    });
    this.name = NAME;
  }

  /**
   * bind maps the service to gRPC methods and binds the address.
   *
   * @param  {string} name Service name.
   * @param  {Object} service Business logic
   */
  *bind(name, service) {
    if (_.isNil(name)) {
      throw new Error('missing argument name');
    }
    if (!_.isString(name)) {
      throw new Error('argument name is not of type string');
    }
    if (_.isNil(service)) {
      throw new Error('missing argument service');
    }
    const protoService = this.$service[name];
    if (_.isNil(protoService)) {
      throw new Error(`service ${name} does not exist in transport ${this.name}`);
    }
    // wrap all service methods
    const binding = {};
    const funcs = _.functionsIn(service);
    if (funcs.length === 0) {
      throw new Error('service object does not have functions');
    }
    for (let i = 0; i < funcs.length; i++) {
      const methodName = funcs[i];
      const methods = protoService.children;
      const methodDef = _.find(methods, (m) => {
        return m.name.toLowerCase() === methodName.toLowerCase();
      });
      const stream = {
        requestStream: false,
        responseStream: false,
      };
      if (methodDef) {
        stream.requestStream = methodDef.requestStream;
        stream.responseStream = methodDef.responseStream;
      }
      binding[methodName] = wrapServerEndpoint(service[methodName], this.$logger, stream);
    }
    this.$server.addProtoService(protoService, binding);
  }

  /**
   * start launches the gRPC server and provides the service endpoints.
   */
  *start() {
    if (!this.isBound) {
      let credentials = grpc.ServerCredentials.createInsecure();
      if (_.has(this.$config, 'credentials.ssl')) {
        credentials = grpc.credentials.createSsl(
          this.$config.credentials.ssl.certs);
      }
      this.$server.bind(this.$config.addr, credentials);
      this.isBound = true;
    }
    this.$server.start();
  }

  /**
   * end stops the gRPC server and no longer provides the service endpoints.
   */
  *end() {
    /* eslint consistent-this: ["error", "that"]*/
    const that = this;

    const shutdown = function shutdownWrapper() {
      return function tryShutdown(cb) {
        that.$server.tryShutdown(cb);
      };
    };
    yield shutdown();
  }
}

/**
 * Client is a gRPC transport provider for calling endpoints.
 *
 * @param {Object} config Configuration object.
 * Requires properties: package,proto,service
 * Optional properties: timeout
 */
class Client {
  constructor(config, logger) {
    this.name = NAME;
    this.$config = config;
    this.$logger = logger;

    // gRPC logger
    setGRPCLogger(logger);

    // check config
    if (!_.has(config, 'service')) {
      throw new Error('client is missing service config field');
    }

    // build protobuf
    const protoRoot = config.protoRoot || path.join(process.cwd(), 'protos');
    const files = glob.sync(protoRoot + '/**/*.proto', { realpath: true });
    this.$logger.verbose(util.format('gRPC loading protobuf files from root %s', protoRoot), files);
    this.$builder = buildProtobuf(files);
    this.$proto = grpc.loadObject(this.$builder.ns);
    this.$service = _.get(this.$proto, this.$config.service);
    if (_.isNil(this.$service)) {
      throw new Error(util.format('Could not find %s protobuf service', this.$config.service));
    }
    this.$logger.verbose('gRPC service loaded', this.$config.service);
    this.name = NAME;
  }

  *makeEndpoint(method, instance) {
    const u = url.parse(instance, true, true);
    if (u.protocol !== 'grpc:') {
      throw new Error('not a grpc instance URL');
    }
    const host = u.host;
    let credentials = grpc.credentials.createInsecure();
    if (this.$config.credentials) {
      if (this.$config.credentials.ssl) {
        const certs = this.$config.credentials.ssl.certs;
        const key = this.$config.credentials.ssl.key;
        const chain = this.$config.credentials.ssl.chain;
        credentials = grpc.credentials.createSsl(certs, key, chain);
      }
    }
    const conn = new this.$service(host, credentials);
    if (this.$config.timeout) {
      const deadline = Date.now() + this.$config.timeout;
      const wait = function waitWrapper() {
        return function waitForClientReady(callback) {
          grpc.waitForClientReady(conn, deadline, (err) => {
            if (err) {
              const chan = grpc.getClientChannel(conn);
              chan.close();
            }
            callback(err);
          });
        };
      };
      yield wait();
    }
    const methods = this.$service.service.children;
    const methodDef = _.find(methods, (m) => {
      return m.name.toLowerCase() === method.toLowerCase();
    });
    const stream = {
      requestStream: false,
      responseStream: false,
    };
    if (methodDef) {
      stream.requestStream = methodDef.requestStream;
      stream.responseStream = methodDef.responseStream;
    }
    const e = wrapClientEndpoint(conn, method, stream);
    if (!this.endpoint) {
      this.endpoint = {};
    }
    if (!this.endpoint[method]) {
      this.endpoint[method] = {
        instances: [],
      };
    }
    this.endpoint[method].instances.push({
      instance,
      conn,
      endpoint: e,
    });
    return e;
  }

  *end() {
    if (!this.endpoint) {
      return;
    }
    const endpoints = Object.keys(this.endpoint);
    for (let i = 0; i < endpoints.length; i++) {
      const endpoint = this.endpoint[endpoints[i]];
      for (let j = 0; j < endpoint.instances; j++) {
        const conn = endpoint.instances[j].conn;
        const chan = grpc.getClientChannel(conn);
        chan.close();
      }
    }
  }
}

module.exports.Name = NAME;
module.exports.Client = Client;
module.exports.Server = Server;
module.exports.ServerReflection = require('./reflection.js').ServerReflection;

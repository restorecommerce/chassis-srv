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

/**
 * Name of the transport
 *
 * @const
 */
const NAME = 'grpc';

/**
 * call wraps the method of conn into an endpoint.
 *
 * @param  {Object} conn   A gRPC Client.
 * @param  {string} method The endpoint method name of the service.
 * @return {generator}        The endpoint.
 */
function call(conn, method) {
  if (!conn[method]) {
    throw new Error(util.format('conn has no method %s', method));
  }
  return function* wrapCall(request, context) {
    const options = {};
    if (_.has(context, 'timeout')) {
      options.deadline = Date.now() + context.timeout;
    }

    function callEndpointWrapper() {
      return function callEndpoint(callback) {
        try {
          conn[method](request, options, callback);
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
      let resp;
      switch (err.code) {
        case grpc.status.OK:
        case grpc.status.CANCELLED:
          resp = {
            error: new Error('operation was cancelled'),
          };
          break;
        case grpc.status.INVALID_ARGUMENT:
          resp = {
            error: new Error('invalid argument'),
          };
          break;
        case grpc.status.NOT_FOUND:
          resp = {
            error: new Error('not found'),
          };
          break;
        case grpc.status.ALREADY_EXISTS:
          resp = {
            error: new Error('already exists'),
          };
          break;
        case grpc.status.PERMISSION_DENIED:
          resp = {
            error: new Error('permission denied'),
          };
          break;
        case grpc.status.UNAUTHENTICATED:
          resp = {
            error: new Error('unauthenticated'),
          };
          break;
        case grpc.status.FAILED_PRECONDITION:
          resp = {
            error: new Error('failed precondition'),
          };
          break;
        case grpc.status.ABORTED:
          resp = {
            error: new Error('aborted'),
          };
          break;
        case grpc.status.OUT_OF_RANGE:
          resp = {
            error: new Error('out of range'),
          };
          break;
        case grpc.status.UNIMPLEMENTED:
          resp = {
            error: new Error('unimplemented'),
          };
          break;
        case grpc.status.RESOURCE_EXHAUSTED:
          resp = {
            error: new Error('resource exhausted'),
          };
          break;
        case grpc.status.DEADLINE_EXCEEDED:
          resp = {
            error: new Error('deadline exceeded'),
          };
          break;
        case grpc.status.UNKNOWN:
          resp = {
            error: new Error('unknown'),
          };
          break;
        case grpc.status.INTERNAL:
          resp = {
            error: new Error('internal'),
          };
          break;
        case grpc.status.UNAVAILABLE:
          resp = {
            error: new Error('unavailable'),
          };
          break;
        case grpc.status.DATA_LOSS:
          resp = {
            error: new Error('data loss'),
          };
          break;
        default:
          throw err;
      }
      if (resp.error.message !== err.message) {
        resp.error.details = err.message;
      }
      return resp;
    }
  };
}

/**
 * serve wraps the endpoint to provide a gRPC service method.
 *
 * @param  {generator} endpoint Endpoint which will be served as a gRPC service method.
 * @return {function}          The function can be used as a gRPC service method.
 */
function serve(endpoint, logger) {
  return function wrap(body, callback) {
    const req = body.request;
    if (!endpoint) {
      callback({
        code: grpc.status.NOT_IMPLEMENTED
      });
    }
    co(function* callEndpoint() {
      const result = yield endpoint(req);
      return {
        error: null,
        result,
      };
    }).catch((err) => {
      let code;
      // match message to grpc code
      // only service errors
      switch (err.message) {
        case 'operation was cancelled':
          code = grpc.status.CANCELLED;
          break;
        case 'invalid argument':
          code = grpc.status.INVALID_ARGUMENT;
          break;
        case 'not found':
          code = grpc.status.NOT_FOUND;
          break;
        case 'already exists':
          code = grpc.status.ALREADY_EXISTS;
          break;
        case 'permission denied':
          code = grpc.status.PERMISSION_DENIED;
          break;
        case 'unauthenticated':
          code = grpc.status.UNAUTHENTICATED;
          break;
        case 'failed precondition':
          code = grpc.status.FAILED_PRECONDITION;
          break;
        case 'aborted':
          code = grpc.status.ABORTED;
          break;
        case 'out of range':
          code = grpc.status.OUT_OF_RANGE;
          break;
        case 'unimplemented':
          code = grpc.status.UNIMPLEMENTED;
          break;
        default:
          code = grpc.status.INTERNAL;
          break;
      }
      let details = err.message;
      if (err.details) {
        details = err.details;
      }
      return {
        error: {
          code,
          details,
        },
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

function buildProtobuf(files, root, logger) {
  // build protobuf
  const builder = ProtoBuf.newBuilder({
    convertFieldsToCamelCase: true,
  });
  _.forEach(files, (fileName, key) => {
    const ok = builder.files[fileName];
    if (ok) {
      return;
    }
    const file = fs.readFileSync(fileName, 'utf8');
    ProtoBuf.loadProto(file, builder, {
      file: fileName,
      root,
    });
  });
  return builder;
}

/**
 * Server is a gRPC transport provider for serving.
 *
 * @param {Object} config Configuration object.
 * Requires properties:addr,package,proto,service
 * Optional properties: credentials.ssl.certs
 */
function Server(config, logger) {
  if (_.isNil(logger)) {
    throw new Error('gRPC server transport provider requires a logger');
  }
  if (!_.has(config, 'addr')) {
    throw new Error('server is missing addr config field');
  }
  if (!_.has(config, 'service')) {
    throw new Error('server is missing service config field');
  }
  this.$config = config;
  this.$logger = logger;
  this.$server = new grpc.Server();

  // build protobuf
  const protoRoot = config.protoRoot || path.join(process.cwd(), 'protos');
  const files = glob.sync(protoRoot + '/**/*.proto');
  this.$logger.verbose(util.format('gRPC loading protobuf files from root %s', protoRoot), files);
  const builder = buildProtobuf(files, protoRoot, logger);
  this.$proto = grpc.loadObject(builder.ns);
  this.$service = _.get(this.$proto, this.$config.service).service;
  this.$logger.verbose('gRPC service loaded', this.$config.service);
  this.name = NAME;
}

/**
 * bind maps the service to gRPC methods and binds the address.
 *
 * @param  {Object} service Business logic
 */
Server.prototype.bind = function* bind(service) {
  // wrap all service methods
  const binding = {};
  const funcs = _.functions(service);
  if (funcs.length === 0) {
    throw new Error('service object does not have functions');
  }
  for (let i = 0; i < funcs.length; i++) {
    const name = funcs[i];
    binding[name] = serve(service[name], this.$logger);
  }
  this.$server.addProtoService(this.$service, binding);
  let credentials = grpc.ServerCredentials.createInsecure();
  if (_.has(this.$config, 'credentials.ssl')) {
    credentials = grpc.credentials.createSsl(
      this.$config.credentials.ssl.certs);
  }
  this.$server.bind(this.$config.addr, credentials);
};

/**
 * start launches the gRPC server and provides the service endpoints.
 */
Server.prototype.start = function* start() {
  this.$server.start();
};

/**
 * end stops the gRPC server and no longer provides the service endpoints.
 */
Server.prototype.end = function* end() {
  /* eslint consistent-this: ["error", "that"]*/
  const that = this;

  const shutdown = function shutdownWrapper() {
    return function tryShutdown(cb) {
      that.$server.tryShutdown(cb);
    };
  };
  yield shutdown();
};

/**
 * Client is a gRPC transport provider for calling endpoints.
 *
 * @param {Object} config Configuration object.
 * Requires properties: package,proto,service
 * Optional properties: timeout
 */
function Client(config, logger) {
  this.name = NAME;
  this.$config = config;
  this.$logger = logger;

  // build protobuf
  const protoRoot = config.protoRoot || path.join(process.cwd(), 'protos');
  const files = glob.sync(protoRoot + '/**/*.proto');
  this.$logger.verbose(util.format('gRPC loading protobuf files from root %s', protoRoot), files);
  const builder = buildProtobuf(files, protoRoot, logger);
  this.$proto = grpc.loadObject(builder.ns);
  this.$service = _.get(this.$proto, this.$config.service);
  this.$logger.verbose('gRPC service loaded', this.$config.service);
  this.name = NAME;
}

Client.prototype.makeEndpoint = function* makeEndpoint(method, instance) {
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
  const e = call(conn, method);

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
};

Client.prototype.end = function* end() {
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
};

module.exports.Name = NAME;
module.exports.Client = Client;
module.exports.Server = Server;
module.exports.serve = serve;
module.exports.call = call;

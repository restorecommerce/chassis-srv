'use strict';

var util = require('util');
var path = require('path');
var url = require('url');
var ProtoBuf = require('protobufjs');
var grpc = require('grpc');
var co = require('co');
var fs = require('fs');
var glob = require('glob');
var _ = require('lodash');

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
  return function*(request, context) {
    let options = {};
    if (_.has(context, 'timeout')) {
      options.deadline = Date.now() + context.timeout;
    }

    function call() {
      return function(callback) {
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
      let result = yield call();
      let response = {
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
  return function(call, callback) {
    let req = call.request;
    if (!endpoint) {
      callback({
        code: grpc.status.NOT_IMPLEMENTED
      });
    }
    co(function*() {
      let result = yield endpoint(req);
      return {
        error: null,
        result: result
      };
    }).catch(function(err) {
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
      }
      if (!code) {
        code = grpc.status.INTERNAL;
      }
      let details = err.message;
      if (err.details) {
        details = err.details;
      }
      return {
        error: {
          code: code,
          details: details,
        },
        result: null
      };
    }).then(function(resp) {
      callback(resp.error, resp.result);
    }).catch(function(err) {
      logger.log('ERROR', 'grpc transport error', err, err.stack);
    });
  };
}

function buildProtobuf(files, root, logger) {
  // build protobuf
  let builder = ProtoBuf.newBuilder({
    convertFieldsToCamelCase: true,
  });
  _.forEach(files, function(fileName, key) {
    let ok = builder.files[fileName];
    if (ok) {
      return;
    }
    logger.log('VERBOSE',
      util.format('event provider Kafka: loading protobuf file %s with root %s',
        fileName, root));
    let file = fs.readFileSync(fileName, 'utf8');
    ProtoBuf.loadProto(file, builder, {
      file: fileName,
      root: root
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
  let self = this;
  if (!logger) {
    logger = {
      log: console.log,
    };
  }
  // check config
  if (!_.has(config, 'addr')) {
    throw new Error('server is missing addr config field');
  }
  if (!_.has(config, 'service')) {
    throw new Error('server is missing service config field');
  }
  this._config = config;
  this._logger = logger;
  this._server = new grpc.Server();

  // build protobuf
  let protoRoot = config.protoRoot || path.join(process.cwd(), 'protos');
  let files = glob.sync(protoRoot + '/**/*.proto');
  let builder = buildProtobuf(files, protoRoot, logger);
  this._proto = grpc.loadObject(builder.ns);
  this._service = _.get(this._proto, this._config.service).service;
  this.name = NAME;
}

/**
 * bind maps the service to gRPC methods and binds the address.
 *
 * @param  {Object} service Business logic
 */
Server.prototype.bind = function*(service) {
  // wrap all service methods
  let binding = {};
  let funcs = _.functions(service);
  if (funcs.length === 0) {
    throw new Error('service object does not have functions');
  }
  for (let i = 0; i < funcs.length; i++) {
    let name = funcs[i];
    binding[name] = serve(service[name], this._logger);
  }
  this._server.addProtoService(this._service, binding);
  let credentials = grpc.ServerCredentials.createInsecure();
  if (_.has(this._config, 'credentials.ssl')) {
    credentials = grpc.credentials.createSsl(
      this._config.credentials.ssl.certs);
  }
  this._server.bind(this._config.addr, credentials);
};

/**
 * start launches the gRPC server and provides the service endpoints.
 */
Server.prototype.start = function*() {
  this._server.start();
};

/**
 * end stops the gRPC server and no longer provides the service endpoints.
 */
Server.prototype.end = function*() {
  var self = this;
  var shutdown = function() {
    return function(cb) {
      self._server.tryShutdown(cb);
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
  this._config = config;

  // build protobuf
  let protoRoot = config.protoRoot || path.join(process.cwd(), 'protos');
  let files = glob.sync(protoRoot + '/**/*.proto');
  let builder = buildProtobuf(files, protoRoot, logger);
  this._proto = grpc.loadObject(builder.ns);
  this._service = _.get(this._proto, this._config.service);
  this.name = NAME;
}

Client.prototype.makeEndpoint = function*(method, instance) {
  let u = url.parse(instance, true, true);
  if (u.protocol !== 'grpc:') {
    throw new Error('not a grpc instance URL');
  }
  let host = u.host;
  let credentials = grpc.credentials.createInsecure();
  if (this._config.credentials) {
    if (this._config.credentials.ssl) {
      let certs = this._config.credentials.ssl.certs;
      let key = this._config.credentials.ssl.key;
      let chain = this._config.credentials.ssl.chain;
      credentials = grpc.credentials.createSsl(certs, key, chain);
    }
  }
  let self = this;
  let conn = new this._service(host, credentials);
  if (this._config.timeout) {
    let deadline = Date.now() + this._config.timeout;
    var wait = function() {
      return function(callback) {
        grpc.waitForClientReady(conn, deadline, function(err) {
          if (err) {
            let chan = grpc.getClientChannel(conn);
            chan.close();
          }
          callback(err);
        });
      };
    };
    yield wait();
  }
  let e = call(conn, method);

  if (!this.endpoint) {
    this.endpoint = {};
  }
  if (!this.endpoint[method]) {
    this.endpoint[method] = {
      instances: [],
    };
  }
  this.endpoint[method].instances.push({
    instance: instance,
    conn: conn,
    endpoint: e,
  });
  return e;
};

Client.prototype.end = function*() {
  if (!this.endpoint) {
    return;
  }
  let endpoints = Object.keys(this.endpoint);
  for (let i = 0; i < endpoints.length; i++) {
    let endpoint = this.endpoint[endpoints[i]];
    for (let j = 0; j < endpoint.instances; j++) {
      let conn = endpoint.instances[j].conn;
      let chan = grpc.getClientChannel(conn);
      chan.close();
    }
  }
};

module.exports.Name = NAME;
module.exports.Client = Client;
module.exports.Server = Server;
module.exports.serve = serve;
module.exports.call = call;

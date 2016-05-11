'use strict';

let util = require('util');
let url = require('url');
let grpc = require('grpc');
let wait = require('wait.for-es6');
let co = require('co');

/**
 * Name of the transport
 * @const
 */
const NAME = 'grpc';

/**
 * call wraps the method of conn into an endpoint.
 * @param  {Object} conn   A gRPC Client.
 * @param  {string} method The endpoint method name of the service.
 * @return {function*}        The endpoint.
 */
function call(conn, method) {
  if (!conn[method]) {
    throw new Error(util.format('conn has no method %s', method));
  }
  return function*(request) {
    let options = {
      deadline: Date.now() + 1000
    };

    function call(cb) {
      conn[method](request, cb, null, options);
    }
    let result;
    try {
      result = yield wait.for(call);
    } catch (err) {
      switch (err.code) {
        case grpc.status.OK:
        case grpc.status.CANCELLED:
        case grpc.status.INVALID_ARGUMENT:
        case grpc.status.NOT_FOUND:
        case grpc.status.ALREADY_EXISTS:
        case grpc.status.PERMISSION_DENIED:
        case grpc.status.UNAUTHENTICATED:
        case grpc.status.FAILED_PRECONDITION:
        case grpc.status.ABORTED:
        case grpc.status.UNIMPLEMENTED:
          // Not a transport/endpoint error
          return yield {
            error: err,
            data: result,
          };
        case grpc.status.RESOURCE_EXHAUSTED:
        case grpc.status.DEADLINE_EXCEEDED:
        case grpc.status.UNKNOWN:
        case grpc.status.INTERNAL:
        case grpc.status.UNAVAILABLE:
        case grpc.status.DATA_LOSS:
          // transport or endpoint error
          throw err;
          break;
        default:
          // unknown status code, treat as transport or endpoint error
          throw err;
          break;
      }
    }
    return yield {
      error: null,
      data: result,
    };
  }
}

/**
 * serve wraps the endpoint to provide a gRPC service method.
 * @param  {function*} endpoint Endpoint which will be served as a gRPC service method.
 * @return {[function]}          The function can be used as a gRPC service method.
 */
function serve(endpoint) {
  return function(call, callback) {
    let req = call.request;
    if (!endpoint) {
      callback({
        code: grpc.status.NOT_IMPLEMENTED
      });
    }
    co(function*() {
      let resp = yield endpoint(req);
      if (!resp) {
        callback({
          code: grpc.status.NOT_FOUND,
          details: 'not found'
        });
        return;
      }
      callback(null, resp);
    }).catch(function(err) {
      let code = grpc.status.INTERNAL;
      callback({
        code: code,
        details: err.message
      });
    });
  };
}

function Server(config) {
  this._server = new grpc.Server();
  this._config = config;
  this._proto = grpc.load(process.cwd() + config.proto);
  this._service = this._proto[this._config.package][this._config.service].service;
  this.name = NAME;
}

Server.prototype.bind = function*(service) {
  // wrap all service methods
  let binding = {};
  Object.getOwnPropertyNames(service).forEach(function(name) {
    binding[name] = serve(service[name]);
  });

  this._server.addProtoService(this._service, binding);
  // TODO Allow credentials via config
  let credentials = grpc.ServerCredentials.createInsecure();
  this._server.bind(this._config.addr, credentials);
}

Server.prototype.start = function*() {
  this._server.start();
}

Server.prototype.end = function*() {
  this._server.tryShutdown();
}

function Client(config) {
  this.name = NAME;
  let proto = grpc.load(process.cwd() + config.proto);
  this._service = proto[config.package][config.service];
}

Client.prototype.makeEndpoint = function*(method, instance) {
  let u = url.parse(instance, true, true);
  if (u.protocol !== 'grpc:') {
    throw new Error('not a grpc instance URL');
  }
  let host = u.host;
  let conn = new this._service(host, grpc.credentials.createInsecure());
  return call(conn, method);
}

module.exports.Name = NAME;
module.exports.Client = Client;
module.exports.Server = Server;
module.exports.serve = serve;
module.exports.call = call;

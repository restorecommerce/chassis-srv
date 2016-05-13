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
      //deadline: Date.now() + 1000
    };

    function call(cb) {
      conn[method](request, options, cb);
    }
    try {
      let result = yield wait.for(call);
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
      //resp.error.details = err.details;
      return resp;
    }
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
      callback(null, resp);
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
      console.log(code, details);
      callback({
        code: code,
        details: details,
      }, null);
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
  this.config = config;
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
  if (this.config.timeout) {
    let deadline = Date.now() + this.config.timeout;
    grpc.waitForClientReady(conn, deadline, function() {
      // TODO Block until deadline is reached of client is ready
      let chan = grpc.getClientChannel(conn);
      chan.close();
    });
  }
  return call(conn, method);
}

module.exports.Name = NAME;
module.exports.Client = Client;
module.exports.Server = Server;
module.exports.serve = serve;
module.exports.call = call;

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
      switch (err.code) {
        case grpc.status.OK:
        case grpc.status.CANCELLED:
          return {
            error: new Error('operation was cancelled'),
          };
        case grpc.status.INVALID_ARGUMENT:
          return {
            error: new Error('invalid argument'),
          };
        case grpc.status.NOT_FOUND:
          return {
            error: new Error('not found'),
          };
        case grpc.status.ALREADY_EXISTS:
          return {
            error: new Error('already exists'),
          };
        case grpc.status.PERMISSION_DENIED:
          return {
            error: new Error('permission denied'),
          };
        case grpc.status.UNAUTHENTICATED:
          return {
            error: new Error('unauthenticated'),
          };
        case grpc.status.FAILED_PRECONDITION:
          return {
            error: new Error('failed precondition'),
          };
        case grpc.status.ABORTED:
          return {
            error: new Error('aborted'),
          };
        case grpc.status.OUT_OF_RANGE:
        return {
          error: new Error('out of range'),
        };
        case grpc.status.UNIMPLEMENTED:
          return {
            error: new Error('unimplemented'),
          };
        case grpc.status.RESOURCE_EXHAUSTED:
          return {
            error: new Error('resource exhausted'),
          };
        case grpc.status.DEADLINE_EXCEEDED:
          return {
            error: new Error('deadline exceeded'),
          };
        case grpc.status.UNKNOWN:
          return {
            error: new Error('unknown'),
          };
        case grpc.status.INTERNAL:
          return {
            error: new Error('internal'),
          };
        case grpc.status.UNAVAILABLE:
          return {
            error: new Error('unavailable'),
          };
        case grpc.status.DATA_LOSS:
          return {
            error: new Error('data loss'),
          };
        default:
          throw err;
      }
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

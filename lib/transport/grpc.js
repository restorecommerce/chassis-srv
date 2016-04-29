'use strict';

let util = require('util');
let grpc = require('grpc');

function Client(conn, method) {
  if (!conn[method]) {
    throw new Error(util.format('conn has no method %s', method));
  }
  this.endpoint = function(request, callback) {
    let options = {
      deadline: Date.now() + 1000
    };
    conn[method](request, function(err, data) {
      if (!err) {
        callback(null, {
          error: null,
          data: data
        });
        return;
      }
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
          callback(null, {
            error: err,
            data: data
          });
          break;
        case grpc.status.RESOURCE_EXHAUSTED:
        case grpc.status.DEADLINE_EXCEEDED:
        case grpc.status.UNKNOWN:
        case grpc.status.INTERNAL:
        case grpc.status.UNAVAILABLE:
        case grpc.status.DATA_LOSS:
          // transport or endpoint error
          callback(err, {
            error: null,
            data: data
          });
          break;
        default:
          // unknown status code, treat as transport or endpoint error
          callback(err, {
            error: null,
            data: data
          });
          break;
      }
    }, null, options);
  }
}

function Serve(endpoint) {
  return function(call, callback) {
    let req = call.request;
    if (!endpoint) {
      callback({
        code: grpc.status.NOT_IMPLEMENTED
      });
    }
    let args = [];
    Object.keys(req).forEach(function(key) {
      args.push(req[key]);
    });
    let resp, error;
    try {
      resp = endpoint.apply(null, args);
    } catch (e) {
      error = e;
    }
    if (error) {
      let code = grpc.status.INTERNAL;
      callback({
        code: code,
        details: error.message
      });
      return;
    }
    if (!resp) {
      callback({
        code: grpc.status.NOT_FOUND,
        details: 'not found'
      });
      return;
    }
    callback(null, resp);
  };
}

module.exports.Serve = Serve;
module.exports.Client = Client;

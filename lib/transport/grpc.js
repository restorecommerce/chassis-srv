'use strict';

let util = require('util');
let grpc = require('grpc');
let wait = require('wait.for-es6');
let co = require('co');

function Client(conn, method) {
  if (!conn[method]) {
    throw new Error(util.format('conn has no method %s', method));
  }
  this.endpoint = function*(request) {
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
          break;
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
    co(function*(){
      let resp = yield endpoint.apply(null, args);
      if (!resp) {
        callback({
          code: grpc.status.NOT_FOUND,
          details: 'not found'
        });
        return;
      }
      callback(null, resp);
    }).catch(function(err){
      let code = grpc.status.INTERNAL;
      callback({
        code: code,
        details: err.message
      });
    });
  };
}

module.exports.Serve = Serve;
module.exports.Client = Client;

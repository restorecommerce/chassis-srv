'use strict';

let util = require('util');
let grpc = require('grpc');

function Client(conn, method) {
  if (!conn[method]) {
    throw new Error(util.format('conn has no method %s', method));
  }
  this.endpoint = function*(request){
    function call(req) {
      return function(cb) {
        conn[method](req, function(err, data){
          if (!err) {
            cb(null, {error:null, data:data});
            return;
          }
          switch(err.code) {
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
            cb(null, {error:err, data:data});
            break;
          case grpc.status.RESOURCE_EXHAUSTED:
          case grpc.status.DEADLINE_EXCEEDED:
          case grpc.status.UNKNOWN:
          case grpc.status.INTERNAL:
          case grpc.status.UNAVAILABLE:
          case grpc.status.DATA_LOSS:
            // transport or endpoint error
            cb(err, data);
            break;
          default:
            // unknown status code, treat as transport or endpoint error
            cb(err, data);
            break;
          }
        });
      }
    }
    return yield call(request);
  }
}

module.exports = Client;

'use strict';

// gRPC
let grpc = require('grpc');
const PROTO_PATH = __dirname + '../protos/user.proto';
let proto = grpc.load(PROTO_PATH);

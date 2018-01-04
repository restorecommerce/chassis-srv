'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/*  eslint-disable require-yield */
const path = require("path");
const ProtoBuf = require("protobufjs");
const grpc = require("grpc");
const co = require("co");
const _ = require("lodash");
const errors = require('../../../errors');
/**
 * Name of the transport
 *
 * @const
 */
const NAME = 'grpc';
// function setGRPCLogger(logger: any): any {
//   // gRPC logger
//   const grpcLogger = {
//     error: logger.debug,
//   };
//   grpc.setLogger(grpcLogger);
// }
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
function makeNormalServerEndpoint(endpoint, logger) {
    return function normalServerEndpoint(call, callback) {
        const req = call.request;
        if (!endpoint) {
            callback({
                code: grpc.status.UNIMPLEMENTED
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
            }
            else {
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
                    }
                    else if (end) {
                        throw new Error('stream end');
                    }
                    else {
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
            }
            else {
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
                    }
                    else if (end) {
                        throw new Error('stream end');
                    }
                    else {
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
function buildProtobuf(files, protoroot, logger) {
    // build protobuf
    let root = new ProtoBuf.Root();
    _.forEach(files, (fileName, key) => {
        root.resolvePath = function (origin, target) {
            // origin is the path of the importing file
            // target is the imported path
            // determine absolute path and return it ...
            return protoroot + fileName;
        };
        root.loadSync(protoroot + fileName);
    });
    return root;
}
/**
 * Server transport provider.
 * @class
 */
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
        this.config = config;
        this.logger = logger;
        console['error'] = logger.debug;
        // gRPC logger
        grpc.setLogger(console);
        this.server = new grpc.Server();
        // build protobuf
        const protoRoot = config.protoRoot || path.join(process.cwd(), 'protos');
        if (_.isNil(protoRoot) || _.size(protoRoot) === 0) {
            throw new Error('config value protoRoot is not set');
        }
        const protos = config.protos;
        if (_.isNil(protos) || _.size(protos) === 0) {
            throw new Error('config value protos is not set');
        }
        this.logger.verbose(`gRPC Server loading protobuf files from root ${protoRoot}`, protos);
        const proto = [];
        for (let i = 0; i < protos.length; i++) {
            const filePath = { root: protoRoot, file: protos[i] };
            this.proto = grpc.load(filePath);
            proto[i] = this.proto;
        }
        let k = 0;
        this.service = _.transform(this.config.services, (service, protobufServiceName, serviceName) => {
            const serviceDef = _.get(proto[k], protobufServiceName);
            if (_.isNil(serviceDef)) {
                throw new Error(`Could not find ${protobufServiceName} protobuf service`);
            }
            _.set(service, serviceName, serviceDef.service);
            k++;
            logger.verbose('gRPC service loaded', serviceName);
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
        const protoService = this.service[name];
        if (_.isNil(protoService)) {
            throw new Error(`service ${name} does not exist in transport ${this.name}`);
        }
        // wrap all service methods
        const binding = {};
        const funcs = _.functionsIn(service);
        if (funcs.length === 0) {
            throw new Error('service object does not have functions');
        }
        for (let i = 0; i < funcs.length; i += 1) {
            const methodName = funcs[i];
            const methods = protoService;
            const methodDef = _.find(methods, (m) => {
                return m.originalName.toLowerCase() === methodName.toLowerCase();
            });
            const stream = {
                requestStream: false,
                responseStream: false,
            };
            if (methodDef) {
                stream.requestStream = methodDef.requestStream;
                stream.responseStream = methodDef.responseStream;
            }
            binding[methodName] = wrapServerEndpoint(service[methodName], this.logger, stream);
        }
        this.server.addService(protoService, binding);
    }
    /**
     * start launches the gRPC server and provides the service endpoints.
     */
    *start() {
        if (!this.isBound) {
            let credentials = grpc.ServerCredentials.createInsecure();
            if (_.has(this.config, 'credentials.ssl')) {
                credentials = grpc.credentials.createSsl(this.config.credentials.ssl.certs);
            }
            this.server.bind(this.config.addr, credentials);
            this.isBound = true;
        }
        this.server.start();
    }
    /**
     * end stops the gRPC server and no longer provides the service endpoints.
     */
    *end() {
        const server = this.server;
        const shutdown = function shutdownWrapper() {
            return function tryShutdown(cb) {
                server.tryShutdown(cb);
            };
        };
        yield shutdown();
    }
}
exports.Server = Server;
module.exports.Name = NAME;
// module.exports.Client = Client;
// module.exports.Server = Server;
const reflection_1 = require("./reflection");
exports.ServerReflection = reflection_1.ServerReflection;

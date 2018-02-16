import * as mocha from 'mocha';
const coMocha = require('co-mocha');

coMocha(mocha);

const should = require('should');
const _ = require('lodash');
const co = require('co');
const isGeneratorFn = require('is-generator').fn;
const logger = require('./logger_test.js');
import * as sleep from 'sleep';
import * as chassis from '../lib';

const config = chassis.config;
const sconfig = require('@restorecommerce/service-config');
import * as srvClient from '@restorecommerce/grpc-client';
const Client = srvClient.Client;
const Server = chassis.Server;
const grpcClient = srvClient.grpcClient;
const grpc = chassis.grpc;
const errors = chassis.errors;

/* global describe context it before after*/
const service = {
    test(call, context) {
        const request = call.request;
        request.value.should.be.equal('hello');
        return {
            result: 'welcome',
        };
    },
    * throw(request, context) {
        throw new Error('forced error');
    },
    * notFound(request, context) {
        throw new errors.NotFound('test not found');
    },
    notImplemented: null,
    * biStream(call, context) {
        let req;
        let stream = true;
        while (stream) {
            try {
                req = yield call.read();
            } catch (e) {
                stream = false;
                if (e.message === 'stream end') {
                    yield call.end();
                    return;
                }
            }
            should.exist(req);
            should.exist(req.value);
            req.value.should.equal('ping');
            yield call.write({ result: 'pong' });
        }
    },
    async requestStream(call, context) {
        let req;
        let stream = true;
        while (stream) {
            try {
                req = await co(call.read());
                should.exist(req);
                should.exist(req.value);
                req.value.should.equal('ping');
            } catch (e) {
                stream = false;
            }
        }
        return { result: 'pong' };
    },
    // TODO: This call i.e. write and end apis refer to the gRPC server methods.
    // since the chasis service is not yet migrated to async/await leaving the
    // response stream for now with generators.
    * responseStream(call, context) {
        const req = call.request;
        should.exist(req);
        should.exist(req.value);
        req.value.should.equal('ping');
        for (let i = 0; i < 3; i += 1) {
            yield (call.write({ result: `${i}` }));
        }
        yield (call.end());
    },
};
let cfg;
describe('microservice.Server', () => {
    let server: chassis.Server;
    describe('constructing the sever', () => {
        it('should throw an error when services config is missing',
            function* throwErrorOnMissingConfig() {
                yield config.load(process.cwd() + '/test', logger);
                cfg = sconfig(process.cwd() + '/test', logger);
                cfg.set('server:services', undefined);
                (() => {
                    server = new Server(cfg.get('server'));
                }).should.throw('missing services configuration');
            });
        it('should throw an error when transports config is missing',
            function* throwErrorOnMissingTransportConfig() {
                yield config.load(process.cwd() + '/test', logger);
                const cfg = yield config.get();
                cfg.set('server:transports', undefined);
                (() => {
                    server = new Server(cfg.get('server'));
                }).should.throw('missing transports configuration');
            });
        it('should throw an error when configuration does not exist', function* throwNoConfig() {
            yield config.load(process.cwd() + '/test', logger);
            const cfg = yield config.get();
            cfg.set('server:services', undefined);
            cfg.set('server:transports', undefined);
            (() => {
                server = new Server(cfg.get('server'));
            }).should.throw('missing server configuration');
        });
        it('should return a server when provided with correct config', function* correctConfig() {
            yield config.load(process.cwd() + '/test', logger);
            const cfg = yield config.get();
            server = new Server(cfg.get('server'));
            should.exist(server);
            should.exist(server.logger);
            should.exist(server.logger.log);
            const levels = [
                'silly',
                'verbose',
                'debug',
                'info',
                'warn',
                'error'
            ];
            _.forEach(levels, (level) => {
                should.exist(server.logger[level]);
            });
            should.exist(server.transport);
            should.exist(server.transport.grpcTest);
            server.transport.grpcTest.should.be.an.instanceof(grpc.Server);
        });
    });
    describe('calling bind', () => {
        it('should wrap a service and create endpoints for each object function',
            function* bindService() {
                const boundServices = 2;
                let currentBoundServices = 0;
                server.on('bound', () => {
                    currentBoundServices += 1;
                });
                co(function* bind() {
                    yield server.bind('test', service);
                    yield server.bind('stream', service);
                });
            });
    });
    describe('calling start', () => {
        it('should expose the created endpoints via transports', function* checkEndpoints() {
            let serving = false;
            server.on('serving', () => {
                serving = !serving;
            });
            yield server.start();
            sleep.sleep(1);
            serving.should.equal(true);

            // const cfg = yield config.get();
            let grpcConfig = cfg.get('client:test:transports:grpc');
            should.exist(grpcConfig);
            should.exist(grpcConfig.service);

            let client: srvClient.grpcClient = new grpcClient(grpcConfig, logger);
            let instance: string;
            let result;
            should.exist(client);

            // 'test' endpoint
            const testCfgPath: String = 'client:test:endpoints:test:publisher:instances:0';
            instance = cfg.get(testCfgPath);
            const testF = client.makeEndpoint('test', instance);
            result = yield testF({
                value: 'hello',
            },
                {
                    test: true,
                });
            should.ifError(result.error);
            should.exist(result.data);
            should.exist(result.data.result);
            result.data.result.should.be.equal('welcome');

            // 'throw' endpoint
            const throwCfgPath = 'client:test:publisher:instances:0';
            instance = cfg.get(throwCfgPath);
            const throwF = client.makeEndpoint('throw', instance);
            result = yield throwF({
                value: 'hello',
            },
                {
                    test: true,
                });
            should.exist(result.error);
            result.error.should.be.Error();
            result.error.message.should.equal('internal');
            result.error.details.should.containEql('forced error');
            should.not.exist(result.data);

            // 'notFound' endpoint
            const notFoundCfgPath = 'client:test:publisher:instances:0';
            instance = cfg.get(notFoundCfgPath);
            const notFound = client.makeEndpoint('notFound', instance);
            result = yield notFound({
                value: 'hello',
            },
                {
                    test: true,
                });
            should.exist(result.error);
            result.error.should.be.Error();
            result.error.message.should.equal('not found');
            result.error.details.should.containEql('test not found');
            should.not.exist(result.data);

            // 'notImplemented' endpoint
            const nIC = 'client:test:endpoints:notImplemented:publisher:instances:0';
            instance = cfg.get(nIC);
            const notImplementedF = client.makeEndpoint('notImplemented',
                instance);
            result = yield notImplementedF({
                value: 'hello',
            },
                {
                    test: true,
                });
            should.exist(result.error);
            result.error.should.be.Error();
            result.error.message.should.equal('unimplemented');
            should.not.exist(result.data);

            grpcConfig = cfg.get('client:stream:transports:grpc');
            yield client.end();
            client = new grpcClient(grpcConfig, logger);

            // 'requestStream'
            const requestStreamCfgPath: String = 'client:stream:publisher:instances:0';
            instance = cfg.get(requestStreamCfgPath);
            const requestStream = client.makeEndpoint('requestStream', instance);
            let call = yield requestStream();
            for (let i = 0; i < 3; i += 1) {
                yield call.write({ value: 'ping' });
            }
            result = yield call.end();
            result = yield result;
            should.ifError(result.error);
            should.exist(result);
            should.exist(result.result);
            result.result.should.be.equal('pong');

            // 'responseStream'
            const responseStreamCfgPath = 'client:stream:publisher:instances:0';
            instance = cfg.get(responseStreamCfgPath);
            const responseStream = client.makeEndpoint('responseStream', instance);
            call = yield responseStream({ value: 'ping' });
            for (let i = 0; i < 3; i += 1) {
                result = yield call.read();
                result = yield result;
                should.ifError(result.error);
                should.exist(result);
                should.exist(result.result);
                result.result.should.be.equal(`${i}`);
            }

            // 'biStream'
            const biStreamCfgPath: String = 'client:stream:publisher:instances:0';
            instance = cfg.get(biStreamCfgPath);
            const biStream = client.makeEndpoint('biStream', instance);
            call = yield biStream();
            for (let i = 0; i < 3; i += 1) {
                yield call.write({ value: 'ping' });
            }
            for (let i = 0; i < 3; i += 1) {
                result = yield call.read();
                result = yield result;
                should.ifError(result.error);
                should.exist(result);
                should.exist(result.result);
                result.result.should.be.equal('pong');
            }
            yield call.end();

            yield client.end();
        });
    });

    describe('connecting with multiple clients', () => {
        it('should be possible', function* checkMultipleClients() {
            const numClients = 1;
            const conns = [];
            const clients = [];
            const cfg = yield chassis.config.get();
            for (let i = 0; i < numClients; i += 1) {
                const conn = new Client(cfg.get('client:test'));
                conns.push(conn);
                const c = yield conn.connect();
                clients.push(c);
            }
            const reqs = [];
            for (let i = 0; i < numClients; i += 1) {
                reqs.push(clients[i].test({
                    value: 'hello',
                }));
            }
            const resps = yield reqs;
            for (let i = 0; i < resps.length; i += 1) {
                const result = resps[i];
                should.ifError(result.error);
                should.exist(result.data);
                should.exist(result.data.result);
                result.data.result.should.be.equal('welcome');
            }
            for (let i = 0; i < numClients; i += 1) {
                yield conns[i].end();
            }
        });
    });
    describe('calling end', () => {
        it('should stop the server and no longer provide endpoints', function* endServer() {
            server.on('stopped', () => {
                logger.info('server stopped');
            });
            co(function* end() {
                yield server.end();
            });
        });
    });
});

describe('microservice.Client', () => {
    let client;
    let server;
    describe('constructing the client', () => {
        it('should create a client when providing correct configuration',
            function* correctConfig() {
                yield config.load(process.cwd() + '/test', logger);
                const cfg = yield chassis.config.get();
                client = new Client(cfg.get('client:test'));
                should.exist(client);
                should.exist(client.logger);
                should.exist(client.middleware);
                client.middleware.should.have.iterable();
            });
        it('should throw an error when providing no configuration', function* errorOnNoConfig() {
            yield config.load(process.cwd() + '/test', logger);
            const cfg = yield chassis.config.get();
            cfg.set('client:test', null);
            (() => {
                client = new Client(null, null);
            }).should.throw('missing config argument');
        });
        it('should throw an error when providing with invalid configuration',
            function* errorInvalidConfig() {
                yield config.load(process.cwd() + '/test', logger);
                let cfg = yield config.get();
                cfg.set('client:test:endpoints', null);
                (() => {
                    client = new Client(cfg.get('client:test'));
                }).should.throw('no endpoints configured');

                yield config.load(process.cwd() + '/test', logger);
                cfg = yield config.get();
                cfg.set('client:test:transports', null);
                (() => {
                    client = new Client(cfg.get('client:test'));
                }).should.throw('no transports configured');
            });
    });
    context('with running server', () => {
        before(function* initServer() {
            yield config.load(process.cwd() + '/test', logger);
            const cfg = yield config.get();
            server = new Server(cfg.get('server'));
            yield server.bind('test', service);
            yield server.start();
            sleep.sleep(1);
        });
        after(function* stopServer() {
            yield server.end();
        });
        describe('connect', () => {
            it('should return a service object with endpoint functions', async function connectToEndpoints() {
                let connected = false;
                client.on('connected', () => {
                    connected = !connected;
                });

                const testService = await client.connect();
                should.exist(testService);
                should.exist(testService.test);
                // should.ok(isGeneratorFn(testService.test));
                should.exist(testService.throw);
                // should.ok(isGeneratorFn(testService.throw));
                should.exist(testService.notImplemented);
                // should.ok(isGeneratorFn(testService.notImplemented));
                should.exist(testService.notFound);
                // should.ok(isGeneratorFn(testService.notFound));
                connected.should.equal(true);

                // test
                let result = await testService.test({
                    value: 'hello',
                });
                should.exist(result);
                should.not.exist(result.error);
                should.exist(result.data);
                should.exist(result.data.result);
                result.data.result.should.equal('welcome');

                // test with timeout and retry
                result = await testService.test({
                    value: 'hello',
                },
                    {
                        timeout: 5000,
                        retry: 2,
                    }
                );
                should.exist(result);
                should.not.exist(result.error);
                should.exist(result.data);
                should.exist(result.data.result);
                result.data.result.should.equal('welcome');
            });
        });
        describe('end', () => {
            it('should disconnect from all endpoints', function* disconnect() {
                yield client.end();
            });
        });
    });
    context('without a running server', () => {
        describe('connect', () => {
            it('Call should not be created from a closed channel ',
                function* connectToEndpoints() {
                    const testService = yield client.connect();
                    should.exist(testService);
                    should.exist(testService.test);
                    // should.ok(isGeneratorFn(testService.test));
                    should.exist(testService.throw);
                    // should.ok(isGeneratorFn(testService.throw));
                    should.exist(testService.notImplemented);
                    // should.ok(isGeneratorFn(testService.notImplemented));

                    // test
                    const result = yield testService.test({
                        value: 'hello',
                    },
                        {
                            timeout: 100,
                        });
                    should.exist(result);
                    should.exist(result.error);
                    if (_.isArray(result.error)) {
                        _.forEach(result.error, (value, key) => {
                            value.should.be.Error();
                            value.message.should.equal('unavailable');
                        });
                    } else {
                        result.error.should.be.Error();
                        result.error.details.should.containEql('GOAWAY');
                    }
                    should.not.exist(result.data);
                });
        });
        describe('end', () => {
            it('should disconnect from all endpoints', function* disconn() {
                client.on('disconnected', () => {
                    logger.info('all endpoints disconnected');
                });
                co(function* end() {
                    yield client.end();
                });
            });
        });
    });
});

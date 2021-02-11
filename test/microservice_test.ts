import * as should from 'should';
import * as _ from 'lodash';
import { createLogger } from '@restorecommerce/logger';
import * as sleep from 'sleep';
import * as chassis from '../lib';
import { createServiceConfig } from '@restorecommerce/service-config';
import * as gRPCClient from '@restorecommerce/grpc-client';

const config = chassis.config;
const Client = gRPCClient.Client;
const Server = chassis.Server;
const grpcClient = gRPCClient.grpcClient;
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
  create(call, context) {
    const request = call.request;
    return request;
  },
  throw(request, context) {
    throw new Error('forced error');
  },
  notFound(request, context) {
    throw new errors.NotFound('test not found');
  },
  notImplemented: null,
  async biStream(call, context) {
    let req;
    let stream = true;
    while (stream) {
      try {
        req = await call.read();
        // Promisify callback to get response
        req = await new Promise((resolve, reject) => {
          req((err, response) => {
            if (err) {
              reject(err);
            }
            resolve(response);
          });
        });
      } catch (e) {
        stream = false;
        if (e.message === 'stream end') {
          await call.end();
          return;
        }
      }
      should.exist(req);
      should.exist(req.value);
      req.value.should.equal('ping');
      await call.write({ result: 'pong' });
    }
  },
  async requestStream(call, context) {
    let req;
    let stream = true;
    while (stream) {
      try {
        req = await call.read();
        should.exist(req);
        should.exist(req.value);
        req.value.should.equal('ping');
      } catch (e) {
        stream = false;
      }
    }
    return { result: 'pong' };
  },
  async responseStream(call, context) {
    const req = call.request.request;
    should.exist(req);
    should.exist(req.value);
    req.value.should.equal('ping');
    for (let i = 0; i < 3; i += 1) {
      await (call.write({ result: `${i}` }));
    }
    await call.end();
  },
};
let cfg;
describe('microservice.Server', () => {
  let server: chassis.Server;
  describe('constructing the sever', () => {
    it('should throw an error when services config is missing',
      async function throwErrorOnMissingConfig() {
        await config.load(process.cwd() + '/test');
        cfg = await config.get();
        cfg = createServiceConfig(process.cwd() + '/test');
        cfg.set('server:services', undefined);
        (() => {
          server = new Server(cfg.get('server'));
        }).should.throw('missing services configuration');
      });
    it('should throw an error when transports config is missing',
      async function throwErrorOnMissingTransportConfig() {
        await config.load(process.cwd() + '/test');
        const cfg = await config.get();
        cfg.set('server:transports', undefined);
        (() => {
          server = new Server(cfg.get('server'));
        }).should.throw('missing transports configuration');
      });
    it('should throw an error when configuration does not exist',
      async function throwNoConfig() {
        await config.load(process.cwd() + '/test');
        const cfg = await config.get();
        cfg.set('server:services', undefined);
        cfg.set('server:transports', undefined);
        (() => {
          server = new Server(cfg.get('server'));
        }).should.throw('missing server configuration');
      });
    it('should return a server when provided with correct config',
      async function correctConfig() {
        await config.load(process.cwd() + '/test');
        const cfg = await config.get();
        const logger = createLogger(cfg.get('logger'));
        server = new Server(cfg.get('server'), logger);
        should.exist(server);
        should.exist(server.logger);
        should.exist(server.logger.log);
        const levels = [
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
      async function bindService() {
        const boundServices = 2;
        let currentBoundServices = 0;
        server.on('bound', () => {
          currentBoundServices += 1;
        });
        await server.bind('test', service);
        await server.bind('stream', service);
      });
  });
  describe('calling start', () => {
    it('should expose the created endpoints via transports',
      async function checkEndpoints() {
        let serving = false;
        server.on('serving', () => {
          serving = !serving;
        });
        await server.start();
        sleep.sleep(1);
        serving.should.equal(true);
        let grpcConfig = cfg.get('client:test:transports:grpc');
        should.exist(grpcConfig);
        should.exist(grpcConfig.service);
        const logger = createLogger(cfg.get('logger'));
        let client: gRPCClient.grpcClient = new grpcClient(grpcConfig, logger);
        let instance: string;
        let result;
        should.exist(client);
        // --- 'test' endpoint ---
        const testCfgPath: string = 'client:test:endpoints:test:publisher:instances:0';
        instance = cfg.get(testCfgPath);
        const testF = client.makeEndpoint('test', instance);
        result = await testF({
          value: 'hello',
        },
          {
            test: true,
          });
        should.ifError(result.error);
        should.exist(result.data);
        should.exist(result.data.result);
        result.data.result.should.be.equal('welcome');

        // --- 'testCreate' endpoint ---
        const testCreateCfgPath: string = 'client:test:endpoints:create:publisher:instances:0';
        instance = cfg.get(testCreateCfgPath);
        const testCreateF = client.makeEndpoint('create', instance);

        let msg: any = {
          testKey: 'testVal'
        };
        const msgBuffer: any = Buffer.from(JSON.stringify(msg));
        result = await testCreateF(
          {
            items: [{
              value: 'helloWorld123',
              data: { value: msgBuffer }
            }]
          });
        should.ifError(result.error);
        should.exist(result.data);
        should.exist(result.data.items);

        // --- 'throw' endpoint ---
        const throwCfgPath = 'client:test:publisher:instances:0';
        instance = cfg.get(throwCfgPath);
        const throwF = client.makeEndpoint('throw', instance);
        result = await throwF({
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

        // --- 'notFound' endpoint ---
        const notFoundCfgPath = 'client:test:publisher:instances:0';
        instance = cfg.get(notFoundCfgPath);
        const notFound = client.makeEndpoint('notFound', instance);
        result = await notFound({
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

        // --- 'notImplemented' endpoint ---
        const nIC = 'client:test:endpoints:notImplemented:publisher:instances:0';
        instance = cfg.get(nIC);
        const notImplementedF = client.makeEndpoint('notImplemented',
          instance);
        result = await notImplementedF({
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
        await client.end();
        client = new grpcClient(grpcConfig, logger);

        // 'requestStream'
        const requestStreamCfgPath: String = 'client:stream:publisher:instances:0';
        instance = cfg.get(requestStreamCfgPath);
        const requestStream = client.makeEndpoint('requestStream', instance);
        let call = await requestStream();
        for (let i = 0; i < 3; i += 1) {
          await call.write({ value: 'ping' });
        }
        result = await call.end();
        // Promisify the callback to get response
        result = await new Promise((resolve, reject) => {
          result((err, response) => {
            if (err) {
              reject(err);
            }
            resolve(response);
          });
        });
        should.ifError(result.error);
        should.exist(result);
        should.exist(result.result);
        result.result.should.be.equal('pong');

        // 'responseStream'
        const responseStreamCfgPath = 'client:stream:publisher:instances:0';
        instance = cfg.get(responseStreamCfgPath);
        const responseStream = client.makeEndpoint('responseStream', instance);
        call = await responseStream({ value: 'ping' });
        const clientRespStream = call.getResponseStream();
        await new Promise((resolve, reject) => {
          clientRespStream.on('data', (data) => {
            should.ifError(data.error);
            should.exist(data);
            should.exist(data.result);
            const response = ['0','1','2'];
            if (!response.includes(data.result)) {
              reject();
            }
            resolve();
          });
        });

        // 'biStream'
        const biStreamCfgPath: String = 'client:stream:publisher:instances:0';
        instance = cfg.get(biStreamCfgPath);
        const biStream = client.makeEndpoint('biStream', instance);
        call = await biStream();
        for (let i = 0; i < 3; i += 1) {
          await call.write({ value: 'ping' });
        }
        for (let i = 0; i < 3; i += 1) {
          result = await call.read();
          result = await new Promise((resolve, reject) => {
            result((err, response) => {
              if (err) {
                reject(err);
              }
              resolve(response);
            });
          });
          should.ifError(result.error);
          should.exist(result);
          should.exist(result.result);
          result.result.should.be.equal('pong');
        }
        await call.end();
        await client.end();
      });
  });

  describe('connecting with multiple clients', () => {
    it('should be possible', async function checkMultipleClients() {
      const numClients = 3;
      const conns = [];
      const clients = [];
      const cfg = await chassis.config.get();
      for (let i = 0; i < numClients; i += 1) {
        const conn = new Client(cfg.get('client:test'));
        conns.push(conn);
        const c = await conn.connect();
        clients.push(c);
      }
      const reqs = [];
      for (let i = 0; i < numClients; i += 1) {
        reqs.push(clients[i].test({
          value: 'hello',
        }));
      }
      const resps = await reqs;
      for (let i = 0; i < resps.length; i += 1) {
        const result = await resps[i];
        should.ifError(result.error);
        should.exist(result.data);
        should.exist(result.data.result);
        result.data.result.should.be.equal('welcome');
      }
      for (let i = 0; i < numClients; i += 1) {
        await conns[i].end();
      }
    });
  });
  describe('calling end', () => {
    it('should stop the server and no longer provide endpoints',
      async function endServer() {
        await server.stop();
      });
  });
});

describe('microservice.Client', () => {
  let client;
  let server;
  describe('constructing the client', () => {
    it('should create a client when providing correct configuration',
      async function correctConfig() {
        await config.load(process.cwd() + '/test');
        const cfg = await chassis.config.get();
        const logger = createLogger(cfg.get('logger'));
        client = new Client(cfg.get('client:test'), logger);
        should.exist(client);
        should.exist(client.logger);
        should.exist(client.middleware);
        client.middleware.should.have.iterable();
      });
    it('should throw an error when providing no configuration',
      async function errorOnNoConfig() {
        await config.load(process.cwd() + '/test');
        const cfg = await chassis.config.get();
        cfg.set('client:test', null);
        (() => {
          client = new Client(null, null);
        }).should.throw('missing config argument');
      });
    it('should throw an error when providing with invalid configuration',
      async function errorInvalidConfig() {
        await config.load(process.cwd() + '/test');
        let cfg = await config.get();
        cfg.set('client:test:endpoints', null);
        (() => {
          client = new Client(cfg.get('client:test'));
        }).should.throw('no endpoints configured');

        await config.load(process.cwd() + '/test');
        cfg = await config.get();
        cfg.set('client:test:transports', null);
        (() => {
          client = new Client(cfg.get('client:test'));
        }).should.throw('no transports configured');
      });
  });
  context('with running server', () => {
    before(async function initServer() {
      await config.load(process.cwd() + '/test');
      const cfg = await config.get();
      const logger = createLogger(cfg.get('logger'));
      server = new Server(cfg.get('server'), logger);
      await server.bind('test', service);
      await server.start();
      sleep.sleep(1);
    });
    after(async function stopServer() {
      await server.stop();
    });
    describe('connect', () => {
      it('should return a service object with endpoint functions',
        async function connectToEndpoints() {
          let connected = false;
          client.on('connected', () => {
            connected = !connected;
          });

          const testService = await client.connect();
          should.exist(testService);
          should.exist(testService.test);
          should.exist(testService.throw);
          should.exist(testService.notImplemented);
          should.exist(testService.notFound);
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
      it('should disconnect from all endpoints', async function disconnect() {
        await client.end();
      });
    });
  });
  context('without a running server', () => {
    describe('connect', () => {
      it('Call should not be created from a closed channel ',
        async function connectToEndpoints() {
          const testService = await client.connect();
          should.exist(testService);
          should.exist(testService.test);
          should.exist(testService.throw);
          should.exist(testService.notImplemented);

          // test
          const result = await testService.test({
            value: 'hello',
          },
            {
              timeout: 100,
            });
          should.exist(result);
          should.exist(result.error);
          let err = result.error;
          err.should.be.Error();
          err.message.should.equal('unavailable');
          should.not.exist(result.data);
        });
    });
    describe('end', () => {
      it('should disconnect from all endpoints',
        async function disconnect() {
          client.on('disconnected', () => {
            // logger.info('all endpoints disconnected');
          });
          await client.end();
        });
    });
  });
});

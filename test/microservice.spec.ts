import * as should from 'should';
import * as _ from 'lodash';
import { createLogger } from '@restorecommerce/logger';
import * as sleep from 'sleep';
import * as chassis from '../src';
import { createServiceConfig } from '@restorecommerce/service-config';
import { GrpcClient } from '@restorecommerce/grpc-client';
import { Observable } from 'rxjs';

const config = chassis.config;
const Server = chassis.Server;
const grpc = chassis.grpc;
const errors = chassis.errors;

/* global describe context it before after*/
/* eslint-disable */ 
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
    return {
      status: {
        code: 500,
        message: 'forced error'
      }
    }
  },
  notFound(request, context) {
    return {
      status: {
        code: 404,
        message: 'test not found'
      }
    }
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

const chunkSize = 1 << 10;

const bufferToObservable = (buffer: Buffer): any => {
  return new Observable((subscriber) => {
    for (let i = 0; i < Math.ceil(buffer.length / chunkSize); i++) {
      subscriber.next({
        message: buffer.slice(i * chunkSize, (i + 1) * chunkSize)
      })
    }
    subscriber.complete();
  });
}

let cfg;
describe('microservice.Server', () => {
  let server: chassis.Server;
  describe('constructing the sever', () => {
    it('should throw an error when services config is missing',
      async () => {
        await config.load(process.cwd() + '/test');
        cfg = await config.get();
        cfg = createServiceConfig(process.cwd() + '/test');
        cfg.set('server:services', undefined);
        (() => {
          server = new Server(cfg.get('server'));
        }).should.throw('missing services configuration');
      });
    it('should throw an error when transports config is missing',
      async () => {
        await config.load(process.cwd() + '/test');
        const cfg = await config.get();
        cfg.set('server:transports', undefined);
        (() => {
          server = new Server(cfg.get('server'));
        }).should.throw('missing transports configuration');
      });
    it('should throw an error when configuration does not exist',
      async () => {
        await config.load(process.cwd() + '/test');
        const cfg = await config.get();
        cfg.set('server:services', undefined);
        cfg.set('server:transports', undefined);
        (() => {
          server = new Server(cfg.get('server'));
        }).should.throw('missing server configuration');
      });
    it('should return a server when provided with correct config',
      async () => {
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
      async () => {
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
      async () => {
        let serving = false;
        server.on('serving', () => {
          serving = !serving;
        });
        await server.start();
        sleep.sleep(1);
        serving.should.equal(true);
        let client = new GrpcClient(cfg.get('client:test'));
        let result;
        should.exist(client);
        // --- 'test' endpoint ---
        result = await client.test.test({
          value: 'hello',
        },
        {
          test: true,
        });
        should.ifError(result.error);
        should.exist(result.result);
        result.result.should.be.equal('welcome');

        // --- 'testCreate' endpoint ---
        let msg: any = {
          testKey: 'testVal'
        };
        const msgBuffer: any = Buffer.from(JSON.stringify(msg));
        result = await client.test.create(
          {
            items: [{
              value: 'helloWorld123',
              data: { value: msgBuffer }
            }]
          });
        should.ifError(result.error);
        should.exist(result.items);

        // --- 'throw' endpoint ---
        result = await client.test.throw({
          value: 'hello',
        },
        {
          test: true,
        });
        should.exist(result.status);
        result.status[0].code.should.equal(500);
        result.status[0].message.should.equal('forced error');
        result.result.should.be.empty();

        // --- 'notFound' endpoint ---
        result = await client.test.notFound({
          value: 'hello',
        },
        {
          test: true,
        });
        should.exist(result.status);
        result.status[0].code.should.equal(404);
        result.status[0].message.should.equal('test not found');
        result.result.should.be.empty();

        // --- 'notImplemented' endpoint ---
        try {
          result = await client.test.notImplemented({
            value: 'hello',
          },
          {
            test: true,
          });
        } catch(err) {
          err.message.should.equal('12 UNIMPLEMENTED: The server does not implement this method');
        }

        // 'requestStream'
        const streamClient = new GrpcClient(cfg.get('client:stream'));
        let inputBuffer = Buffer.from(JSON.stringify({ value: 'ping'}));
        result = await streamClient.stream.requestStream(bufferToObservable(inputBuffer));
        should.ifError(result.error);
        should.exist(result);
        should.exist(result.result);
        result.result.should.be.equal('pong');

        // 'responseStream'
        result = await streamClient.stream.responseStream({
          value: 'ping'
        });
        let concatDataResp = [];
        let actualResp: any = await new Promise((resolve, reject) => {
          result.subscribe(data => {
            concatDataResp.push(data.result);
            if (data.result === '2') {
              resolve(concatDataResp);
            }
          });
        });
        actualResp.should.deepEqual(['0','1','2' ]);

        // 'biStream'
        result = await streamClient.stream.biStream(bufferToObservable(inputBuffer));
        result.subscribe(data => {
          data.result.should.be.equal('pong');
        });
      });
  });

  describe('connecting with multiple clients', () => {
    it('should be possible', async () => {
      const numClients = 3;
      const conns = [];
      const clients = [];
      const cfg = await chassis.config.get();
      for (let i = 0; i < numClients; i += 1) {
        const conn = new GrpcClient(cfg.get('client:test'));
        conns.push(conn.test);
        clients.push(conn.test);
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
        should.exist(result.result);
        result.result.should.be.equal('welcome');
      }
    });
  });
  describe('calling end', () => {
    it('should stop the server and no longer provide endpoints',
      async () => {
        await server.stop();
      });
  });
});

describe('microservice.Client', () => {
  let client;
  let server;
  describe('constructing the client', () => {
    it('should create a client when providing correct configuration',
      async () => {
        await config.load(process.cwd() + '/test');
        const cfg = await chassis.config.get();
        client = new GrpcClient(cfg.get('client:test'));
        should.exist(client);
      });
    it('should throw an error when providing no configuration',
      async () => {
        await config.load(process.cwd() + '/test');
        const cfg = await chassis.config.get();
        cfg.set('client:test', null);
        (() => {
          client = new GrpcClient(null);
        }).should.throw('missing config argument');
      });
    it('should throw an error when providing with invalid configuration',
      async () => {
        await config.load(process.cwd() + '/test');
        let cfg = await config.get();
        (() => {
          client = new GrpcClient(cfg.get('client:testInvalid'));
        }).should.throw('no endpoints configured');
      });
  });
  context('with running server', () => {
    before(async () => {
      await config.load(process.cwd() + '/test');
      const cfg = await config.get();
      const logger = createLogger(cfg.get('logger'));
      server = new Server(cfg.get('server'), logger);
      await server.bind('test', service);
      await server.start();
      sleep.sleep(1);
    });
    after(async () => {
      await server.stop();
    });
    describe('connect', () => {
      it('should return a service object with endpoint functions',
        async () => {
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
      it('should disconnect from all endpoints', async () => {
        await client.end();
      });
    });
  });
  context('without a running server', () => {
    describe('connect', () => {
      it('Call should not be created from a closed channel ',
        async () => {
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
        async () => {
          client.on('disconnected', () => {
            // logger.info('all endpoints disconnected');
          });
          await client.end();
        });
    });
  });
});

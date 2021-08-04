import * as should from 'should';
import { createLogger } from '@restorecommerce/logger';
import { GrpcClient } from '@restorecommerce/grpc-client';
import { grpcServer } from '../src';
import * as sleep from 'sleep';
/* global describe it before after*/

const providers = [{
  config: {
    client: {
      test: {
        address: 'localhost:50060',
        proto: {
          protoRoot: 'node_modules/@restorecommerce/protos/',
          protoPath: 'test/test.proto',
          services: {
            test: {
              packageName: 'test',
              serviceName: 'Test'
            }
          }
        }
      }
    },
    server: {
      name: 'grpcTest',
      provider: 'grpc',
      services: {
        test: 'test.Test',
      },
      protos: ['test/test.proto'],
      protoRoot: 'node_modules/@restorecommerce/protos/',
      addr: 'localhost:50060'
    },
    logger: {
      console: {
        handleExceptions: false,
        level: 'crit',
        colorize: true,
        prettyPrint: true
      }
    }
  },
  name: 'grpc',
  Client: GrpcClient,
  Server: grpcServer,
}];

providers.forEach((provider) => {
  describe(`transport provider ${provider.name}`, () => {
    describe('the server', () => {
      const Server = provider.Server;
      let server;
      /* eslint-disable */
      const service = {
        test(request, context) { },
      };
      it('should conform to a server provider', () => {
        should.exist(Server.constructor);
        should.exist(Server.prototype.bind);
        should.exist(Server.prototype.start);
        should.exist(Server.prototype.end);
      });
      describe('constructing the server provider with proper config',
        () => {
          it('should result in a server transport provider', () => {
            const logger = createLogger(provider.config.logger);
            server = new Server(provider.config.server, logger);
            should.exist(server);
          });
        });
      describe('binding a service', () => {
        it('should result in a wrapped service', async () => {
          await server.bind('test', service);
        });
      });
      describe('start', () => {
        it('should start the server', async () => {
          await server.start();
          sleep.sleep(1);
        });
      });
      describe('end', () => {
        it('should stop the server', async () => {
          await server.end();
        });
      });
    });
    describe('the client', () => {
      const Client = provider.Client;
      let client;
      const methodName = 'test';
      let endpoint;
      const response = {
        result: 'abcd',
        status: {
          id: '',
          code: 200,
          message: 'success'
        }
      };
      const request = {
        value: 'hello',
      };
      it('should conform to a client provider', () => {
        should.exist(Client.constructor);
      });
      describe('constructing the client provider with proper config',
        () => {
          it('should result in a client transport provider', () => {
            const logger = createLogger(provider.config.logger);
            client = new GrpcClient(provider.config.client.test, logger);
            should.exist(client);
          });
        });
      describe('makeEndpoint', () => {
        it('should fail when creating an undefined protobuf method',
          async () => {
            const errMessage = 'client.test.methodNameFail is not a function';
            try {
              endpoint = await client.test.methodNameFail({});
            } catch (err) {
              should.exist(err);
              err.message.should.equal(errMessage);
            }
            should.not.exist(endpoint);
          });
        describe('without running server', function runWithoutServer() {
          this.slow(200);
          it('should fail', async () => {
            endpoint = client.test[methodName];
            const result = await endpoint({});
            result.operationStatus.message.should.equal('14 UNAVAILABLE: No connection established');
          });
        });
        describe('with running server', () => {
          const errMessage = 'forced error';
          let server;
          const service = {
            test(call, context) {
              const req = call.request;
              should.deepEqual(request, req);
              return response;
            },
            throw(req, context) {
              throw new Error(errMessage);
            },
          };
          before(async function startServer() {
            this.timeout(5000);
            const logger = createLogger(provider.config.logger);
            server = new provider.Server(provider.config.server, logger);
            await server.bind('test', service);
            await server.start();
            sleep.sleep(2);
          });
          after(async () => {
            await server.end();
          });
          it('should create an endpoint', () => {
            endpoint = client.test[methodName];
            should.exist(endpoint);
          });
          it('should succeed when calling with empty context',
            async () => {
              const result = await endpoint(request, {});
              should.deepEqual(response, result);
            });
          it('should succeed when calling without context',
            async () => {
              const result = await endpoint(request);
              should.deepEqual(response, result);
            });
          it('should return an error when calling an unimplemented method',
            async () => {
              const endpointThrow = client.test['notImplemented'];
              should.exist(endpoint);
              const result = await endpointThrow(request);
              result.operationStatus.code.should.equal(12);
              result.operationStatus.message.should.equal('12 UNIMPLEMENTED: The server does not implement the method NotImplemented');
            });
          it('should return an error when calling failing endpoint',
            async () => {
              const endpointThrow = client.test['throw'];
              should.exist(endpoint);
              const result = await endpointThrow(request);
              result.operationStatus.code.should.equal(13);
              result.operationStatus.message.should.equal('13 INTERNAL: forced error');
            });
        });
      });
    });
  });
});

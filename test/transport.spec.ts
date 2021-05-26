import * as should from 'should';
import * as co from 'co';
import { createLogger } from '@restorecommerce/logger';
import * as gRPCClient from '@restorecommerce/grpc-client';
const grpcClient = gRPCClient.grpcClient;
import { grpcServer } from '../src';
import * as sleep from 'sleep';
/* global describe it before after*/

const providers = [{
  config: {
    client: {
      name: 'grpcTest',
      provider: 'grpc',
      service: 'test.Test',
      protos: ['test/test.proto'],
      protoRoot: 'node_modules/@restorecommerce/protos/',
      addr: 'grpc://localhost:50060',
      timeout: 100,
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
        level: "error",
        colorize: true,
        prettyPrint: true
      }
    }
  },
  name: 'grpc',
  Client: grpcClient,
  Server: grpcServer,
}];

providers.forEach((provider) => {
  describe(`transport provider ${provider.name}`, () => {
    describe('the server', () => {
      const Server = provider.Server;
      let server;
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
      const methodNameFail = 'this_method_does_not_exist';
      const instance = provider.config.client.addr;
      let endpoint;
      const response = {
        result: 'abcd',
      };
      const request = {
        value: 'hello',
      };
      it('should conform to a client provider', () => {
        should.exist(Client.constructor);
        should.exist(Client.prototype.makeEndpoint);
      });
      describe('constructing the client provider with proper config',
        () => {
          it('should result in a client transport provider', () => {
            const logger = createLogger(provider.config.logger);
            client = new Client(provider.config.client, logger);
            should.exist(client);
          });
        });
      describe('makeEndpoint', () => {
        it('should fail when creating an undefined protobuf method',
          async () => {
            const errMessage = 'conn has no method this_method_does_not_exist';
            try {
              endpoint = await client.makeEndpoint(methodNameFail, instance);
            } catch (err) {
              should.exist(err);
              err.message.should.equal(errMessage);
            }
            should.not.exist(endpoint);
          });
        describe('without running server', function runWithoutServer() {
          this.slow(200);
          it('should fail', async () => {
            endpoint = client.makeEndpoint(methodName, instance);
            const result = await endpoint();
            result.error.should.be.Error();
            result.error.details.should.containEql('14 UNAVAILABLE: failed to connect to all addresses');
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
            endpoint = client.makeEndpoint(methodName, instance);
            should.exist(endpoint);
          });
          it('should succeed when calling with empty context',
            async () => {
              const result = await endpoint(request, {});
              should.ifError(result.error);
              should.deepEqual(response, result.data);
            });
          it('should succeed when calling without context',
            async () => {
              const result = await endpoint(request);
              should.ifError(result.error);
              should.deepEqual(response, result.data);
            });
          it('should return an error when calling an unimplemented method',
            async () => {
              const endpointThrow = client.makeEndpoint('notImplemented', instance);
              should.exist(endpoint);
              const result = await endpointThrow(request);
              should.not.exist(result.data);
              should.exist(result.error);
              should.equal(result.error.message, 'unimplemented');
            });
          it('should return an error when calling failing endpoint',
            async () => {
              const endpointThrow = client.makeEndpoint('throw', instance);
              should.exist(endpoint);
              const result = await endpointThrow(request);
              should.not.exist(result.data);
              should.exist(result.error);
              should.exist(result.error.message);
              should.exist(result.error.details);
              should.equal(result.error.message, 'internal');
              result.error.details.should.containEql(errMessage);
            });
        });
      });
    });
  });
});

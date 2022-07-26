import * as should from 'should';
import { createLogger } from '@restorecommerce/logger';
import { createClient } from '@restorecommerce/grpc-client';
import { grpcServer } from '../src';
import * as sleep from 'sleep';
import { TestClient, TestDefinition } from '@restorecommerce/rc-grpc-clients/dist/generated/test/test';
import { TestDefinition as ServerTestDefinition } from '@restorecommerce/rc-grpc-clients/dist/generated-server/test/test';
import { testService } from './microservice.spec';
import { BindConfig } from '../src/microservice/transport/provider/grpc';
import { createChannel } from 'nice-grpc';
/* global describe it before after*/

const providers = [{
  config: {
    client: {
      test: {
        address: 'localhost:50060'
      }
    },
    server: {
      name: 'grpcTest',
      provider: 'grpc',
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
  Server: grpcServer,
}];

providers.forEach((provider) => {
  describe(`transport provider ${provider.name}`, () => {
    describe('the server', () => {
      const ProviderServer = provider.Server;
      let server: grpcServer;
      it('should conform to a server provider', () => {
        should.exist(ProviderServer.constructor);
        should.exist(ProviderServer.prototype.bind);
        should.exist(ProviderServer.prototype.start);
        should.exist(ProviderServer.prototype.end);
      });
      describe('constructing the server provider with proper config',
        () => {
          it('should result in a server transport provider', () => {
            const logger = createLogger(provider.config.logger);
            server = new ProviderServer(provider.config.server, logger);
            should.exist(server);
          });
        });
      describe('binding a service', () => {
        it('should result in a wrapped service', async () => {
          await server.bind({
            service: ServerTestDefinition,
            implementation: testService
          } as BindConfig<ServerTestDefinition>);
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
      let client: TestClient;
      const methodName = 'test';
      let endpoint;
      const response = {
        result: 'welcome',
        status: {
          id: '',
          code: 200,
          message: 'success'
        }
      };
      const request = {
        value: 'hello',
      };
      describe('constructing the client provider with proper config',
        () => {
          it('should result in a client transport provider', () => {
            const logger = createLogger(provider.config.logger);
            const channel = createChannel(provider.config.client.test.address);
            client = createClient({
              ...provider.config.client.test,
              logger
            }, TestDefinition, channel);
            should.exist(client);
          });
        });
      describe('makeEndpoint', () => {
        describe('without running server', function runWithoutServer() {
          this.slow(200);
          it('should fail', async () => {
            endpoint = client[methodName];
            try {
              await endpoint({});
            } catch (err) {
              err.message.should.equal('14 UNAVAILABLE: No connection established');
            }
          });
        });
        describe('with running server', () => {
          const errMessage = 'forced error';
          let server: grpcServer;
          before(async function startServer() {
            this.timeout(5000);
            const logger = createLogger(provider.config.logger);
            server = new provider.Server(provider.config.server, logger);
            await server.bind({
              service: ServerTestDefinition,
              implementation: testService
            } as BindConfig<ServerTestDefinition>);
            await server.start();
            sleep.sleep(2);
          });
          after(async () => {
            await server.end();
          });
          it('should create an endpoint', () => {
            endpoint = client[methodName];
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
          it('should return an error when calling failing endpoint',
            async () => {
              const endpointThrow = client['throw'];
              should.exist(endpoint);
              const result = await endpointThrow(request);
              result.status.code.should.equal(500);
              result.status.message.should.equal('forced error');
            });
        });
      });
    });
  });
});

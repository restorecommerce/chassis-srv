'use strict';

/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import * as mocha from 'mocha';
const coMocha = require('co-mocha');

coMocha(mocha);

const should = require('should');
const co = require('co');
const isGeneratorFn = require('is-generator').fn;
const logger = require('./logger_test.js');
import * as gRPCClient from '@restorecommerce/grpc-client';

import * as chassis from '../lib';
const grpcClient = gRPCClient.grpcClient;
import { grpcServer } from '../lib';
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
  },
  name: 'grpc',
  Client: grpcClient,
  Server: grpcServer,
}];
providers.forEach((provider) => {
  logger.level = 'silly';
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
        should.ok(isGeneratorFn(Server.prototype.bind));
        should.exist(Server.prototype.start);
        should.ok(isGeneratorFn(Server.prototype.start));
        should.exist(Server.prototype.end);
        should.ok(isGeneratorFn(Server.prototype.end));
      });
      describe('constructing the server provider with proper config',
        () => {
          it('should result in a server transport provider', () => {
            server = new Server(provider.config.server, logger);
            should.exist(server);
          });
        });
      describe('binding a service', () => {
        it('should result in a wrapped service', function* bindService() {
          yield server.bind('test', service);
        });
      });
      describe('start', () => {
        it('should start the server', function* startServer() {
          yield server.start();
          sleep.sleep(1);
        });
      });
      describe('end', () => {
        it('should stop the server', function* stopServer() {
          yield server.end();
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
        // should.ok(isGeneratorFn(Client.prototype.makeEndpoint));
      });
      describe('constructing the client provider with proper config',
        () => {
          it('should result in a client transport provider', () => {
            client = new Client(provider.config.client, logger);
            should.exist(client);
          });
        });
      describe('makeEndpoint', () => {
        it('should fail when creating an undefined protobuf method',
          function* checkMakeEndpoint() {
            endpoint = yield co(function* makeEndpoint() {
              return yield client.makeEndpoint(methodNameFail, instance);
            }).then((result) => {
              should.ok(false, 'should not call then');
            }).catch((err) => {
              should.exist(err);
            });
            should.not.exist(endpoint);
          });
        describe('without running server', function runWithoutServer() {
          this.slow(200);
          it('should fail', function* checkMakeEndpoint() {
            endpoint = client.makeEndpoint(methodName, instance);
            const result = yield endpoint();
            result.error.should.be.Error();
            result.error.details.should.containEql('Connect Failed');
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
          before(function* startServer() {
            this.timeout(5000);
            server = new provider.Server(provider.config.server, logger);
            yield server.bind('test', service);
            yield server.start();
            sleep.sleep(2);
          });
          after(function* stopServer() {
            yield server.end();
          });
          it('should create an endpoint', function* makeEndpoint() {
            endpoint = client.makeEndpoint(methodName, instance);
            should.exist(endpoint);
          });
          it('should succeed when calling with empty context', function* checkWithEmptyContext() {
            const result = yield endpoint(request, {});
            should.ifError(result.error);
            should.deepEqual(response, result.data);
          });
          it('should succeed when calling without context', function* checkWithoutContext() {
            const result = yield endpoint(request);
            should.ifError(result.error);
            should.deepEqual(response, result.data);
          });
          it('should return an error when calling an unimplemented method',
            function* checkUnimplemented() {
              const endpointThrow = client.makeEndpoint('notImplemented', instance);
              should.exist(endpoint);
              const result = yield endpointThrow(request);
              should.not.exist(result.data);
              should.exist(result.error);
              should.equal(result.error.message, 'unimplemented');
            });
          it('should return an error when calling failing endpoint',
            function* checkFailingEndpoint() {
              const endpointThrow = client.makeEndpoint('throw', instance);
              should.exist(endpoint);
              const result = yield endpointThrow(request);
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

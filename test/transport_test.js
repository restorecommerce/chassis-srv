'use strict';

var mocha = require('mocha')
var coMocha = require('co-mocha')
coMocha(mocha)

var assert = require('assert');
var should = require('should');
var util = require('util');
var co = require('co');
var isGenerator = require('is-generator');
var isGeneratorFn = require('is-generator').fn
var grpc = require('../lib/transport/grpc');

describe('transport provider', function() {
  var providers = [{
    config: {
      proto: '/test/test.proto',
      package: 'test',
      service: 'Test',
      addr: "localhost:50051",
      timeout: 3000,
    },
    name: 'grpc',
    client: grpc.Client,
    server: grpc.Server,
  }, ];
  providers.forEach(function(provider) {
    describe(util.format('provider %s', provider.name), function() {
      describe('the server', function() {
        let Server = provider.server;
        let server;
        let service = {
          test: function(request, context) {

          },
        };
        it('should conform to a server provider', function() {
          assert(Server.constructor);
          assert(Server.prototype.bind);
          assert(isGeneratorFn(Server.prototype.bind));
          assert(Server.prototype.start);
          assert(isGeneratorFn(Server.prototype.start));
          assert(Server.prototype.end);
          assert(isGeneratorFn(Server.prototype.end));
        });
        describe('constructing the server provider with proper config', function() {
          it('should result in a server transport provider', function() {
            let config = {
              addr: provider.config.addr,
              package: provider.config.package,
              proto: provider.config.proto,
              service: provider.config.service,
            };
            server = new Server(config);
            assert(server);
          });
        })
        describe('binding a service', function() {
          it('should result in a wrapped service', function*() {
            yield server.bind(service);
          });
        });
        describe('start', function() {
          it('should start the server', function*() {
            yield server.start();
          });
        });
        describe('end', function() {
          it('should stop the server', function*() {
            yield server.end();
          });
        });
      });
      describe('the client', function() {
        let Client = provider.client;
        let client;
        let methodName = 'test';
        let instance = 'grpc://' + provider.config.addr;
        let endpoint;
        it('should conform to a client provider', function() {
          assert(Client.constructor);
          assert(Client.prototype.makeEndpoint);
          assert(isGeneratorFn(Client.prototype.makeEndpoint));
        });
        describe('constructing the client provider with proper config', function() {
          it('should result in a client transport provider', function() {
            let config = {
              package: provider.config.package,
              proto: provider.config.proto,
              service: provider.config.service,
              timeout: provider.config.timeout,
            };
            client = new Client(config);
            assert(client);
          });
        });
        describe('makeEndpoint', function() {
          it('should create an endpoint', function*() {
            endpoint = yield client.makeEndpoint(methodName, instance);
          });
        });
      });
    });
  });
});

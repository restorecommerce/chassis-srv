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

let logger = {
  log: function(){
    let level = arguments[0].toLowerCase();
    if (level == 'error') {
      let args = Array.prototype.splice.apply(arguments, [1]);
      console.log(level, args);
    }
  },
};
var providers = [{
  config: {
    proto: 'test/test.proto',
    package: 'test',
    service: 'Test',
    addr: "localhost:50051",
    timeout: 100,
  },
  name: 'grpc',
  client: grpc.Client,
  server: grpc.Server,
}, ];
providers.forEach(function(provider) {
  describe(util.format('transport provider %s', provider.name), function() {
    describe('the server', function() {
      let Server = provider.server;
      let server;
      let service = {
        test: function(request, context) {},
      };
      it('should conform to a server provider', function() {
        should.exist(Server.constructor);
        should.exist(Server.prototype.bind);
        should.ok(isGeneratorFn(Server.prototype.bind));
        should.exist(Server.prototype.start);
        should.ok(isGeneratorFn(Server.prototype.start));
        should.exist(Server.prototype.end);
        should.ok(isGeneratorFn(Server.prototype.end));
      });
      describe('constructing the server provider with proper config', function() {
        it('should result in a server transport provider', function() {
          let config = {
            addr: provider.config.addr,
            package: provider.config.package,
            proto: provider.config.proto,
            service: provider.config.service,
          };
          server = new Server(config, logger);
          should.exist(server);
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
      let methodNameFail = 'this_method_does_not_exist';
      let instance = 'grpc://' + provider.config.addr;
      let endpoint;
      let response = {
        result: 'abcd',
      };
      let request = {
        value: 'hello',
      };
      it('should conform to a client provider', function() {
        should.exist(Client.constructor);
        should.exist(Client.prototype.makeEndpoint);
        should.ok(isGeneratorFn(Client.prototype.makeEndpoint));
      });
      describe('constructing the client provider with proper config', function() {
        it('should result in a client transport provider', function() {
          let config = {
            package: provider.config.package,
            proto: provider.config.proto,
            service: provider.config.service,
            timeout: provider.config.timeout,
          };
          client = new Client(config, logger);
          should.exist(client);
        });
      });
      describe('makeEndpoint', function() {
        it('should fail when creating a method which is not defined in the protobuf', function*() {
          endpoint = yield co(function*() {
            let endpoint = yield client.makeEndpoint(methodNameFail, instance);
            return endpoint;
          }).then(function(result) {
            assert.ok(false, 'should not call then');
          }).catch(function(err) {
            should.exist(err);
          })
          should.not.exist(endpoint);
        });
        describe('without running server', function() {
          this.slow(200);
          it('should fail', function*() {
            let err;
            endpoint = yield co(function*() {
              let endpoint = yield client.makeEndpoint(methodName, instance);
              return endpoint;
            }).then(function(result) {
              assert.ok(false, 'should not call then');
            }).catch(function(e) {
              err = e;
            })
            should.not.exist(endpoint);
            should.exist(err);
            should.equal(err.message, 'Failed to connect before the deadline');
          });
        });
        describe('with running server', function() {
          let config = {
            addr: provider.config.addr,
            package: provider.config.package,
            proto: provider.config.proto,
            service: provider.config.service,
          };
          let errMessage = 'forced error';
          let server;
          let service = {
            test: function(req, context) {
              should.deepEqual(request, req);
              return response;
            },
            throw: function(req, context) {
              throw new Error(errMessage);
            },
          };
          before(function*() {
            server = new provider.server(config, logger);
            yield server.bind(service);
            yield server.start();
          });
          after(function*() {
            yield server.end();
          });
          it('should create an endpoint', function*() {
            endpoint = yield client.makeEndpoint(methodName, instance);
            should.exist(endpoint);
          });
          it('should succeed when calling it with a correct request and an empty context', function*() {
            let result = yield endpoint(request, {});
            should.deepEqual(response, result.data);
            should.ifError(result.error);
          });
          it('should succeed when calling it with a correct request and omitting the context', function*() {
            let result = yield endpoint(request);
            should.deepEqual(response, result.data);
            should.ifError(result.error);
          });
          it('should return an error when calling a unimplemented method', function*() {
            let endpointThrow = yield client.makeEndpoint('notImplemented', instance);
            should.exist(endpoint);
            let result = yield endpointThrow(request);
            should.not.exist(result.data);
            should.exist(result.error);
            should.equal(result.error.message, 'unimplemented')
          });
          it('should return an error when calling a method which throws an error', function*() {
            let endpointThrow = yield client.makeEndpoint('throw', instance);
            should.exist(endpoint);
            let result = yield endpointThrow(request);
            should.not.exist(result.data);
            should.exist(result.error);
            should.equal(result.error.message, 'internal');
            should.equal(result.error.details, errMessage);
          });
        });
      });
    });
  });
});

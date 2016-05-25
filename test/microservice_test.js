'use strict';

var mocha = require('mocha')
var coMocha = require('co-mocha')
coMocha(mocha)

var assert = require('assert');
var should = require('should');
var util = require('util');
var co = require('co');
var _ = require('lodash');
var isGenerator = require('is-generator');
var isGeneratorFn = require('is-generator').fn
var microservice = require('../lib/microservice');
var config = require('../lib/config');
var events = require('../lib/transport/events/events');
var grpc = require('../lib/transport/grpc');
var Server = microservice.Server;
var Client = microservice.Client;

let service = {
  test: function(request, context) {
    request.value.should.be.equal('hello');
    return {
      result: 'welcome'
    };
  },
  throw: function(request, context) {
    throw new Error('forced error');
  },
  notImplemented: null,
};

describe('microservice.Server', function() {
  let server;
  let topicName = 'test';
  let topic;
  let eventName = ''
  it('should be a constructor and have specific prototype functions', function*() {
    should.exist(Server.constructor);
    should.exist(Server.prototype.bind);
    should.ok(isGeneratorFn(Server.prototype.bind));
    should.exist(Server.prototype.start);
    should.ok(isGeneratorFn(Server.prototype.start));
    should.exist(Server.prototype.end);
    should.ok(isGeneratorFn(Server.prototype.end));
    should.exist(Server.prototype.middleware);
    Server.prototype.middleware.should.have.iterable();
  });
  describe('constructing the sever', function() {
    it('should throw an error when provided with no config for endpoints but for transports', function*() {
      config.load(process.cwd() + '/test');
      let cfg = config.get();
      cfg.set('server:events', undefined);
      cfg.set('server:endpoints', undefined);
      (function() {
        server = new Server();
      }).should.throw('missing endpoints configuration');
    });
    it('should throw an error when provided with no config for transports but for endpoints', function*() {
      config.load(process.cwd() + '/test');
      let cfg = config.get();
      cfg.set('server:events', undefined);
      cfg.set('server:transports', undefined);
      (function() {
        server = new Server();
      }).should.throw('missing transports configuration');
    });
    it('should throw an error when configuration does not exist', function*() {
      config.load(process.cwd() + '/test');
      let cfg = config.get();
      cfg.set('server:events', undefined);
      cfg.set('server:endpoints', undefined);
      cfg.set('server:transports', undefined);
      (function() {
        server = new Server();
      }).should.throw('missing server configuration');
    });
    it('should return a server when provided with config for events', function*() {
      config.load(process.cwd() + '/test');
      let cfg = config.get();
      cfg.set('server:endpoints', undefined);
      cfg.set('server:transports', undefined);
      server = new Server();
      assert(server);
      assert(server.logger);
      assert(server.logger.log);
      assert(server.events);
      server.events.should.be.an.instanceof(events.Events);
      should.not.exist(server.transport);
    });
    it('should return a server when provided with config for endpoints', function*() {
      config.load(process.cwd() + '/test');
      let cfg = config.get();
      cfg.set('server:events', undefined);
      server = new Server();
      assert(server);
      assert(server.logger);
      assert(server.logger.log);
      should.not.exist(server.events);
      assert(server.transport);
      assert(server.transport.grpc);
      server.transport.grpc.should.be.an.instanceof(grpc.Server);
    });
    it('should return a server when provided with config for events and transports', function*() {
      config.load(process.cwd() + '/test');
      server = new Server();
      assert(server);
      assert(server.logger);
      assert(server.logger.log);
      assert(server.events);
      server.events.should.be.an.instanceof(events.Events);
      assert(server.transport);
      assert(server.transport.grpc);
      server.transport.grpc.should.be.an.instanceof(grpc.Server);
    });
    it('should be possible to subscribe to event topics', function*() {
      assert(server.events.subscribe);
      assert(isGeneratorFn(server.events.subscribe));
      topic = yield server.events.subscribe(topicName);
      assert(topic);
      assert(topic.on);
      assert(topic.emit);
      assert(isGeneratorFn(topic.emit));
      topic.name.should.equal(topicName);
    });
  });
  describe('calling bind', function() {
    it('should wrap a service and create endpoints for each object function', function*() {
      yield server.bind(service);
    });
  });
  describe('calling start', function() {
    it('should expose the created endpoints via transports', function*() {
      yield server.start();

      let cfg = config.get();
      let grpcConfig = cfg.get('client:test:transports:grpc');
      should.exist(grpcConfig);
      should.exist(grpcConfig.proto);
      should.exist(grpcConfig.package);
      should.exist(grpcConfig.service);

      // 'test' endpoint
      let instance = cfg.get('client:test:endpoints:test:publisher:instances:0');
      let client = new grpc.Client(grpcConfig, server.logger);
      let testF = yield client.makeEndpoint('test', instance);
      let result = yield testF({
        value: 'hello'
      }, {
        test: true
      });
      should.ifError(result.error);
      should.exist(result.data);
      should.exist(result.data.result);
      result.data.result.should.be.equal('welcome');

      // 'throw' endpoint
      instance = cfg.get('client:test:endpoints:throw:publisher:instances:0');
      let throwF = yield client.makeEndpoint('throw', instance);
      result = yield throwF({
        value: 'hello'
      }, {
        test: true
      });
      should.exist(result.error);
      result.error.should.be.Error();
      result.error.message.should.equal('internal');
      result.error.details.should.equal('forced error');
      should.not.exist(result.data);

      // 'notImplemented' endpoint
      instance = cfg.get('client:test:endpoints:notImplemented:publisher:instances:0');
      let notImplementedF = yield client.makeEndpoint('notImplemented', instance);
      result = yield notImplementedF({
        value: 'hello'
      }, {
        test: true
      });
      should.exist(result.error);
      result.error.should.be.Error();
      result.error.message.should.equal('unimplemented');
      should.not.exist(result.data);

      yield client.end();
    });
  });
  describe('calling end', function() {
    it('should stop the server and no longer provide endpoints', function*() {
      yield server.end();
    })
  });
});

let logger = {
  log: function() {
    let level = arguments[0].toLowerCase();
    if (level === 'error') {
      let args = Array.prototype.splice.apply(arguments, [1]);
      console.log(level, args);
    }
  },
};
describe('microservice.Client', function() {
  let client;
  let server;
  it('should be a constructor and have specific prototype functions', function*() {
    should.exist(Client.constructor);
    should.exist(Client.prototype.connect);
    should.ok(isGeneratorFn(Client.prototype.connect));
    should.exist(Client.prototype.middleware);
    Client.prototype.middleware.should.have.iterable();
  });
  describe('constructing the client', function() {
    it('should create a client when providing correct configuration', function*() {
      config.load(process.cwd() + '/test');
      client = new Client('test');
      should.exist(client);
      should.exist(client.logger);
    });
    it('should throw an error when providing no configuration', function*(){
      config.load(process.cwd() + '/test');
      let cfg = config.get();
      cfg.set('client:test', null);
      (function(){
        client = new Client('test');
      }).should.throw('no client:test config');
    });
    it('should throw an error when providing with invalid configuration', function*(){
      config.load(process.cwd() + '/test');
      let cfg = config.get();
      cfg.set('client:test:endpoints', null);
      (function(){
        client = new Client('test');
      }).should.throw('no endpoints configured');

      config.load(process.cwd() + '/test');
      cfg = config.get();
      cfg.set('client:test:transports', null);
      (function(){
        client = new Client('test');
      }).should.throw('no transports configured');
    });
  });
  context('with running server', function(){
    before(function*() {
      let config = {
        proto: '/test/test.proto',
        package: 'test',
        service: 'Test',
        addr: "localhost:50051",
        timeout: 100,
      };
      server = new grpc.Server(config, logger);
      yield server.bind(service);
      yield server.start();
    });
    after(function*() {
      yield server.end();
    });
    describe('connect', function() {
      it('should return a service object with endpoint functions', function*() {
        let service = yield client.connect();
        should.exist(service);
        should.exist(service.test);
        should.ok(isGeneratorFn(service.test));
        should.exist(service.throw);
        should.ok(isGeneratorFn(service.throw));
        should.exist(service.notImplemented);
        should.ok(isGeneratorFn(service.notImplemented));

        // test
        let result = yield service.test({
          value: 'hello',
        });
        should.exist(result);
        should.not.exist(result.error);
        should.exist(result.data);
        should.exist(result.data.result);
        result.data.result.should.equal('welcome');

        // test with timeout and retry
        result = yield service.test({
          value: 'hello',
        }, {timeout:500, retry:2});
        should.exist(result);
        should.not.exist(result.error);
        should.exist(result.data);
        should.exist(result.data.result);
        result.data.result.should.equal('welcome');
      });
    });
    describe('end', function() {
      it('should disconnect from all endpoints', function*() {
        yield client.end();
      });
    })
  });
  context('without a running server', function(){
    describe('connect', function() {
      it('should return a service object with endpoint functions which timeout', function*() {
        let service = yield client.connect();
        should.exist(service);
        should.exist(service.test);
        should.ok(isGeneratorFn(service.test));
        should.exist(service.throw);
        should.ok(isGeneratorFn(service.throw));
        should.exist(service.notImplemented);
        should.ok(isGeneratorFn(service.notImplemented));

        // test
        let result = yield service.test({
          value: 'hello',
        }, {timeout: 100});
        should.exist(result);
        should.exist(result.error);
        if (_.isArray(result.error)) {
          _.forEach(result.error, function(value, key){
            value.should.be.Error();
            value.message.should.equal('call timeout');
          });
        } else {
          result.error.should.be.Error();
          result.error.message.should.equal('call timeout');
        }
        should.not.exist(result.data);
      });
    });
    describe('end', function() {
      it('should disconnect from all endpoints', function*() {
        yield client.end();
      });
    })
  });
});

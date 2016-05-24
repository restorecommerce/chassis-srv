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
var microservice = require('../lib/microservice');
var config = require('../lib/config');
var events = require('../lib/transport/events/events');
var grpc = require('../lib/transport/grpc');
var Server = microservice.Server;

describe('microservice.Server', function() {
  let server;
  let topicName = 'test';
  let topic;
  let eventName = ''
  let service = {
    test: function(request, context) {

    },
    throw: function(request, context) {
      throw new Error('forced error');
    },
    notImplemented: null,
  };
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
    it('should be possible to subscribe to even topics', function*() {
      assert(server.events.subscribe);
      assert(isGeneratorFn(server.events.subscribe));
      topic = yield server.events.subscribe(topicName);
      assert(topic);
      console.log(Object.keys(topic));
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
    });
  });
  describe('calling end', function() {
    it('should stop the server and no longer provide endpoints', function*() {
      yield server.end();
    })
  });
});

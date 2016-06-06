'use strict';

const mocha = require('mocha');
const coMocha = require('co-mocha');
coMocha(mocha);

const should = require('should');
const _ = require('lodash');
const isGeneratorFn = require('is-generator').fn;
const microservice = require('../lib/microservice');
const config = require('../lib/config');
const events = require('../lib/events');
const grpc = require('../lib/transport/provider/grpc');
const Server = microservice.Server;
const Client = microservice.Client;

/* global describe context it before after*/

const service = {
  test(request, context) {
    request.value.should.be.equal('hello');
    return {
      result: 'welcome',
    };
  },
  throw (request, context) {
    throw new Error('forced error');
  },
  notImplemented: null,
};

describe('microservice.Server', () => {
  let server;
  const topicName = 'test';
  let topic;
  it('should be a constructor and have specific prototype functions',
    () => {
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
  describe('constructing the sever', () => {
    it('should throw an error when endpoints config is missing', () => {
      config.load(process.cwd() + '/test');
      const cfg = config.get();
      cfg.set('server:events', undefined);
      cfg.set('server:endpoints', undefined);
      (() => {
        server = new Server();
      }).should.throw('missing endpoints configuration');
    });
    it('should throw an error when transports config is missing', () => {
      config.load(process.cwd() + '/test');
      const cfg = config.get();
      cfg.set('server:events', undefined);
      cfg.set('server:transports', undefined);
      (() => {
        server = new Server();
      }).should.throw('missing transports configuration');
    });
    it('should throw an error when configuration does not exist', () => {
      config.load(process.cwd() + '/test');
      const cfg = config.get();
      cfg.set('server:events', undefined);
      cfg.set('server:endpoints', undefined);
      cfg.set('server:transports', undefined);
      (() => {
        server = new Server();
      }).should.throw('missing server configuration');
    });
    it('should return a server when provided with config for events', () => {
      config.load(process.cwd() + '/test');
      const cfg = config.get();
      cfg.set('server:endpoints', undefined);
      cfg.set('server:transports', undefined);
      server = new Server();
      should.exist(server);
      should.exist(server.logger);
      should.exist(server.logger.log);
      const levels = [
        'silly',
        'verbose',
        'debug',
        'info',
        'warn',
        'error'
      ];
      _.forEach(levels, (level) => {
        should.exist(server.logger[level]);
      });
      should.exist(server.events);
      server.events.should.be.an.instanceof(events.Events);
      should.not.exist(server.transport);
    });
    it('should return a server when provided with config for endpoints',
      () => {
        config.load(process.cwd() + '/test');
        const cfg = config.get();
        cfg.set('server:events', undefined);
        server = new Server();
        should.exist(server);
        should.exist(server.logger);
        should.exist(server.logger.log);
        const levels = [
          'silly',
          'verbose',
          'debug',
          'info',
          'warn',
          'error'
        ];
        _.forEach(levels, (level) => {
          should.exist(server.logger[level]);
        });
        should.not.exist(server.events);
        should.exist(server.transport);
        should.exist(server.transport.grpc);
        server.transport.grpc.should.be.an.instanceof(grpc.Server);
      });
    it('should return a server when provided with correct config', () => {
      config.load(process.cwd() + '/test');
      server = new Server();
      should.exist(server);
      should.exist(server.logger);
      should.exist(server.logger.log);
      const levels = [
        'silly',
        'verbose',
        'debug',
        'info',
        'warn',
        'error'
      ];
      _.forEach(levels, (level) => {
        should.exist(server.logger[level]);
      });
      should.exist(server.events);
      server.events.should.be.an.instanceof(events.Events);
      should.exist(server.transport);
      should.exist(server.transport.grpc);
      server.transport.grpc.should.be.an.instanceof(grpc.Server);
    });
    it('should be possible to get an event topic', function* checkGetEventTopic() {
      should.exist(server.events.topic);
      should.ok(isGeneratorFn(server.events.topic));
      topic = yield server.events.topic(topicName);
      should.exist(topic);
      should.exist(topic.on);
      should.exist(topic.emit);
      should.ok(isGeneratorFn(topic.emit));
      topic.name.should.equal(topicName);
    });
  });
  describe('calling bind', () => {
    it('should wrap a service and create endpoints for each object function',
      function* bindService() {
        yield server.bind(service);
      });
  });
  describe('calling start', () => {
    it('should expose the created endpoints via transports', function* checkEndpoints() {
      yield server.start();

      const cfg = config.get();
      const grpcConfig = cfg.get('client:test:transports:grpc');
      should.exist(grpcConfig);
      should.exist(grpcConfig.service);

      // 'test' endpoint
      const testCfgPath = 'client:test:endpoints:test:publisher:instances:0';
      let instance = cfg.get(testCfgPath);
      const client = new grpc.Client(grpcConfig, server.logger);
      const testF = yield client.makeEndpoint('test', instance);
      let result = yield testF({
        value: 'hello',
      }, {
        test: true,
      });
      should.ifError(result.error);
      should.exist(result.data);
      should.exist(result.data.result);
      result.data.result.should.be.equal('welcome');

      // 'throw' endpoint
      const throwCfgPath = 'client:test:endpoints:throw:publisher:instances:0';
      instance = cfg.get(throwCfgPath);
      const throwF = yield client.makeEndpoint('throw', instance);
      result = yield throwF({
        value: 'hello',
      }, {
        test: true,
      });
      should.exist(result.error);
      result.error.should.be.Error();
      result.error.message.should.equal('internal');
      result.error.details.should.equal('forced error');
      should.not.exist(result.data);

      // 'notImplemented' endpoint
      const nIC = 'client:test:endpoints:notImplemented:publisher:instances:0';
      instance = cfg.get(nIC);
      const notImplementedF = yield client.makeEndpoint('notImplemented',
        instance);
      result = yield notImplementedF({
        value: 'hello',
      }, {
        test: true,
      });
      should.exist(result.error);
      result.error.should.be.Error();
      result.error.message.should.equal('unimplemented');
      should.not.exist(result.data);

      yield client.end();
    });
  });
  describe('calling end', () => {
    it('should stop the server and no longer provide endpoints', function* endServer() {
      yield server.end();
    });
  });
});

describe('microservice.Client', () => {
  let client;
  let server;
  it('should be a constructor and have specific prototype functions',
    () => {
      should.exist(Client.constructor);
      should.exist(Client.prototype.connect);
      should.ok(isGeneratorFn(Client.prototype.connect));
      should.exist(Client.prototype.middleware);
      Client.prototype.middleware.should.have.iterable();
    });
  describe('constructing the client', () => {
    it('should create a client when providing correct configuration',
      () => {
        config.load(process.cwd() + '/test');
        client = new Client('test');
        should.exist(client);
        should.exist(client.logger);
      });
    it('should throw an error when providing no configuration', () => {
      config.load(process.cwd() + '/test');
      const cfg = config.get();
      cfg.set('client:test', null);
      (() => {
        client = new Client('test');
      }).should.throw('no client:test config');
    });
    it('should throw an error when providing with invalid configuration',
      () => {
        config.load(process.cwd() + '/test');
        let cfg = config.get();
        cfg.set('client:test:endpoints', null);
        (() => {
          client = new Client('test');
        }).should.throw('no endpoints configured');

        config.load(process.cwd() + '/test');
        cfg = config.get();
        cfg.set('client:test:transports', null);
        (() => {
          client = new Client('test');
        }).should.throw('no transports configured');
      });
  });
  context('with running server', () => {
    before(function* initServer() {
      const cfg = {
        service: 'test.Test',
        addr: 'localhost:50051',
        timeout: 100,
      };
      server = new grpc.Server(cfg, client.logger);
      yield server.bind(service);
      yield server.start();
    });
    after(function* stopServer() {
      yield server.end();
    });
    describe('connect', () => {
      it('should return a service object with endpoint functions', function* connectToEndpoints() {
        const testService = yield client.connect();
        should.exist(testService);
        should.exist(testService.test);
        should.ok(isGeneratorFn(testService.test));
        should.exist(testService.throw);
        should.ok(isGeneratorFn(testService.throw));
        should.exist(testService.notImplemented);
        should.ok(isGeneratorFn(testService.notImplemented));

        // test
        let result = yield testService.test({
          value: 'hello',
        });
        should.exist(result);
        should.not.exist(result.error);
        should.exist(result.data);
        should.exist(result.data.result);
        result.data.result.should.equal('welcome');

        // test with timeout and retry
        result = yield testService.test({
          value: 'hello',
        }, {
          timeout: 500,
          retry: 2,
        });
        should.exist(result);
        should.not.exist(result.error);
        should.exist(result.data);
        should.exist(result.data.result);
        result.data.result.should.equal('welcome');
      });
    });
    describe('end', () => {
      it('should disconnect from all endpoints', function* disconnect() {
        yield client.end();
      });
    });
  });
  context('without a running server', () => {
    describe('connect', () => {
      it('should return a service object with endpoint functions which timeout',
        function* connectToEndpoints() {
          const testService = yield client.connect();
          should.exist(testService);
          should.exist(testService.test);
          should.ok(isGeneratorFn(testService.test));
          should.exist(testService.throw);
          should.ok(isGeneratorFn(testService.throw));
          should.exist(testService.notImplemented);
          should.ok(isGeneratorFn(testService.notImplemented));

          // test
          const result = yield testService.test({
            value: 'hello',
          }, {
            timeout: 100,
          });
          should.exist(result);
          should.exist(result.error);
          if (_.isArray(result.error)) {
            _.forEach(result.error, (value, key) => {
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
    describe('end', () => {
      it('should disconnect from all endpoints', function* disconn() {
        yield client.end();
      });
    });
  });
});

'use strict';

/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
const mocha = require('mocha');
const coMocha = require('co-mocha');
coMocha(mocha);

const should = require('should');

const logger = require('./logger_test.js');

const chassis = require('../');
const Health = chassis.microservice.plugins.health.Health;
const Server = chassis.microservice.Server;
const Client = chassis.microservice.Client;

/* global describe it beforeEach afterEach*/

describe('binding the Health service', () => {
  let server;
  chassis.config.load(process.cwd() + '/test', logger);
  beforeEach(function* start() {
    const cfg = yield chassis.config.get();
    server = new Server(cfg.get('server'));
    const healthSrv = new Health(server, server.$config);
    yield server.bind('health', healthSrv);
    yield server.start();
  });
  afterEach(function* end() {
    yield server.end();
  });
  describe('provides an endpoint Check', () => {
    describe('when called with an service', () => {
      let health;
      beforeEach(function* init() {
        const cfg = yield chassis.config.get();
        const client = new Client(cfg.get('client:health'));
        health = yield client.connect();
        should.exist(health.check);
      });
      it('should return SERVING for service health', function* checkHealth() {
        // check health service, should serve
        const resp = yield health.check({
          service: 'health',
        });
        should.not.exist(resp.error);
        should.exist(resp.data);
        should.exist(resp.data.status);
        resp.data.status.should.equal('SERVING');
      });
      it('should return NOT_SERVING for service test', function* checkHealth() {
        // check none bound service, should not serve
        const resp = yield health.check({
          service: 'test',
        });
        should.not.exist(resp.error);
        should.exist(resp.data);
        should.exist(resp.data.status);
        resp.data.status.should.equal('NOT_SERVING');
      });
      it('should return error not found for service does_not_exist', function* checkHealth() {
        // check none existing service, should throw error
        const resp = yield health.check({
          service: 'does_not_exist',
        });
        should.not.exist(resp.data);
        should.exist(resp.error);
        resp.error.message.should.equal('not found');
      });
      it('should return SERVING for server', function* checkHealth() {
        // check server, should serve
        const resp = yield health.check({
          service: '',
        });
        should.not.exist(resp.error);
        should.exist(resp.data);
        should.exist(resp.data.status);
        resp.data.status.should.equal('SERVING');
      });
    });
  });
});

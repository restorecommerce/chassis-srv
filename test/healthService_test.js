'use strict';

const mocha = require('mocha');
const coMocha = require('co-mocha');
coMocha(mocha);

const should = require('should');

const chassis = require('../');
const Health = chassis.service.health.Health;
const Server = chassis.microservice.Server;
const Client = chassis.microservice.Client;

/* global describe it beforeEach afterEach*/

describe('binding the Health service', () => {
  let server;
  beforeEach(function* start() {
    server = new Server();
    const healthSrv = new Health(server, server.$config);
    yield server.bind('health', healthSrv);
    yield server.start();
  });
  afterEach(function* end() {
    yield server.end();
  });
  describe('provides an endpoint Check', () => {
    describe('when called with an service', () => {
      it('should return the status', function* checkHealth() {
        const client = new Client('health');
        const health = yield client.connect();
        should.exist(health.check);

        // check health service, should serve
        let resp = yield health.check({
          service: 'health',
        });
        should.not.exist(resp.error);
        should.exist(resp.data);
        should.exist(resp.data.status);
        resp.data.status.should.equal('SERVING');

        // check none bound service, should not serve
        resp = yield health.check({
          service: 'test',
        });
        should.not.exist(resp.error);
        should.exist(resp.data);
        should.exist(resp.data.status);
        resp.data.status.should.equal('NOT_SERVING');

        // check none existing service, should throw error
        resp = yield health.check({
          service: 'does_not_exist',
        });
        should.not.exist(resp.data);
        should.exist(resp.error);
        resp.error.message.should.equal('not found');

        // check server, should serve
        resp = yield health.check({
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

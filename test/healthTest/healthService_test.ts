'use strict';

/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import * as mocha from 'mocha';
import * as coMocha from 'co-mocha';

coMocha(mocha);

import * as should from 'should';
const logger = require('./../logger_test.ts');
import * as chassis from '../../lib';
import { Health } from '../../lib';

import { Client } from '@restorecommerce/grpc-client';
import { Server } from '../../lib/microservice/server';

/* global describe it beforeEach afterEach*/

describe('binding the Health service', () => {
  let server: Server;
  chassis.config.load(process.cwd() + '/test', logger);
  before(function* start(): any {
    const cfg = yield chassis.config.get();
    server = new Server(cfg.get('server'));
    const healthSrv: Health = new Health(server, server.config);
    yield server.bind('health', healthSrv);
    yield server.start();
  });
  after(function* end(): any {
    yield server.end();
  });
  describe('provides an endpoint Check', () => {
    describe('when called with an service', () => {
      let health: any;
      before(function* init() {
        const cfg = yield chassis.config.get();
        const client: Client = new Client(cfg.get('client:health'));
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

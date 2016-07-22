'use strict';

/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
const mocha = require('mocha');
const coMocha = require('co-mocha');
coMocha(mocha);

const should = require('should');
const logger = require('./logger_test.js');

const chassis = require('../');
const config = chassis.config;
const cache = chassis.cache;

/* global describe it beforeEach */

describe('cache', () => {
  beforeEach(() => {
    config.load(process.cwd() + '/test', logger);
  });
  describe('get', () => {
    it('should return one store with the config for one store', function* getOne() {
      const c = yield cache.get('one', logger);
      should.exist(c);
      should.exist(c.get);
    });
    it('should return one multiCaching store with the config for many stores', function* getMany() {
      const c = yield cache.get('many', logger);
      should.exist(c);
      should.exist(c.get);
    });
  });
});

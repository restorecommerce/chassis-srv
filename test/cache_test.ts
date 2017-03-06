'use strict';

/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/*  eslint-disable require-yield */
import * as mocha from 'mocha';
import * as coMocha from 'co-mocha';

coMocha(mocha);

import * as should from 'should';
const logger = require('./logger_test.js');

import * as chassis from '../lib';
import * as config from '../lib/config';
import * as cache from '../lib/cache';

/* global describe it beforeEach */

describe('cache', () => {
  beforeEach(function* setup() {
    yield config.load(process.cwd() + '/test', logger);
  });
  describe('get', () => {
    it('should return one store with the config for one store', function* getOne() {
      const cfg = yield config.get();
      const c = yield cache.get(cfg.get('cache:one'), logger);
      should.exist(c);
      should.exist(c.get);

      yield c.set('test', 'testvalue');
      const res = yield c.get('test');
      res.should.equal('testvalue');
    });
    it('should return one multiCaching store with the config for many stores', function* getMany() {
      const cfg = yield config.get();
      const c = yield cache.get(cfg.get('cache:many'), logger);
      should.exist(c);
      should.exist(c.get);

      yield c.set('test', 'testvalue');
      const res = yield c.get('test');
      res.should.equal('testvalue');
    });
  });
});

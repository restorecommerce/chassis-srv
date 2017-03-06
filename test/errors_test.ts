'use strict';

/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import * as mocha from 'mocha';
import * as coMocha from 'co-mocha';

coMocha(mocha);

import * as should from 'should';
import * as _ from 'lodash';

// const errors = require('../lib').microservice.errors;
import {errors} from '../lib';

/* global describe it */

describe('error', () => {
  _.forEach(errors, (Error, name) => {
    describe(name, () => {
      it('should be an Error', () => {
        const error = new Error();
        should.exist(error);
        error.should.be.Error();
        error.name.should.equal(name);
        should.exist(error.stack);
      });
    });
  });
});

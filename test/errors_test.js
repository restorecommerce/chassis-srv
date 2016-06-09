'use strict';

const mocha = require('mocha');
const coMocha = require('co-mocha');
coMocha(mocha);

const should = require('should');
const _ = require('lodash');

const errors = require('../').errors;

describe('error', () => {
  _.forEach(errors, function(Error, name){
    describe(name, () => {
      it('should be an Error', () => {
        const error = new Error();
        error.should.be.Error();
      });
    });
  });
});

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
var config = require('../lib/config');
var database = require('../lib/database');

var providers = [{
  name: 'gss',
  loadInvalidConfig: function(){
    config.load(process.cwd() + '/test');
    let cfg = config.get();
    cfg.set('database:gss:database', 'database_does_not_exist');
  }
}];
let logger = {
  log: function() {
    let level = arguments[0].toLowerCase();
    if (level == 'error') {
      let args = Array.prototype.splice.apply(arguments, [1]);
      console.log(level, args);
    }
  },
};
providers.forEach(function(providerCfg) {
  describe('calling database.get', function() {
    context(util.format('with database provider %s', providerCfg.name), function() {
      config.load(process.cwd() + '/test');
      it('should return a database connection', function*() {
        let db = yield database.get(providerCfg.name, logger);
        should.exist(db);
      });
      context('and invalid configuration', function(){
        it('should throw an error', function*(){
          providerCfg.loadInvalidConfig();
          let err;
          let db = yield co(function*() {
            return yield database.get(providerCfg.name, logger);
          }).then(function(result) {
            assert.ok(false, 'should not call then');
          }).catch(function(e) {
            err = e;
          })
          should.not.exist(db);
          should.exist(err);
          err.message.should.not.equal('should not call then');
        });
      });
    });
  });
});

'use strict';

var mocha = require('mocha')
var coMocha = require('co-mocha')
coMocha(mocha)

var assert = require('assert');
var should = require('should');
var util = require('util');
var co = require('co');
var _ = require('lodash');
var isGenerator = require('is-generator');
var isGeneratorFn = require('is-generator').fn

var Arangojs = require('arangojs');

var config = require('../lib/config');
var database = require('../lib/database');

var providers = [{
  name: 'arango',
  init: function(cb){
    config.load(process.cwd() + '/test');
    let cfg = config.get();
    let dbHost = cfg.get('database:arango:host');
    let dbPort = cfg.get('database:arango:port');
    let dbName = cfg.get('database:arango:database');
    let db = new Arangojs('http://' + dbHost + ':' + dbPort);
    db.dropDatabase(dbName).then(function(result){
      if (result.error) {
        cb(result.error);
        return;
      }
      cb();
    }).catch(function(err){
      if (err.message === 'database not found') {
        cb();
        return;
      }
      cb(err);
    });
  },
  loadInvalidConfig: function(){
    config.load(process.cwd() + '/test');
    let cfg = config.get();
    cfg.set('database:arango:autoCreate', false);
    cfg.set('database:arango:database', 'database_does_not_exist');
  }
}];
let logger = {
  log: function() {},
};
providers.forEach(function(providerCfg) {
  before(function(done){
    providerCfg.init(done);
  });
  describe('calling database.get', function() {
    context(util.format('with database provider %s', providerCfg.name), function() {
      context('and valid configuration', function(){
        let collection = 'test';
        let document = {
          id: '/test/test',
        };
        let db;
        config.load(process.cwd() + '/test');
        it('should return a database connection', function*() {
          db = yield database.get(providerCfg.name, logger);
          should.exist(db);
        });
        describe('inserting a document', function(){
          it('should store a document', function*(){
            yield db.insert(collection, document);
          });
          it('should be findable', function*(){
            let result = yield db.findByID(collection, document.id);
            result = result[0];
            result.should.deepEqual(document);

            result = yield db.find(collection, {id:document.id});
            result = result[0];
            result.should.deepEqual(document);
          });
          it('should be updatable', function*(){
            let newDoc = _.clone(document);
            newDoc.value = 'new';
            yield db.update(collection, newDoc);
            let result = yield db.findByID(collection, document.id);
            result = result[0];
            result.should.deepEqual(newDoc);
          });
          it('should be deletable', function*(){
            yield db.delete(collection, document);
            let result = yield db.findByID(collection, document.id);
            result.should.be.Array();
            result.should.be.length(0);
          });
        });
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

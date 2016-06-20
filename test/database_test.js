'use strict';

const mocha = require('mocha');
const coMocha = require('co-mocha');
coMocha(mocha);

const should = require('should');
const util = require('util');
const co = require('co');
const _ = require('lodash');
const logger = require('./logger_test.js');
const Arangojs = require('arangojs');

const config = require('../lib/config');
const database = require('../lib/database');

/* global describe context it before*/

const providers = [{
  name: 'arango',
  init: function init(cb) {
    config.load(process.cwd() + '/test', logger);
    const cfg = config.get();
    const dbHost = cfg.get('database:arango:host');
    const dbPort = cfg.get('database:arango:port');
    const dbName = cfg.get('database:arango:database');
    const db = new Arangojs('http://' + dbHost + ':' + dbPort);
    db.dropDatabase(dbName).then((result) => {
      if (result.error) {
        cb(result.error);
        return;
      }
      cb();
    }).catch((err) => {
      if (err.message === 'database not found') {
        cb();
        return;
      }
      cb(err);
    });
  },
  loadInvalidConfig: function loadInvalidConfig() {
    config.load(process.cwd() + '/test', logger);
    const cfg = config.get();
    cfg.set('database:arango:autoCreate', false);
    cfg.set('database:arango:database', 'database_does_not_exist');
  }
}, {
    name: 'nedb',
    init: function init(cb) {
      config.load(process.cwd() + '/test', logger);
      cb();
    },
    loadInvalidConfig: function loadInvalidConfig() {
      config.load(process.cwd() + '/test', logger);
      const cfg = config.get();
      cfg.set('database:nedb:test:fileName', "path/to/file");
    }
  }
];
providers.forEach((providerCfg) => {
  before((done) => {
    providerCfg.init(done);
  });
  describe('calling database.get', () => {
    context(util.format('with database provider %s', providerCfg.name),
      () => {
        context('and valid configuration', () => {
          const collection = 'test';
          const document = {
            id: '/test/test',
            name: 'test',
          };
          let db;
          config.load(process.cwd() + '/test', logger);
          it('should return a database connection', function* getDB() {
            db = yield database.get(providerCfg.name, logger);
            should.exist(db);
          });
          describe('inserting a document', () => {
            it('should store a document', function* insertDocument() {
              yield db.insert(collection, document);
            });
            it('should be findable', function* checkFind() {
              let result = yield db.findByID(collection, document.id);
              result = result[0];
              result.should.deepEqual(document);

              result = yield db.find(collection, {
                id: document.id,
              });
              result = result[0];
              result.should.deepEqual(document);

              result = yield db.find(collection, {
                $or: [{ id: document.id },
                  { value: 'new' }]
              });
              result = result[0];
              result.should.deepEqual(document);

              result = yield db.find(collection, {
                $or: [
                  {
                    id: 'wrong/id'
                  },
                  { name: 'test' }
                ]
              });
              result = result[0];
              result.should.deepEqual(document);

              result = yield db.find(collection, {
                id: document.id,
              }, {
                  limit: 1
                });
              result = result[0];
              result.should.deepEqual(document);

              result = yield db.find(collection, {
                id: document.id,
              }, {
                  limit: 1,
                  offset: 1,
                });
              result.should.be.empty();
            });
            it('should be updatable', function* checkUpdate() {
              const newDoc = _.clone(document);
              newDoc.value = 'new';
              yield db.update(collection, {
                id: document.id,
              }, newDoc);
              let result = yield db.findByID(collection, document.id);
              result = result[0];
              result.should.deepEqual(newDoc);
            });
            it('should be deletable', function* deleteDocument() {
              yield db.delete(collection, {
                id: document.id
              });
              const result = yield db.findByID(collection, document.id);
              result.should.be.Array();
              result.should.be.length(0);
            });
          });
        });
        context('and invalid configuration', () => {
          it('should throw an error', function* checkInvalidConfiguration() {
            const errF = logger.error;
            logger.error = function empty() { };
            providerCfg.loadInvalidConfig();
            let err;
            const db = yield co(function* getDB() {
              return yield database.get(providerCfg.name, logger);
            }).then((result) => {
              should.ok(false, 'should not call then');
            }).catch((e) => {
              err = e;
            });
            should.not.exist(db);
            should.exist(err);
            err.message.should.not.equal('should not call then');
            logger.error = errF;
          });
        });
      });
  });
});

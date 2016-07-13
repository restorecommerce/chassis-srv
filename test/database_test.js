'use strict';

/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
const mocha = require('mocha');
const coMocha = require('co-mocha');
coMocha(mocha);

const should = require('should');
const _ = require('lodash');
const logger = require('./logger_test.js');

const Arangojs = require('arangojs');

const chassis = require('../');
const config = chassis.config;
const database = chassis.database;

/* global describe context it beforeEach */

const providers = [
  {
    name: 'arango',
    init: function* init() {
      config.load(process.cwd() + '/test', logger);
      const cfg = config.get();
      const dbHost = cfg.get('database:arango:host');
      const dbPort = cfg.get('database:arango:port');
      const dbName = cfg.get('database:arango:database');
      const db = new Arangojs('http://' + dbHost + ':' + dbPort);
      yield db.dropDatabase(dbName).then((result) => {
        if (result.error) {
          throw result.error;
        }
        return result;
      }).catch((err) => {
        if (err.message === 'database not found') {
          return {};
        }
        throw err;
      });
      return yield database.get(this.name, logger);
    }
  },
  {
    name: 'nedb',
    init: function* init() {
      config.load(process.cwd() + '/test', logger);
      return yield database.get(this.name, logger);
    }
  }];
providers.forEach((providerCfg) => {
  describe(`with database provider ${providerCfg.name}`, () => {
    testProvider(providerCfg);
  });
});

function testProvider(providerCfg) {
  let db;
  const collection = 'test';
  const testData = [
    { id: '/test/sort0', value: 'c', include: true },
    { id: '/test/sort1', include: false },
    { id: '/test/sort2', include: false },
    { id: '/test/sort3', value: 'a', include: true },
    { id: '/test/sort4', value: 'b', include: true },
    { id: '/test/sort5', include: false },
  ];
  const document = testData[4];
  beforeEach(function* initDB() {
    db = yield providerCfg.init();
    yield db.insert(collection, testData);
    should.exist(db);
  });
  describe('upsert', () => {
    it('should insert a new document if it does not exist', function* checkUpsert() {
      const newDoc = {
        id: '/test/testupsert',
        name: 'test',
      };
      let result = yield db.upsert(collection, newDoc);
      should.exist(result);
      result.should.deepEqual([newDoc]);
      newDoc.name = 'changed';
      result = yield db.upsert(collection, newDoc);
      result.should.deepEqual([newDoc]);
    });
  });
  describe('count', () => {
    it(`should return the number of documents
    in the collection with blank filter`, function* checkCount() {
      const result = yield db.count(collection, {});
      should.exist(result);
      result.should.equal(testData.length);
    });
    it('should return one for filtering based on id', function* checkCount() {
      const result = yield db.count(collection, { id: testData[0].id });
      should.exist(result);
      result.should.equal(1);
    });
  });
  describe('truncate', () => {
    it('should delete all collection', function* checkTruncate() {
      yield db.truncate();
      /*
      const result = yield db.count(collection, {});
      should.exist(result);
      result.should.equal(0);
      */
    });
    it('should delete all documents in provided collection', function* checkTruncate() {
      yield db.truncate(collection);
      /*
      const result = yield db.count(collection, {});
      should.exist(result);
      result.should.equal(0);
      */
    });
  });
  describe('findByID', () => {
    it('should find documents', function* checkFind() {
      const result = yield db.findByID(collection, document.id);
      should.exist(result);
      result.should.be.length(1);
      result[0].should.deepEqual(document);
    });
  });
  describe('find', () => {
    context('with id filter', () => {
      it('should return a document', function* checkFind() {
        const result = yield db.find(collection, {
          id: document.id,
        });
        result.should.be.length(1);
        result[0].should.deepEqual(document);
      });
    });
    context('with sort', () => {
      it('should return documents sorted', function* checkSorting() {
        const result = yield db.find(collection,
          { include: true },
          { sort: { value: 1 } }); // sort ascending
        should.exist(result);
        result.should.deepEqual([testData[3], testData[4], testData[0]]);
      });
    });
    context('with field limiting', () => {
      it('should return documents with selected fields', function* checkSorting() {
        const result = yield db.find(collection,
          { include: true },
          { fields: { include: 0 } }); // exclude field include
        should.exist(result);
        const resultKeep = yield db.find(collection,
          { include: true },
          { fields: { id: 1, value: 1 } }); // exclude field include
        resultKeep.should.deepEqual(result);
        const compareData = _.map([testData[3], testData[4], testData[0]], (e) => {
          _.unset(e, 'include');
          return e;
        });
        _.sortBy(result, 'id').should.deepEqual(_.sortBy(compareData, 'id'));
      });
    });
    context('with limit', () => {
      it('should return a document', function* checkFind() {
        const result = yield db.find(collection, {
          id: document.id,
        },
          {
            limit: 1
          });
        should.exist(result);
        result.should.be.length(1);
        result[0].should.deepEqual(document);
      });
    });
    context('with filter operator', () => {
      it('should return a document', function* checkFind() {
        let result = yield db.find(collection, {
          $or: [
            { id: document.id },
            { value: 'new' }
          ]
        });
        should.exist(result);
        result.should.be.length(1);
        result[0].should.deepEqual(document);

        result = yield db.find(collection, {
          $or: [
            {
              id: document.id,
            },
            {
              $and: [
                {
                  name: {
                    $in: ['test'],
                  },
                },
                {
                  value: {
                    $not: {
                      $gt: 10,
                    },
                  },
                },
              ],
            },
          ],
        });
        should.exist(result);
        result.should.be.length(1);
        result[0].should.deepEqual(document);

        result = yield db.find(collection, {
          id: document.id,
        },
          {
            limit: 1,
            offset: 1,
          });
        result.should.be.empty();

        result = yield db.find(collection, {
          id: {
            $startswith: '/test',
          },
        });
        result.should.be.length(testData.length);

        result = yield db.find(collection, {
          id: {
            $endswith: '0',
          },
        });
        result.should.be.length(1);
        result[0].should.deepEqual(testData[0]);
      });
    });
  });
  describe('inserting a document', () => {
    it('should store a document', function* insertDocument() {
      const newDoc = {
        id: '/test/testnew',
        name: 'test',
      };
      yield db.insert(collection, newDoc);
      const result = yield db.findByID(collection, newDoc.id);
      result[0].should.deepEqual(newDoc);
    });
  });
  describe('update', () => {
    it('should update document', function* checkUpdate() {
      const newDoc = _.clone(document);
      newDoc.value = 'new';
      yield db.update(collection, {
        id: document.id,
      }, newDoc);
      let result = yield db.findByID(collection, document.id);
      result = result[0];
      result.should.deepEqual(newDoc);
    });
  });
  describe('delete', () => {
    it('should delete document', function* checkDelete() {
      yield db.delete(collection, {
        id: document.id
      });
      const result = yield db.findByID(collection, document.id);
      result.should.be.Array();
      result.should.be.length(0);
    });
  });
}

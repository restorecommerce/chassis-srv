'use strict';

import * as co from 'co';
import * as should from 'should';
import * as _ from 'lodash';
import logger from './logger_test.js';
import { Database as Arangojs } from 'arangojs';
import * as chassis from '../lib';
const config = chassis.config;
const database = chassis.database;

/* global describe context it beforeEach */

const providers = [
  {
    name: 'arango',
    init: async function init() {
      await config.load(process.cwd() + '/test', logger);
      const cfg = await config.get();
      const dbHost: string = cfg.get('database:arango:host');
      const dbPort: string = cfg.get('database:arango:port');
      const dbName: string = cfg.get('database:arango:database');
      const db = new Arangojs('http://' + dbHost + ':' + dbPort);
      await co(db.dropDatabase(dbName)).then((result) => {
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
      return await co(database.get(cfg.get('database:arango'), logger));
    }
  },
  {
    name: 'nedb',
    init: async function init() {
      await config.load(process.cwd() + '/test', logger);
      const cfg = await config.get();
      return await co(database.get(cfg.get('database:nedb'), logger));
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
  beforeEach(async function initDB() {
    db = await providerCfg.init();
    await co(db.insert(collection, testData));
    should.exist(db);

    const result = await co(db.count(collection, {}));
  });
  describe('upsert', () => {
    it('should insert a new document if it does not exist', async function checkUpsert() {
      const newDoc = {
        id: '/test/testupsert',
        name: 'test',
      };
      let result = await co(db.upsert(collection, newDoc));
      should.exist(result);
      result.should.deepEqual([newDoc]);
      newDoc.name = 'changed';
      result = await co(db.upsert(collection, newDoc));
      result.should.deepEqual([newDoc]);
    });
  });
  describe('count', () => {
    it(`should return the number of documents
    in the collection with blank filter`, async function checkCount() {
        const result = await co(db.count(collection, {}));
        should.exist(result);
        result.should.equal(testData.length);
      });
    it('should return one for filtering based on id', async function checkCount() {
      const result = await co(db.count(collection, { id: testData[0].id }));
      should.exist(result);
      result.should.equal(1);
    });
  });
  describe('truncate', () => {
    it('should delete all collection', async function checkTruncate() {
      await co(db.truncate());
      const result = await co(db.count(collection, {}));
      should.exist(result);
      result.should.equal(0);
    });
    it('should delete all documents in provided collection', async function checkTruncate() {
      await co(db.truncate(collection));
      const result = await co(db.count(collection, {}));
      should.exist(result);
      result.should.equal(0);
    });
  });
  describe('findByID', () => {
    it('should find documents', async function checkFind() {
      const result = await co(db.findByID(collection, document.id));
      should.exist(result);
      result.should.be.length(1);
      result[0].should.deepEqual(document);
    });
  });
  describe('find', () => {
    context('with id filter', () => {
      it('should return a document', async function checkFind() {
        const result = await co(db.find(collection, {
          id: document.id,
        }));
        result.should.be.length(1);
        result[0].should.deepEqual(document);
      });
    });
    context('with sort', () => {
      it('should return documents sorted', async function checkSorting() {
        const result = await co(db.find(collection,
          { include: true },
          { sort: { value: 1 } })); // sort ascending
        should.exist(result);
        result.should.deepEqual([testData[3], testData[4], testData[0]]);
      });
    });
    context('with field limiting', () => {
      it('should return documents with selected fields', async function checkSorting() {
        const result = await co(db.find(collection,
          { include: true },
          { fields: { include: 0 } })); // exclude field include
        should.exist(result);
        const resultKeep = await co(db.find(collection,
          { include: true },
          { fields: { id: 1, value: 1 } })); // exclude field include
        resultKeep.should.deepEqual(result);
        const compareData = _.map([testData[3], testData[4], testData[0]], (e) => {
          _.unset(e, 'include');
          return e;
        });
        _.sortBy(result, 'id').should.deepEqual(_.sortBy(compareData, 'id'));
      });
    });
    context('with limit', () => {
      it('should return a document', async function checkFind() {
        const result: Object = await co(db.find(collection, {
          id: document.id,
        },
          {
            limit: 1
          }));
        should.exist(result);
        result.should.be.length(1);
        result[0].should.deepEqual(document);
      });
    });
    context('with filter operator', () => {
      it('should return a document', async function checkFind() {
        let result = await co(db.find(collection, {
          $or: [
            { id: document.id },
            { value: 'new' }
          ]
        }));
        should.exist(result);
        result.should.be.length(1);
        result[0].should.deepEqual(document);

        result = await co(db.find(collection, {
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
        }));
        should.exist(result);
        result.should.be.length(1);
        result[0].should.deepEqual(document);

        result = await co(db.find(collection, {
          id: document.id,
        },
          {
            limit: 1,
            offset: 1,
          }));
        result.should.be.empty();

        result = await co(db.find(collection, {
          id: {
            $startswith: '/test',
          },
        }));
        result.should.be.length(testData.length);

        result = await co(db.find(collection, {
          id: {
            $endswith: '0',
          },
        }));
        result.should.be.length(1);
        result[0].should.deepEqual(testData[0]);

        result = await co(db.find(collection, {
          value: {
            $isEmpty: null,
          },
        }));
        // 3 fields with value as an empty field
        should.not.exist(result.error);
      });
    });
  });
  describe('inserting a document', () => {
    it('should store a document', async function insertDocument() {
      const newDoc = {
        id: '/test/testnew',
        name: 'test',
      };
      await co(db.insert(collection, newDoc));
      const result = await co(db.findByID(collection, newDoc.id));
      result[0].should.deepEqual(newDoc);
    });
  });
  describe('update', () => {
    it('should update document', async function checkUpdate() {
      const newDoc = _.clone(document);
      newDoc.value = 'new';
      await co(db.update(collection, {
        id: document.id,
      }, newDoc));
      let result = await co(db.findByID(collection, document.id));
      result = result[0];
      result.should.deepEqual(newDoc);
    });
  });
  describe('delete', () => {
    it('should delete document', async function checkDelete() {
      await co(db.delete(collection, {
        id: document.id
      }));
      const result = await co(db.findByID(collection, document.id));
      result.should.be.Array();
      result.should.be.length(0);
    });
  });
}

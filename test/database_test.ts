import * as should from 'should';
import * as _ from 'lodash';
import logger from './logger_test.js';
import { Database } from 'arangojs';
import * as chassis from '../lib';
const config = chassis.config;
const database = chassis.database;

/* global describe context it beforeEach */

const providers = [
  {
    name: 'arango',
    init: async function init(): Promise<any> {
      await config.load(process.cwd() + '/test', logger);
      const cfg = await config.get();
      const dbHost: string = cfg.get('database:arango:host');
      const dbPort: string = cfg.get('database:arango:port');
      const dbName: string = cfg.get('database:arango:database');
      const db = new Database('http://' + dbHost + ':' + dbPort);
      await db.dropDatabase(dbName);
      return database.get(cfg.get('database:arango'), logger);
    }
  },
  {
    name: 'nedb',
    init: async function init(): Promise<any> {
      await config.load(process.cwd() + '/test', logger);
      const cfg = await config.get();
      return database.get(cfg.get('database:nedb'), logger);
    }
  }
];
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
    await db.insert(collection, testData);
    should.exist(db);
    const result = await db.count(collection, {});
  });
  describe('upsert', () => {
    it('should insert a new document if it does not exist', async function checkUpsert() {
      const newDoc = {
        id: '/test/testupsert',
        name: 'test',
      };
      let result = await db.upsert(collection, newDoc);
      should.exist(result);
      result.should.deepEqual([newDoc]);
      newDoc.name = 'changed';
      result = await db.upsert(collection, newDoc);
      result.should.deepEqual([newDoc]);
    });
  });
  describe('count', () => {
    it(`should return the number of documents
    in the collection with blank filter`, async function checkCount() {
        const result = await db.count(collection, {});
        should.exist(result);
        result.should.equal(testData.length);
      });
    it('should return one for filtering based on id', async function checkCount() {
      const result = await db.count(collection, { id: testData[0].id });
      should.exist(result);
      result.should.equal(1);
    });
  });
  describe('truncate', () => {
    it('should delete all collection', async function checkTruncate() {
      await db.truncate();
      const result = await db.count(collection, {});
      should.exist(result);
      result.should.equal(0);
    });
    it('should delete all documents in provided collection', async function checkTruncate() {
      await db.truncate(collection);
      const result = await db.count(collection, {});
      should.exist(result);
      result.should.equal(0);
    });
  });
  describe('findByID', () => {
    it('should find documents', async function checkFind() {
      const result = await db.findByID(collection, document.id);
      should.exist(result);
      result.should.be.length(1);
      result[0].should.deepEqual(document);
    });
  });
  describe('find', () => {
    context('with id filter', () => {
      it('should return a document', async function checkFind() {
        const result = await db.find(collection, {
          id: document.id,
        });
        result.should.be.length(1);
        result[0].should.deepEqual(document);
      });
    });
    context('with sort', () => {
      it('should return documents sorted in ascending order',
        async function checkSortAsc() {
          let sortOrderKey;
          if (providerCfg.name == 'arango') {
            sortOrderKey = 'ASC';
          } else if (providerCfg.name == 'nedb') {
            sortOrderKey = 1;
          }
          const result = await db.find(collection,
            { include: true },
            { sort: { value: sortOrderKey } }); // sort ascending
          should.exist(result);
          result.should.deepEqual([testData[3], testData[4], testData[0]]);
        });
      it('should return documents sorted in descending order',
        async function checkSortAsc() {
          let sortOrderKey;
          if (providerCfg.name == 'arango') {
            sortOrderKey = 'DESC';
          } else if (providerCfg.name == 'nedb') {
            sortOrderKey = -1;
          }
          const result = await db.find(collection,
            { include: true },
            { sort: { value: sortOrderKey } }); // sort descending
          should.exist(result);
          result.should.deepEqual([testData[0], testData[4], testData[3]]);
        });
    });
    context('with field limiting', () => {
      it('should return documents with selected fields', async function checkSorting() {
        const result = await db.find(collection,
          { include: true },
          // 0 is exclude and 1 is to include that particular key
          { fields: { include: 0 } }); // exclude field 'include'
        should.exist(result);
        const resultKeep = await db.find(collection,
          { include: true },
          { fields: { id: 1, value: 1 } }); // include only id and value fields
        resultKeep.should.deepEqual(result);
        const compareData = _.map([testData[3], testData[4], testData[0]], (e) => {
          _.unset(e, 'include');
          return e;
        });
        _.sortBy(result, 'id').should.deepEqual(_.sortBy(compareData, 'id'));
      });
    });
    context('with limit', () => {
      it('should return one document', async function checkFind() {
        const result: Object = await db.find(collection, {
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
  });
  context('with filter operator', () => {
    it('should return a document', async function checkFind() {
      let result = await db.find(collection, {
        $or: [
          { id: document.id },
          { value: 'new' }
        ]
      });
      should.exist(result);
      result.should.be.length(1);
      result[0].should.deepEqual(document);

      result = await db.find(collection, {
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

      result = await db.find(collection, {
        id: document.id,
      },
        {
          limit: 1,
          offset: 1,
        });
      result.should.be.empty();

      result = await db.find(collection, {
        id: {
          $startswith: '/test',
        },
      });
      result.should.be.length(testData.length);

      result = await db.find(collection, {
        id: {
          $endswith: '0',
        },
      });
      result.should.be.length(1);
      result[0].should.deepEqual(testData[0]);

      result = await db.find(collection, {
        value: {
          $isEmpty: null,
        },
      });
      // 3 fields with value as an empty field
      should.not.exist(result.error);
    });
  });
  describe('inserting a document', () => {
    it('should store a document', async function insertDocument() {
      const newDoc = {
        id: '/test/testnew',
        name: 'test',
      };
      await db.insert(collection, newDoc);
      const result = await db.findByID(collection, newDoc.id);
      result[0].should.deepEqual(newDoc);
    });
  });
  describe('update', () => {
    it('should update document', async function checkUpdate() {
      const newDoc = _.clone(document);
      newDoc.value = 'new';
      await db.update(collection, {
        id: document.id,
      }, newDoc);
      let result = await db.findByID(collection, document.id);
      result = result[0];
      result.should.deepEqual(newDoc);
    });
  });
  describe('delete', () => {
    it('should delete document', async function checkDelete() {
      await db.delete(collection, {
        id: document.id
      });
      const result = await db.findByID(collection, document.id);
      result.should.be.Array();
      result.should.be.length(0);
    });
  });
  describe('query by date', () => {
    it('should be able to query document by its time stamp', async function
    queryDocByTimeStamp() {
      const currentDate = new Date();
      const timeStamp1 = currentDate.setFullYear(currentDate.getFullYear());
      const timeStamp2 = currentDate.setFullYear(currentDate.getFullYear() + 1);
      const timeStamp3 = currentDate.setFullYear(currentDate.getFullYear() + 2);
      const timeData = [
        { id: "a", created: timeStamp1 },
        { id: "b", created: timeStamp2 },
        { id: "c", created: timeStamp3 }
      ];
      await db.insert(collection, timeData);
      // should return first two documents
      let result = await db.find(collection, {
        $and: [
          {
            created: {
              $gte: timeStamp1
            }
          },
          {
            created: {
              $lte: timeStamp2
            }
          }
        ],
      });
      should.exist(result);
      result.should.be.Array();
      result.should.be.length(2);
      timeData.splice(2, 1);
      result = _.sortBy(result, [function (o) { return o.id; }]);
      result.should.deepEqual(timeData);
      // truncate test DB
      await db.truncate();
    });
  });
}

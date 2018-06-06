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
  }
];
providers.forEach((providerCfg) => {
  describe(`with database provider ${providerCfg.name}`, () => {
    testProvider(providerCfg);
  });
});

function testProvider(providerCfg) {
  let db;
  let vertexCollectionName = 'person';
  let edgeCollectionName = 'knows';
  before(async function initDB() {
    db = await providerCfg.init();
    // create graph with a graph name
    const graph = await db.createGraphDB('test-graph');
    // create person vertex collection
    await db.addVertexCollection(vertexCollectionName);
    // create edge definition edgeCollectionName, fromVerticeCollection,
    // toVerticeCollection
    await db.addEdgeDefinition(edgeCollectionName, vertexCollectionName, vertexCollectionName);
    should.exist(db);
  });
  describe('Graphs Collection API', () => {
    let result0;
    let result1;
    let result2;
    let result3;
    let result4;
    let edgeResult;
    it('should create a vertex collection and insert data into it', async function
    createVertices() {
      const vertices = [
        { name: 'Alice', id: 'a' },
        { name: 'Bob', id: 'b' },
        { name: 'Charlie', id: 'c' },
        { name: 'Dave', id: 'd' },
        { name: 'Eve', id: 'e' }
      ];
      result0 = await db.createVertex(vertexCollectionName, vertices[0]);
      result1 = await db.createVertex(vertexCollectionName, vertices[1]);
      result2 = await db.createVertex(vertexCollectionName, vertices[2]);
      result3 = await db.createVertex(vertexCollectionName, vertices[3]);
      result4 = await db.createVertex(vertexCollectionName, vertices[4]);

      // verify the data from DB
      let insertedVertices = await db.find('person');
      insertedVertices = _.sortBy(insertedVertices, [function (o) { return o.name; }]);
      should.exist(insertedVertices);
      insertedVertices.should.deepEqual(vertices);
    });
    it('should create an edge collection and insert data into it', async function
      createEdges() {
      let edges: any = [
        { info: 'Alice knows Bob', _from: result0._id, _to: result1._id, id: 'a' },
        { info: 'Bob knows Charlie', _from: result1._id, _to: result2._id, id: 'b'},
        { info: 'Bob knows Dave', _from: result1._id, _to: result3._id, id: 'c' },
        { info: 'Eve knows Alice', _from: result4._id, _to: result0._id, id: 'd' },
        { info: 'Eve knows Bob', _from: result4._id, _to: result1._id, id: 'e' }
      ];
      await db.createEdge(edgeCollectionName, edges[0]);
      await db.createEdge(edgeCollectionName, edges[1]);
      await db.createEdge(edgeCollectionName, edges[2]);
      await db.createEdge(edgeCollectionName, edges[3]);
      edgeResult = await db.createEdge(edgeCollectionName, edges[4]);
      let insertedEdges: any = await db.find('knows');
      edges = _.sortBy(edges, [function (o) { return o.info; }]);
      insertedEdges = _.sortBy(insertedEdges, [function (o) { return o.info; }]);
      should.exist(insertedEdges);
      insertedEdges.should.deepEqual(edges);
    });
    it('should verify incoming and outgoing edges', async function verfiyEdges() {
      // get incoming edges for Vertice Alice
      const incomingEdges = await db.getInEdges(edgeCollectionName, result0._id);
      should.exist(incomingEdges);
      incomingEdges[0].info.should.equal('Eve knows Alice');

      // get outgoing edges for Vertice Alice
      let outgoingEdges = await db.getOutEdges(edgeCollectionName, result0._id);
      should.exist(outgoingEdges);
      outgoingEdges[0].info.should.equal('Alice knows Bob');
    });
    it('should traverse the graph', async function traverseGraph() {
      // traverse graph
      const result = await db.traversal(edgeCollectionName, result0._id,
        { direction: 'outbound' });
      should.exist(result);
      should.exist(result.visited);
      should.exist(result.visited.vertices);
      should.exist(result.visited.paths);
      result.visited.vertices.should.be.instanceof(Array).and.have.lengthOf(4);
      result.visited.paths.should.be.instanceof(Array).and.have.lengthOf(4);
    });
    it('should update a vertice given the document handle', async function
    updateVertice() {
      const doc = await db.getVertex(vertexCollectionName, result4._id);
      // doc with updated name
      doc.name = 'test';
      await db.update(vertexCollectionName, { id: 'e' }, doc);
      const newdoc = await db.getEdge(vertexCollectionName, result4._id);
      doc.name.should.equal('test');
    });
    it('should update a edge given the document handle', async function
    updateEdge() {
      const doc = await db.getEdge(edgeCollectionName, edgeResult._id);
      // doc with updated name
      doc.info = 'test knows Bob';
      await db.update(edgeCollectionName, { id: 'e' }, doc);
      const newdoc = await db.getEdge(edgeCollectionName, edgeResult._id);
      doc.info.should.equal('test knows Bob');
    });
    it('should remove a vertice given the document handle', async function
    removeVertice() {
      const removedDoc = await db.removeVertex(vertexCollectionName, result2._id);
      should.exist(removedDoc);
      removedDoc.should.equal(true);
    });
    it('should remove edge given the document handle', async function
    removeEdge() {
      const removedDoc = await db.removeEdge(edgeCollectionName, edgeResult._id);
      should.exist(removedDoc);
      removedDoc.should.equal(true);
    });
  });
}

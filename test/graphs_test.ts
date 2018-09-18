import * as should from 'should';
import * as _ from 'lodash';
import { Logger } from '../lib/logger';
import { Database } from 'arangojs';
import * as chassis from '../lib';
const config = chassis.config;
const database = chassis.database;

/* global describe context it beforeEach */

const providers = [
  {
    name: 'arango',
    init: async function init(): Promise<any> {
      await config.load(process.cwd() + '/test');
      const cfg = await config.get();
      const logger = new Logger(cfg.get('logger'));
      return database.get(cfg.get('database:arango'), logger, 'test-graph');
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
    // create person vertex collection
    await db.addVertexCollection(vertexCollectionName);
    // create edge definition edgeCollectionName, fromVerticeCollection,
    // toVerticeCollection
    await db.addEdgeDefinition(edgeCollectionName, vertexCollectionName, vertexCollectionName);
    should.exist(db);
  });
  after(async function drop() {
    await config.load(process.cwd() + '/test');
    const cfg = await config.get();

    const dbName: string = cfg.get('database:arango:database');
    const dbHost: string = cfg.get('database:arango:host');
    const dbPort: string = cfg.get('database:arango:port');

    const db = new Database('http://' + dbHost + ':' + dbPort);
    await db.dropDatabase(dbName);
  });

  describe('Graphs Collection API', () => {
    let result;
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
      result = await db.createVertex(vertexCollectionName, vertices);
      // verify the data from DB
      let insertedVertices = await db.find('person');
      insertedVertices = _.sortBy(insertedVertices, [function (o) { return o.name; }]);
      should.exist(insertedVertices);
      insertedVertices.should.deepEqual(vertices);
    });
    it('should create an edge collection and insert data into it', async function
      createEdges() {
      let edges: any = [
        { info: 'Alice knows Bob', _from: `person/${result[0].id}`, _to: `person/${result[1].id}`, id: 'e1' },
        { info: 'Bob knows Charlie', _from: `person/${result[1].id}`, _to: `person/${result[2].id}`, id: 'e2' },
        { info: 'Bob knows Dave', _from: `person/${result[1].id}`, _to: `person/${result[3].id}`, id: 'e3' },
        { info: 'Eve knows Alice', _from: `person/${result[4].id}`, _to: `person/${result[0].id}`, id: 'e4' },
        { info: 'Eve knows Bob', _from: `person/${result[4].id}`, _to: `person/${result[1].id}`, id: 'e5' }
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
      const incomingEdges = await db.getInEdges(edgeCollectionName, `person/${result[0].id}`);
      should.exist(incomingEdges);
      incomingEdges[0].info.should.equal('Eve knows Alice');

      // get outgoing edges for Vertice Alice
      let outgoingEdges = await db.getOutEdges(edgeCollectionName, `person/${result[0].id}`);
      should.exist(outgoingEdges);
      outgoingEdges[0].info.should.equal('Alice knows Bob');
    });
    it('should traverse the graph', async function traverseGraph() {
      // traverse graph
      let traversalResponse = await db.traversal(`person/${result[0].id}`,
        { direction: 'outbound' });
      // decode the paths and data
      if (traversalResponse && traversalResponse.data) {
        const decodedData = JSON.parse(Buffer.from(traversalResponse.data.value).toString());
        traversalResponse.data = decodedData;
      }
      if (traversalResponse && traversalResponse.paths) {
        const decodedPath = JSON.parse(Buffer.from(traversalResponse.paths.value).toString());
        traversalResponse.paths = decodedPath;
      }
      should.exist(traversalResponse);
      should.exist(traversalResponse.vertex_fields);
      should.exist(traversalResponse.data);
      should.exist(traversalResponse.paths);
      traversalResponse.data.should.be.instanceof(Array).and.have.lengthOf(4);
      traversalResponse.paths.should.be.instanceof(Array).and.have.lengthOf(4);
    });
    it('should update a vertice given the document handle', async function
      updateVertice() {
      const doc = await db.getVertex(vertexCollectionName, `person/${result[4].id}`);
      // doc with updated name
      doc.name = 'test';
      await db.update(vertexCollectionName, { id: 'e' }, doc);
      const newdoc = await db.getEdge(vertexCollectionName, `person/${result[4].id}`);
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
      const removedDoc = await db.removeVertex(vertexCollectionName, `person/${result[2].id}`);
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
  describe('testing special functions', async function () {
    let vertices: any[];
    before(async function () {
      await db.addVertexCollection('organizations');
      await db.addEdgeDefinition('org_has_parent_org', 'organizations', 'organizations');

      vertices = [
        { name: 'OrgA', id: 'A' },
        { name: 'OrgB', id: 'B' },
        { name: 'OrgC', id: 'C' },
        { name: 'OrgD', id: 'D' }
      ];
      const result = await db.createVertex('organizations', vertices);

      const edges = [
        { info: 'OrgB has parent OrgA', _from: `organizations/${result[1].id}`, _to: `organizations/${result[0].id}`, id: 'OrgE1' },
        { info: 'OrgC has parent OrgA', _from: `organizations/${result[2].id}`, _to: `organizations/${result[0].id}`, id: 'OrgE2' },
      ];
      await db.createEdge('org_has_parent_org', edges[0]);
      await db.createEdge('org_has_parent_org', edges[1]);
    });
    it('should return a tree with the lowest common ancestor as root', async function () {
      const result = await db.traversal([`${vertices[1].id}`,
        `${vertices[2].id}`, `${vertices[3].id}`],
        { lowest_common_ancestor: true }, 'organizations', 'org_has_parent_org');
      should.exist(result);
      should.exist(result.paths);
      should.exist(result.paths.value);
      const paths = JSON.parse(result.paths.value.toString());
      paths.should.not.have.length(0);

      const roots = [`organizations/${vertices[0].id}`, `organizations/${vertices[3].id}`];
      for (let path of paths) {
        if (_.isEmpty(path.edges)) {
          const vertex = path.vertices[0];
          roots.should.containEql(vertex._id);
        }
      }
    });
  });
}

import * as should from 'should';
import * as _ from 'lodash';
import { createLogger } from '@restorecommerce/logger';
import { Database } from 'arangojs';
import * as chassis from '../src';
const config = chassis.config;
const database = chassis.database;

/* global describe context it beforeEach */

const providers = [
  {
    name: 'arango',
    init: async (): Promise<any> => {
      await config.load(process.cwd() + '/test');
      const cfg = await config.get();
      const logger = createLogger(cfg.get('logger'));
      return database.get(cfg.get('database:arango'), logger, cfg.get('graph:graphName'),
        cfg.get('graph:edgeDefinitions'));
    }
  }
];

const testProvider = (providerCfg) => {
  let db;
  const personCollectionName = 'person';
  const hasEdgeCollectionName = 'has';
  const carsCollectionName = 'car';
  const belongsEdgeCollectionName = 'belongs';
  const placeCollectionName = 'place';

  before(async () => {
    db = await providerCfg.init();
    // create person vertex collection
    await db.addVertexCollection(personCollectionName);
    // create edge definition edgeCollectionName, fromVerticeCollection, toVerticeCollection
    await db.addEdgeDefinition(hasEdgeCollectionName, personCollectionName, carsCollectionName);
    await db.addEdgeDefinition(belongsEdgeCollectionName, carsCollectionName, placeCollectionName);
    should.exist(db);
  });
  after(async () => {
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
    it('should create a vertex Person, Car and Place collection and insert data into it', async () => {
      // persons
      const personVertices = [
        { name: 'Alice', id: 'a' },
        { name: 'Bob', id: 'b' },
        { name: 'Charlie', id: 'c' },
        { name: 'Dave', id: 'd' },
        { name: 'Eve', id: 'e' }
      ];
      result = await db.createVertex(personCollectionName, personVertices);
      // verify the data from DB
      let insertedVertices = await db.find('person');
      insertedVertices = _.sortBy(insertedVertices, [(o) => { return o.name; }]);
      should.exist(insertedVertices);
      insertedVertices.should.deepEqual(personVertices);
      // cars
      const carVertices = [
        { name: 'carA', id: 'c1' },
        { name: 'carB', id: 'c2' },
        { name: 'carC', id: 'c3' },
        { name: 'carD', id: 'c4' },
        { name: 'carE', id: 'c5' }
      ];
      result = await db.createVertex(carsCollectionName, carVertices);
      // verify the data from DB
      insertedVertices = await db.find('car');
      insertedVertices = _.sortBy(insertedVertices, [(o) => { return o.name; }]);
      should.exist(insertedVertices);
      insertedVertices.should.deepEqual(carVertices);
      // cars
      const placeVertices = [
        { name: 'placeA', id: 'p1' },
        { name: 'placeB', id: 'p2' },
        { name: 'placeC', id: 'p3' },
        { name: 'placeD', id: 'p4' },
        { name: 'placeE', id: 'p5' }
      ];
      result = await db.createVertex(placeCollectionName, placeVertices);
      // verify the data from DB
      insertedVertices = await db.find('place');
      insertedVertices = _.sortBy(insertedVertices, [(o) => { return o.name; }]);
      should.exist(insertedVertices);
      insertedVertices.should.deepEqual(placeVertices);
    });
    it('should create "person has car" and "car belongs to place" edge collections and insert data into it', async () => {
      let personCarEdges: any = [
        { info: 'Alice has Car A', _from: `person/a`, _to: `car/c1`, id: 'e1' },
        { info: 'Bob has Car B', _from: `person/b`, _to: `car/c2`, id: 'e2' },
        { info: 'Charlie has Car C', _from: `person/c`, _to: `car/c3`, id: 'e3' },
        { info: 'Dave has Car D', _from: `person/d`, _to: `car/c4`, id: 'e4' },
        { info: 'Eve has Car E', _from: `person/e`, _to: `car/c5`, id: 'e5' }
      ];
      for (let personCarEdge of personCarEdges) {
        edgeResult = await db.createEdge(hasEdgeCollectionName, personCarEdge);
      }
      let insertedEdges: any = await db.find('has');
      personCarEdges = _.sortBy(personCarEdges, [(o) => { return o.info; }]);
      insertedEdges = _.sortBy(insertedEdges, [(o) => { return o.info; }]);
      should.exist(insertedEdges);
      insertedEdges.should.deepEqual(personCarEdges);

      let carPlaceEdges: any = [
        { info: 'Car A belongs to place P1', _from: `car/c1`, _to: `place/p1`, id: 'e6' },
        { info: 'Car B belongs to place P2', _from: `car/c2`, _to: `place/p2`, id: 'e7' },
        { info: 'Car C belongs to place P3', _from: `car/c3`, _to: `place/p3`, id: 'e8' },
        { info: 'Car D belongs to place P4', _from: `car/c4`, _to: `place/p4`, id: 'e9' },
        { info: 'Car E belongs to place P5', _from: `car/c5`, _to: `place/p5`, id: 'e10' }
      ];
      for (let carPlaceEdge of carPlaceEdges) {
        await db.createEdge(belongsEdgeCollectionName, carPlaceEdge);
      }
      insertedEdges = await db.find('belongs');
      carPlaceEdges = _.sortBy(carPlaceEdges, [(o) => { return o.info; }]);
      insertedEdges = _.sortBy(insertedEdges, [(o) => { return o.info; }]);
      should.exist(insertedEdges);
      insertedEdges.should.deepEqual(carPlaceEdges);
    });
    it('should verify incoming and outgoing edges', async () => {
      // get incoming edges for Car C1
      const incomingEdges = await db.getInEdges(hasEdgeCollectionName, `car/c1`);
      should.exist(incomingEdges);
      incomingEdges.edges[0].info.should.equal('Alice has Car A');

      // get outgoing edges for Car C1
      let outgoingEdges = await db.getOutEdges(belongsEdgeCollectionName, `car/c1`);
      should.exist(outgoingEdges);
      outgoingEdges.edges[0].info.should.equal('Car A belongs to place P1');
    });
    it('should traverse the graph and return only vertices for Person A', async () => {
      // traverse graph
      let traversalResponse = await db.traversal(`person/a`, null, null);
      // decode the paths and data
      if (traversalResponse && traversalResponse.data) {
        const decodedData = JSON.parse(Buffer.from(traversalResponse.data.value).toString());
        traversalResponse.data = decodedData;
      }
      should.exist(traversalResponse);
      should.exist(traversalResponse.data);
      traversalResponse.paths.should.be.empty();
      traversalResponse.data.should.be.instanceof(Array).and.have.lengthOf(3);
    });
    it('should traverse the graph and return both vertices and paths when paths flag is set to true', async () => {
      // traverse graph
      let traversalResponse = await db.traversal(`person/a`, null, null, null, true);
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
      should.exist(traversalResponse.data);
      should.exist(traversalResponse.paths);
      traversalResponse.data.should.be.instanceof(Array).and.have.lengthOf(3);
      traversalResponse.data[0].name.should.equal('carA');
      traversalResponse.data[1].name.should.equal('placeA');
      traversalResponse.data[2].name.should.equal('Alice');
      traversalResponse.paths.should.be.instanceof(Array).and.have.lengthOf(2);
    });
    // include vertices
    it('should traverse the graph with included vertices options and return only the included vertices', async () => {
      // traverse graph
      let traversalResponse = await db.traversal(`person/a`, null, { include_vertex: ['car'] }, null, true);
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
      should.exist(traversalResponse.data);
      should.exist(traversalResponse.paths);
      traversalResponse.data.should.be.instanceof(Array).and.have.lengthOf(2);
      traversalResponse.data[0].name.should.equal('carA');
      traversalResponse.data[1].name.should.equal('Alice');
      traversalResponse.paths.should.be.instanceof(Array).and.have.lengthOf(1);
    });
    // exclude vertices
    it('should traverse the graph with excluded vertices options and return only traversed data with excluded vertices', async () => {
      // traverse graph
      let traversalResponse = await db.traversal(`person/a`, null, { exclude_vertex: ['car'] }, null, true);
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
      should.exist(traversalResponse.data);
      should.exist(traversalResponse.paths);
      traversalResponse.data.should.be.instanceof(Array).and.have.lengthOf(2);
      traversalResponse.data[0].name.should.equal('placeA');
      traversalResponse.data[1].name.should.equal('Alice');
      traversalResponse.paths.should.be.instanceof(Array).and.have.lengthOf(1);
    });
    // include edges
    it('should traverse the graph with included edges options and return vertices from included edges', async () => {
      // traverse graph
      let traversalResponse = await db.traversal(`person/a`, null, { include_edge: ['has'] }, null, true);
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
      should.exist(traversalResponse.data);
      should.exist(traversalResponse.paths);
      traversalResponse.data.should.be.instanceof(Array).and.have.lengthOf(2);
      traversalResponse.data[0].name.should.equal('carA');
      traversalResponse.data[1].name.should.equal('Alice');
      traversalResponse.paths.should.be.instanceof(Array).and.have.lengthOf(1);
    });
    // exclude edges
    it('should traverse the graph with exclude edges options and return vertices from excluded edges', async () => {
      // traverse graph
      let traversalResponse = await db.traversal(`person/a`, null, { exclude_edge: ['belongs'] }, null, true);
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
      should.exist(traversalResponse.data);
      should.exist(traversalResponse.paths);
      traversalResponse.data.should.be.instanceof(Array).and.have.lengthOf(2);
      traversalResponse.data[0].name.should.equal('carA');
      traversalResponse.data[1].name.should.equal('Alice');
      traversalResponse.paths.should.be.instanceof(Array).and.have.lengthOf(1);
    });
    // collection traversal
    it('should traverse the entire collection and return data from all traversed entities', async () => {
      // traverse graph
      let traversalResponse = await db.traversal(null, 'person', null, null, true);
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
      should.exist(traversalResponse.data);
      should.exist(traversalResponse.paths);
      traversalResponse.data.should.be.instanceof(Array).and.have.lengthOf(15); // 5 person, 5 cars and 5 place entities
      traversalResponse.paths.should.be.instanceof(Array).and.have.lengthOf(10); // 10 edges
    });
    it('should update a vertice given the document handle', async () => {
      const doc = await db.getVertex(personCollectionName, `person/e`);
      // doc with updated name
      doc.name = 'test';
      await db.update(personCollectionName, [doc]);
      const newdoc = await db.getEdge(personCollectionName, `person/e`);
      newdoc.name.should.equal('test');
    });
    it('should update a edge given the document handle', async () => {
      const doc = await db.getEdge(hasEdgeCollectionName, edgeResult._id);
      // doc with updated name
      doc.info = 'test has Car E';
      await db.update(hasEdgeCollectionName, [doc]);
      const newdoc = await db.getEdge(hasEdgeCollectionName, edgeResult._id);
      newdoc.info.should.equal('test has Car E');
    });
    it('should remove a vertice given the document handle for Person B', async () => {
      const removedDoc = await db.removeVertex(personCollectionName, `person/b`);
      should.exist(removedDoc);
      removedDoc[0]._id.should.equal('person/b');
      removedDoc[0]._key.should.equal('b');
    });
    it('should remove edge given the document handle', async () => {
      const removedDoc = await db.removeEdge(hasEdgeCollectionName, edgeResult._id);
      should.exist(removedDoc);
      removedDoc.error.should.equal(false);
      removedDoc.code.should.equal(202);
    });
  });
};

providers.forEach((providerCfg) => {
  describe(`Graphs with database provider ${providerCfg.name}`, () => {
    testProvider(providerCfg);
  });
});

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

const arrUnique = (arr) => {
  let cleaned = [];
  arr.forEach((itm) => {
    let unique = true;
    cleaned.forEach((itm2) => {
      if (_.isEqual(itm, itm2)) unique = false;
    });
    if (unique) cleaned.push(itm);
  });
  return cleaned;
};

const testProvider = (providerCfg) => {
  let db;
  //  STATE <-- lives PERSON has --> CAR belongsto --> PLACE resides --> STATE
  const personCollectionName = 'person';
  const hasEdgeCollectionName = 'has';
  const carsCollectionName = 'car';
  const belongsEdgeCollectionName = 'belongs';
  const placeCollectionName = 'place';
  const residesEdgeCollectionName = 'resides';
  const stateCollectionName = 'state';
  const livesEdgeCollectionName = 'lives';

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

      // place
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

      // state
      const stateVertices = [
        { name: 'stateA', id: 's1' },
        { name: 'stateAA', id: 's11' },
        { name: 'stateB', id: 's2' },
        { name: 'stateBB', id: 's22' },
        { name: 'stateC', id: 's3' },
        { name: 'stateCC', id: 's33' },
        { name: 'stateD', id: 's4' },
        { name: 'stateDD', id: 's44' },
        { name: 'stateE', id: 's5' },
        { name: 'stateEE', id: 's55' }
      ];
      result = await db.createVertex(stateCollectionName, stateVertices);
      // verify the data from DB
      insertedVertices = await db.find('state');
      insertedVertices = _.sortBy(insertedVertices, [(o) => { return o.name; }]);
      should.exist(insertedVertices);
      insertedVertices.should.deepEqual(stateVertices);
    });
    it('should create "person has car", "car belongs to place", "place resides in state" edge collections and insert data into it', async () => {
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

      let placeStateEdges: any = [
        { info: 'Place A resides in state S1', _from: `place/p1`, _to: `state/s1`, id: 'e11' },
        { info: 'Place B resides in state S2', _from: `place/p2`, _to: `state/s2`, id: 'e12' },
        { info: 'Place C resides in state S3', _from: `place/p3`, _to: `state/s3`, id: 'e13' },
        { info: 'Place D resides in state S4', _from: `place/p4`, _to: `state/s4`, id: 'e14' },
        { info: 'Place E resides in state S5', _from: `place/p5`, _to: `state/s5`, id: 'e15' }
      ];
      for (let placeStateEdge of placeStateEdges) {
        await db.createEdge(residesEdgeCollectionName, placeStateEdge);
      }
      insertedEdges = await db.find('resides');
      placeStateEdges = _.sortBy(placeStateEdges, [(o) => { return o.info; }]);
      insertedEdges = _.sortBy(insertedEdges, [(o) => { return o.info; }]);
      should.exist(insertedEdges);
      insertedEdges.should.deepEqual(placeStateEdges);

      let personStateEdges: any = [
        { info: 'Person A lives in state S1', _from: `person/a`, _to: `state/s11`, id: 'e16' },
        { info: 'Person B lives in state S2', _from: `person/b`, _to: `state/s22`, id: 'e17' },
        { info: 'Person C lives in state S3', _from: `person/c`, _to: `state/s33`, id: 'e18' },
        { info: 'Person D lives in state S4', _from: `person/d`, _to: `state/s44`, id: 'e19' },
        { info: 'Person E lives in state S5', _from: `person/e`, _to: `state/s55`, id: 'e20' }
      ];
      for (let personStateEdge of personStateEdges) {
        await db.createEdge(livesEdgeCollectionName, personStateEdge);
      }
      insertedEdges = await db.find('lives');
      personStateEdges = _.sortBy(personStateEdges, [(o) => { return o.info; }]);
      insertedEdges = _.sortBy(insertedEdges, [(o) => { return o.info; }]);
      should.exist(insertedEdges);
      insertedEdges.should.deepEqual(personStateEdges);
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
      let result = { data: [], paths: [] };
      const traversalResponse = await db.traversal({ collection_name: 'person', start_vertex_id: ['a'] }, null, null, null, false);
      const rootEntityData = await traversalResponse.rootCursor.all();
      const associationEntityData = await traversalResponse.associationCursor.all();
      result.data = rootEntityData;
      for (let data of associationEntityData) {
        result.data.push(data.v); // extract only vertices data from associattion entity as it contains v, e, p
      }
      should.exist(result);
      should.exist(result.data);
      result.paths.should.be.empty();
      result.data.should.be.instanceof(Array).and.have.lengthOf(5);
    });
    it('should traverse the graph and return both vertices and paths when paths flag is set to true', async () => {
      // traverse graph
      const result = { data: [], paths: [] };
      const traversalResponse = await db.traversal({ collection_name: 'person', start_vertex_id: ['a'] }, null, null, null, true);
      const rootEntityData = await traversalResponse.rootCursor.all();
      const associationEntityData = await traversalResponse.associationCursor.all();
      for (let data of associationEntityData) {
        result.data.push(data.v); // extract only vertices data from associattion entity as it contains v, e, p
        result.paths.push(data.p);
      }
      for (let rootEntity of rootEntityData) {
        result.data.push(rootEntity);
      }
      result.paths = arrUnique(result.paths);
      should.exist(result);
      should.exist(result.data);
      should.exist(result.paths);
      result.data.should.be.instanceof(Array).and.have.lengthOf(5);
      result.data[0].name.should.equal('carA');
      result.data[1].name.should.equal('stateAA');
      result.data[2].name.should.equal('placeA');
      result.data[3].name.should.equal('stateA');
      result.data[4].name.should.equal('Alice');
      result.paths.should.be.instanceof(Array).and.have.lengthOf(4);
    });
    // include vertices
    it('should traverse the graph with included vertices options and return only the included vertices', async () => {
      // traverse graph
      const result = { data: [], paths: [] };
      const traversalResponse = await db.traversal({ collection_name: 'person', start_vertex_id: ['a'] }, null, { include_vertex: ['car'] }, null, true);
      const rootEntityData = await traversalResponse.rootCursor.all();
      const associationEntityData = await traversalResponse.associationCursor.all();
      for (let data of associationEntityData) {
        result.data.push(data.v); // extract only vertices data from associattion entity as it contains v, e, p
        result.paths.push(data.p);
      }
      for (let rootEntity of rootEntityData) {
        result.data.push(rootEntity);
      }
      result.paths = arrUnique(result.paths);
      should.exist(result);
      should.exist(result.data);
      should.exist(result.paths);
      result.data.should.be.instanceof(Array).and.have.lengthOf(2);
      result.data[0].name.should.equal('carA');
      result.data[1].name.should.equal('Alice');
      result.paths.should.be.instanceof(Array).and.have.lengthOf(1);
    });
    // exclude vertices
    it('should traverse the graph with excluded vertices options and return only traversed data with excluded vertices', async () => {
      // traverse graph
      const result = { data: [], paths: [] };
      const traversalResponse = await db.traversal({ collection_name: 'person', start_vertex_id: ['a'] }, null, { exclude_vertex: ['car'] }, null, true);
      const rootEntityData = await traversalResponse.rootCursor.all();
      const associationEntityData = await traversalResponse.associationCursor.all();
      for (let data of associationEntityData) {
        result.data.push(data.v); // extract only vertices data from associattion entity as it contains v, e, p
        result.paths.push(data.p);
      }
      for (let rootEntity of rootEntityData) {
        result.data.push(rootEntity);
      }
      result.paths = arrUnique(result.paths);
      should.exist(result);
      should.exist(result.data);
      should.exist(result.paths);
      result.data.should.be.instanceof(Array).and.have.lengthOf(4);
      result.data[0].name.should.equal('stateAA');
      result.data[1].name.should.equal('placeA');
      result.data[2].name.should.equal('stateA');
      result.data[3].name.should.equal('Alice');
      result.paths.should.be.instanceof(Array).and.have.lengthOf(3);
    });
    // include edges
    it('should traverse the graph with included edges options and return vertices from included edges', async () => {
      // traverse graph
      const result = { data: [], paths: [] };
      let traversalResponse = await db.traversal({ collection_name: 'person', start_vertex_id: ['a'] }, null, { include_edge: ['has'] }, null, true);
      const rootEntityData = await traversalResponse.rootCursor.all();
      const associationEntityData = await traversalResponse.associationCursor.all();
      for (let data of associationEntityData) {
        result.data.push(data.v); // extract only vertices data from associattion entity as it contains v, e, p
        result.paths.push(data.p);
      }
      for (let rootEntity of rootEntityData) {
        result.data.push(rootEntity);
      }
      result.paths = arrUnique(result.paths);
      should.exist(result);
      should.exist(result.data);
      should.exist(result.paths);
      result.data.should.be.instanceof(Array).and.have.lengthOf(2);
      result.data[0].name.should.equal('carA');
      result.data[1].name.should.equal('Alice');
      result.paths.should.be.instanceof(Array).and.have.lengthOf(1);
    });
    // exclude edges
    it('should traverse the graph with exclude edges options and return vertices from excluded edges', async () => {
      // traverse graph
      const result = { data: [], paths: [] };
      let traversalResponse = await db.traversal({ collection_name: 'person', start_vertex_id: ['a'] }, null, { exclude_edge: ['belongs'] }, null, true);
      const rootEntityData = await traversalResponse.rootCursor.all();
      const associationEntityData = await traversalResponse.associationCursor.all();
      for (let data of associationEntityData) {
        result.data.push(data.v); // extract only vertices data from associattion entity as it contains v, e, p
        result.paths.push(data.p);
      }
      for (let rootEntity of rootEntityData) {
        result.data.push(rootEntity);
      }
      result.paths = arrUnique(result.paths);
      should.exist(result);
      should.exist(result.data);
      should.exist(result.paths);
      result.data.should.be.instanceof(Array).and.have.lengthOf(4);
      result.data[0].name.should.equal('carA');
      result.data[1].name.should.equal('stateAA');
      result.data[2].name.should.equal('stateA');
      result.data[3].name.should.equal('Alice');
      result.paths.should.be.instanceof(Array).and.have.lengthOf(3);
    });
    // exclude one edge and include another edge of same entity
    it('for 2 entities should exclude one entity edge and include another entity edge', async () => {
      // traverse graph
      const result = { data: [], paths: [] };
      let traversalResponse = await db.traversal({ collection_name: 'person', start_vertex_id: ['a'] }, null, { exclude_edge: ['resides'], include_edge: ['lives'] }, null, true);
      const rootEntityData = await traversalResponse.rootCursor.all();
      const associationEntityData = await traversalResponse.associationCursor.all();
      for (let data of associationEntityData) {
        result.data.push(data.v); // extract only vertices data from associattion entity as it contains v, e, p
        result.paths.push(data.p);
      }
      for (let rootEntity of rootEntityData) {
        result.data.push(rootEntity);
      }
      result.paths = arrUnique(result.paths);
      should.exist(result);
      should.exist(result.data);
      should.exist(result.paths);
      result.data.should.be.instanceof(Array).and.have.lengthOf(2);
      result.data[0].name.should.equal('stateAA');
      result.data[1].name.should.equal('Alice');
      result.paths.should.be.instanceof(Array).and.have.lengthOf(1);
    });
    // collection traversal
    it('should traverse the entire collection and return data from all traversed entities', async () => {
      // traverse graph
      const result = { data: [], paths: [] };
      let traversalResponse = await db.traversal(null, { collection_name: 'person' }, null, null, true);
      const rootEntityData = await traversalResponse.rootCursor.all();
      const associationEntityData = await traversalResponse.associationCursor.all();
      for (let data of associationEntityData) {
        result.data.push(data.v); // extract only vertices data from associattion entity as it contains v, e, p
        result.paths.push(data.p);
      }
      for (let rootEntity of rootEntityData) {
        result.data.push(rootEntity);
      }
      result.paths = arrUnique(result.paths);
      should.exist(result);
      should.exist(result.data);
      should.exist(result.paths);
      result.data.should.be.instanceof(Array).and.have.lengthOf(25); // 5 person, 5 states, 5 cars, 5 place and 5 state entities
      result.paths.should.be.instanceof(Array).and.have.lengthOf(20); // 20 edges
    });
    // Filter tests for collection traversal
    it('with filters should traverse the collection and return data with filtering applied on respective entities', async () => {
      // traverse graph with filtering for car and place entities
      let result = { data: [], paths: [] };
      let traversalResponse = await db.traversal(null, { collection_name: 'person' }, null,
        [{
          filter: [{ field: 'name', operation: 'eq', value: 'carA' }],
          entity: 'car'
        }, {
          filter: [{ field: 'name', operation: 'eq', value: 'placeA' }],
          entity: 'place'
        }],
        true);
      let rootEntityData = await traversalResponse.rootCursor.all();
      let associationEntityData = await traversalResponse.associationCursor.all();
      for (let data of associationEntityData) {
        result.data.push(data.v); // extract only vertices data from associattion entity as it contains v, e, p
        result.paths.push(data.p);
      }
      for (let rootEntity of rootEntityData) {
        result.data.push(rootEntity);
      }
      result.paths = arrUnique(result.paths);
      should.exist(result);
      should.exist(result.data);
      should.exist(result.paths);
      result.data.should.be.instanceof(Array).and.have.lengthOf(17); // 5 person, 5 states, 1 cars, 1 place and 5 state entities
      let filteredData = result.data.filter(e => e._id.startsWith('car/') || e._id.startsWith('place/'));
      filteredData.should.be.length(2);
      filteredData[0].name.should.equal('carA');
      filteredData[1].name.should.equal('placeA');

      // traverse graph with filtering for state entities
      result = { data: [], paths: [] };
      traversalResponse = await db.traversal(null, { collection_name: 'person' }, null,
        [{
          filter: [{ field: 'name', operation: 'eq', value: 'stateA' }, { field: 'name', operation: 'eq', value: 'stateAA' }],
          operator: 'or', // Default is AND operation
          entity: 'state'
        }],
        true);
      rootEntityData = await traversalResponse.rootCursor.all();
      associationEntityData = await traversalResponse.associationCursor.all();
      for (let data of associationEntityData) {
        result.data.push(data.v); // extract only vertices data from associattion entity as it contains v, e, p
        result.paths.push(data.p);
      }
      for (let rootEntity of rootEntityData) {
        result.data.push(rootEntity);
      }
      result.paths = arrUnique(result.paths);
      should.exist(result);
      should.exist(result.data);
      should.exist(result.paths);
      result.data.should.be.instanceof(Array).and.have.lengthOf(17); // 5 person, 2 states, 5 cars, 5 place entities
      filteredData = result.data.filter(e => e._id.startsWith('state/'));
      filteredData.should.be.length(2);
      filteredData[0].name.should.equal('stateAA');
      filteredData[1].name.should.equal('stateA');
    });
    // filters with include vertices
    it('should traverse the graph with filters and included vertices options and return only the filtered and included vertices', async () => {
      // traverse graph with 1 included vertex
      let result = { data: [], paths: [] };
      let traversalResponse = await db.traversal(null, { collection_name: 'person' }, { include_vertex: ['car'], direction: 'OUTBOUND' },
        [{
          filter: [{ field: 'name', operation: 'eq', value: 'carA' }, { field: 'name', operation: 'eq', value: 'carB' }],
          operator: 'or', // Default is AND operation
          entity: 'car'
        }],
        true);
      let rootEntityData = await traversalResponse.rootCursor.all();
      let associationEntityData = await traversalResponse.associationCursor.all();
      for (let data of associationEntityData) {
        result.data.push(data.v); // extract only vertices data from associattion entity as it contains v, e, p
        result.paths.push(data.p);
      }
      for (let rootEntity of rootEntityData) {
        result.data.push(rootEntity);
      }
      result.paths = arrUnique(result.paths);
      should.exist(result);
      should.exist(result.data);
      should.exist(result.paths);
      result.data.should.be.instanceof(Array).and.have.lengthOf(7); // 5 person 2 cars
      result.data[0].name.should.equal('carA');
      result.data[1].name.should.equal('carB');
      result.data[2].name.should.equal('Alice');
      result.data[3].name.should.equal('Bob');
      result.data[4].name.should.equal('Charlie');
      result.data[5].name.should.equal('Dave');
      result.data[6].name.should.equal('Eve');
      result.paths.should.be.instanceof(Array).and.have.lengthOf(2);

      // traverse graph with 2 included vertex
      result = { data: [], paths: [] };
      traversalResponse = await db.traversal(null, { collection_name: 'person' }, { include_vertex: ['car', 'state'], direction: 'OUTBOUND' },
        [{
          filter: [{ field: 'name', operation: 'eq', value: 'carA' }, { field: 'name', operation: 'eq', value: 'carB' }],
          operator: 'or', // Default is AND operation
          entity: 'car'
        }, {
          filter: [{ field: 'name', operation: 'eq', value: 'stateAA' }, { field: 'name', operation: 'eq', value: 'stateBB' }],
          operator: 'or', // Default is AND operation
          entity: 'state'
        }],
        true);
      rootEntityData = await traversalResponse.rootCursor.all();
      associationEntityData = await traversalResponse.associationCursor.all();
      for (let data of associationEntityData) {
        result.data.push(data.v); // extract only vertices data from associattion entity as it contains v, e, p
        result.paths.push(data.p);
      }
      for (let rootEntity of rootEntityData) {
        result.data.push(rootEntity);
      }
      result.paths = arrUnique(result.paths);
      should.exist(result);
      should.exist(result.data);
      should.exist(result.paths);
      result.data.should.be.instanceof(Array).and.have.lengthOf(9); // 5 person 2 cars 2 states
      result.data[0].name.should.equal('carA');
      result.data[1].name.should.equal('stateAA');
      result.data[2].name.should.equal('carB');
      result.data[3].name.should.equal('stateBB');
      result.data[4].name.should.equal('Alice');
      result.data[5].name.should.equal('Bob');
      result.data[6].name.should.equal('Charlie');
      result.data[7].name.should.equal('Dave');
      result.data[8].name.should.equal('Eve');
      result.paths.should.be.instanceof(Array).and.have.lengthOf(4);
    });
    // filter with exclude vertices
    it('should traverse the graph with filters and excluded vertices options and return only the filtered and excluded vertices', async () => {
      // traverse graph
      const result = { data: [], paths: [] };
      let traversalResponse = await db.traversal({ collection_name: '', start_vertex_id: [] }, { collection_name: 'person' }, { exclude_vertex: ['car'] },
        [{
          filter: [{ field: 'name', operation: 'eq', value: 'stateA' }, { field: 'name', operation: 'eq', value: 'stateB' }],
          operator: 'or', // Default is AND operation
          entity: 'state'
        }], true);
      let rootEntityData = await traversalResponse.rootCursor.all();
      let associationEntityData = await traversalResponse.associationCursor.all();
      for (let data of associationEntityData) {
        result.data.push(data.v); // extract only vertices data from associattion entity as it contains v, e, p
        result.paths.push(data.p);
      }
      for (let rootEntity of rootEntityData) {
        result.data.push(rootEntity);
      }
      result.paths = arrUnique(result.paths);
      should.exist(result);
      should.exist(result.data);
      should.exist(result.paths);
      result.data.should.be.instanceof(Array).and.have.lengthOf(12); // 5 persons, 5 places, 2 satates
      result.data[0].name.should.equal('placeA');
      result.data[1].name.should.equal('stateA');
      result.data[2].name.should.equal('placeB');
      result.data[3].name.should.equal('stateB');
      result.data[4].name.should.equal('placeC');
      result.data[5].name.should.equal('placeD');
      result.data[6].name.should.equal('placeE');
      result.data[7].name.should.equal('Alice');
      result.data[8].name.should.equal('Bob');
      result.data[9].name.should.equal('Charlie');
      result.data[10].name.should.equal('Dave');
      result.data[11].name.should.equal('Eve');
      result.paths.should.be.instanceof(Array).and.have.lengthOf(7);
    });
    // filter with exclude edges
    it('for 2 entities should exclude one entity edge and include another entity edge with filtering enabled on second edge entity', async () => {
      let result = { data: [], paths: [] };
      // traverse graph with filtering for state entities (filter with exclude one edge and include other edge)
      let traversalResponse = await db.traversal(null, { collection_name: 'person' }, { exclude_edge: ['resides'] },
        [{
          filter: [{ field: 'name', operation: 'eq', value: 'stateAA' }, { field: 'name', operation: 'eq', value: 'stateBB' }],
          operator: 'or', // Default is AND operation
          edge: 'lives'
        }],
        true);
      let rootEntityData = await traversalResponse.rootCursor.all();
      let associationEntityData = await traversalResponse.associationCursor.all();
      for (let data of associationEntityData) {
        result.data.push(data.v); // extract only vertices data from associattion entity as it contains v, e, p
        result.paths.push(data.p);
      }
      for (let rootEntity of rootEntityData) {
        result.data.push(rootEntity);
      }
      result.paths = arrUnique(result.paths);
      should.exist(result);
      should.exist(result.data);
      should.exist(result.paths);
      result.data.should.be.instanceof(Array).and.have.lengthOf(17); // 5 person, 2 states, 5 cars, 5 place entities
      let filteredData = result.data.filter(e => e._id.startsWith('state/'));
      filteredData.should.be.length(2);
      filteredData[0].name.should.equal('stateAA');
      filteredData[1].name.should.equal('stateBB');

      result = { data: [], paths: [] };
      // with iLike traverse graph with filtering for state entities (filter with exclude one edge and include other edge)
      traversalResponse = await db.traversal(null, { collection_name: 'person' }, { exclude_edge: ['resides'] },
        [{
          filter: [{ field: 'name', operation: 'iLike', value: 'StaTe%' }],
          operator: 'or', // Default is AND operation
          edge: 'lives'
        }],
        true);
      rootEntityData = await traversalResponse.rootCursor.all();
      associationEntityData = await traversalResponse.associationCursor.all();
      for (let data of associationEntityData) {
        result.data.push(data.v); // extract only vertices data from associattion entity as it contains v, e, p
        result.paths.push(data.p);
      }
      for (let rootEntity of rootEntityData) {
        result.data.push(rootEntity);
      }
      result.paths = arrUnique(result.paths);
      should.exist(result);
      should.exist(result.data);
      should.exist(result.paths);
      result.data.should.be.instanceof(Array).and.have.lengthOf(20); // 5 person, 5 states, 5 cars, 5 place entities
      filteredData = result.data.filter(e => e._id.startsWith('state/'));
      filteredData.should.be.length(5);
      filteredData[0].name.should.equal('stateAA');
      filteredData[1].name.should.equal('stateBB');
      filteredData[2].name.should.equal('stateCC');
      filteredData[3].name.should.equal('stateDD');
      filteredData[4].name.should.equal('stateEE');
    });
    // filter with include edges
    it('should traverse the graph with filters and included edges and return only the filtered and included edge vertices data', async () => {
      const result = { data: [], paths: [] };
      // traverse graph with filtering for state entities (filter with exclude one edge and include other edge)
      let traversalResponse = await db.traversal(null, { collection_name: 'person' }, { include_edge: ['has', 'lives'] },
        [{
          filter: [{ field: 'name', operation: 'eq', value: 'stateAA' }, { field: 'name', operation: 'eq', value: 'stateBB' }],
          operator: 'or', // Default is AND operation
          edge: 'lives'
        }],
        true);
      let rootEntityData = await traversalResponse.rootCursor.all();
      let associationEntityData = await traversalResponse.associationCursor.all();
      for (let data of associationEntityData) {
        result.data.push(data.v); // extract only vertices data from associattion entity as it contains v, e, p
        result.paths.push(data.p);
      }
      for (let rootEntity of rootEntityData) {
        result.data.push(rootEntity);
      }
      result.paths = arrUnique(result.paths);
      should.exist(result);
      should.exist(result.data);
      should.exist(result.paths);
      result.data.should.be.instanceof(Array).and.have.lengthOf(12); // 5 person, 2 states, 5 cars
      let filteredData = result.data.filter(e => e._id.startsWith('state/'));
      filteredData.should.be.length(2);
      filteredData[0].name.should.equal('stateAA');
      filteredData[1].name.should.equal('stateBB');
    });
    // it('should update a vertice given the document handle', async () => {
    //   const doc = await db.getVertex(personCollectionName, `person/e`);
    //   // doc with updated name
    //   doc.name = 'test';
    //   await db.update(personCollectionName, [doc]);
    //   const newdoc = await db.getEdge(personCollectionName, `person/e`);
    //   newdoc.name.should.equal('test');
    // });
    // it('should update a edge given the document handle', async () => {
    //   const doc = await db.getEdge(hasEdgeCollectionName, edgeResult._id);
    //   // doc with updated name
    //   doc.info = 'test has Car E';
    //   await db.update(hasEdgeCollectionName, [doc]);
    //   const newdoc = await db.getEdge(hasEdgeCollectionName, edgeResult._id);
    //   newdoc.info.should.equal('test has Car E');
    // });
    // it('should remove a vertice given the document handle for Person B', async () => {
    //   const removedDoc = await db.removeVertex(personCollectionName, `person/b`);
    //   should.exist(removedDoc);
    //   removedDoc[0]._id.should.equal('person/b');
    //   removedDoc[0]._key.should.equal('b');
    // });
    // it('should remove edge given the document handle', async () => {
    //   const removedDoc = await db.removeEdge(hasEdgeCollectionName, edgeResult._id);
    //   should.exist(removedDoc);
    //   removedDoc.error.should.equal(false);
    //   removedDoc.code.should.equal(202);
    // });
  });
};

providers.forEach((providerCfg) => {
  describe(`Graphs with database provider ${providerCfg.name}`, () => {
    testProvider(providerCfg);
  });
});

import * as _ from 'lodash';
import { Graph, Database } from "arangojs";

import { Arango } from "./base";
import { sanitizeInputFields, sanitizeOutputFields, encodeMessage } from "./common";
import { GraphDatabaseProvider } from '../..';

export class ArangoGraph extends Arango implements GraphDatabaseProvider {
  graph: Graph;

  constructor(conn: Database, graph: Graph) {
    super(conn);
    this.graph = graph;
  }

  /**
 * create a Graph instance.
 *
 * @param  {String} graphName graph name
 * @return  {Object} A Graph instance
 */
  async createGraphDB(graphName: string): Promise<Graph> {
    if (_.isNil(graphName)) {
      throw new Error('missing graph name');
    }
    this.graph = this.db.graph(graphName);
    try {
      await this.graph.create();
    } catch (err) {
      if (err.message === 'graph already exists') {
        return this.graph;
      }
      throw { code: err.code, message: err.message };
    }
    return this.graph;
  }


  /**
   * create a new Vertex with given data.
   *
   * @param  {string} collectionName vertex collection name
   * @param  {Object} data data for vertex
   * @return  {Object} created vertex
   */
  async createVertex(collectionName: string, data: any): Promise<any> {
    if (_.isNil(collectionName)) {
      throw new Error('missing vertex collection name');
    }
    if (_.isNil(data)) {
      throw new Error('missing data for vertex');
    }
    const collection = this.graph.vertexCollection(collectionName);
    let docs = _.cloneDeep(data);
    if (!_.isArray(docs)) {
      docs = [docs];
    }
    _.forEach(docs, (document, i) => {
      docs[i] = sanitizeInputFields(document);
    });
    const results = await collection.save(docs);
    _.forEach(results, (result) => {
      if (result.error === true) {
        throw new Error(result.errorMessage);
      }
    });
    return _.map(docs, sanitizeOutputFields);
  }

  /**
   * Retreives the vertex with the given documentHandle from the collection.
   *
   * @param  {string} collectionName vertex collection name
   * @param  {string} documentHandle The handle of the vertex to retrieve.
   * This can be either the _id or the _key of a vertex in the collection,
   * or a vertex (i.e. an object with an _id or _key property).
   * @return  {Object} created vertex
   */
  async getVertex(collectionName: string, documentHandle: string): Promise<Object> {
    if (_.isNil(collectionName)) {
      throw new Error('missing vertex collection name');
    }
    if (_.isNil(documentHandle)) {
      throw new Error('missing document handle');
    }
    const collection = this.graph.vertexCollection(collectionName);
    const doc = await collection.vertex(documentHandle);
    return doc;
  }

  /**
   * Deletes the vertex with the given documentHandle from the collection.
   *
   * @param {string} collectionName vertex collection name
   * @param  {string[]} documentHandles An array of the documentHandles to be removed.
   * This can be either the _id or the _key of a vertex in the collection,
   * or a vertex (i.e. an object with an _id or _key property).
   * @return  {Object} removed vertex
   */
  async removeVertex(collectionName: string, documentHandles: string | string[]): Promise<any> {
    if (_.isNil(collectionName)) {
      throw new Error('missing vertex collection name');
    }
    if (_.isNil(documentHandles)) {
      throw new Error('missing document handle property');
    }
    if (!_.isArray(documentHandles)) {
      documentHandles = [documentHandles as string];
    }
    const collection = this.graph.vertexCollection(collectionName);
    let removedVertexList = [];
    for (let documentHandle of documentHandles) {
      removedVertexList.push(await collection.remove(documentHandle));
    }
    if (removedVertexList.length === 1) {
      return removedVertexList[0];
    }
    return removedVertexList;
  }

  /**
   * gets a new GraphVertexCollection instance with the given name for this graph.
   *
   * @param  {string} collectionName The handle of the vertex to retrieve.
   * This can be either the _id or the _key of a vertex in the collection,
   * or a vertex (i.e. an object with an _id or _key property).
   * @return  {Object} created vertex
   */
  async getVertexCollection(collectionName: string): Promise<Object> {
    if (_.isNil(collectionName)) {
      throw new Error('missing vertex collection name');
    }

    const collection = await this.graph.vertexCollection(collectionName);
    return collection;
  }

  /**
   * Fetches all vertex collections from the graph and returns
   * an array of collection descriptions.
   *
   * @param  {boolean} excludeOrphans Whether orphan collections should be excluded.
   * @return  {Array<Object>} vertex list
   */
  async listVertexCollections(excludeOrphans?: boolean): Promise<any> {
    if (!excludeOrphans) {
      excludeOrphans = false;
    }
    const collections = await this.graph.listVertexCollections({ excludeOrphans });
    return collections;
  }

  /**
   * Fetches all vertex collections from the database and returns an array
   * of GraphVertexCollection instances for the collections.
   *
   * @param  {boolean} excludeOrphans Whether orphan collections should be excluded.
   * @return  {Array<Object>} vertex list
   */
  async getAllVertexCollections(excludeOrphans?: boolean): Promise<any> {
    if (_.isNil(excludeOrphans)) {
      excludeOrphans = false;
    }
    const collections = await this.graph.vertexCollections({ excludeOrphans });
    return collections;
  }

  /**
   * Adds the collection with the given collectionName to the graph's
   * vertex collections.
   *
   * @param  {string} collectionName Name of the vertex collection to add to the graph.
   * @param  {boolean} excludeOrphans Whether orphan collections should be excluded.
   * @return  {Array<Object>} vertex list
   */
  async addVertexCollection(collectionName: string): Promise<any> {
    if (_.isNil(collectionName)) {
      throw new Error('missing vertex collection name');
    }
    let collection;
    try {
      collection = await this.graph.addVertexCollection(collectionName);
    } catch (err) {
      if (err.message.indexOf('collection already used in edge def') > -1 || err.message.indexOf('collection used in orphans') > -1) {
        return collection;
      }
      throw new Error(err.message);
    }
    return collection;
  }

  /**
   * Removes the vertex collection with the given collectionName from the graph.
   *
   * @param  {string} collectionName Name of the vertex collection to remove from the graph.
   * @param  {boolean} dropCollection If set to true, the collection will
   * also be deleted from the database.
   * @return  {Object } removed vertex
   */
  async removeVertexCollection(collectionName: string, dropCollection?: boolean):
    Promise<any> {
    if (_.isNil(collectionName)) {
      throw new Error('missing vertex collection name');
    }
    if (_.isNil(dropCollection)) {
      dropCollection = false;
    }
    const collection = await this.graph.removeVertexCollection(collectionName,
      dropCollection);
    return collection;
  }

  /**
   * @return  {Graph} A Graph instance
   */
  getGraphDB(): Graph {
    return this.graph;
  }

  /**
   * Creates a new edge between the vertices fromId and toId with the given data.
   *
   * @param  {string} collectionName name of the edge collection
   * @param  {Object} data The data of the new edge. If fromId and toId are not
   * specified, the data needs to contain the properties _from and _to.
   * @param  {string} fromId The handle of the start vertex of this edge.
   * This can be either the _id of a document in the database, the _key of an
   * edge in the collection, or a document (i.e. an object with an _id or _key property).
   * @param {string} toId The handle of the end vertex of this edge.
   * This can be either the _id of a document in the database, the _key of an
   * edge in the collection, or a document (i.e. an object with an _id or _key property).
   * @return  {Object} edge object
   */
  async createEdge(collectionName: string, data: Object, fromId?: string,
    toId?: string): Promise<Object> {
    if (_.isNil(collectionName)) {
      throw new Error('missing edge collection name');
    }
    if (_.isNil(data)) {
      data = {};
    }

    const collection = this.graph.edgeCollection(collectionName);
    return collection.save(data, fromId, toId);
  }

  /**
   * Retrieves the edge with the given documentHandle from the collection.
   *
   * @param  {String} collectionName collection name
   * @param  {String} documentHandle edge key
   * @return  {Object} edge object
   */
  async getEdge(collectionName: string, documentHandle: string): Promise<Object> {
    if (_.isNil(collectionName)) {
      throw new Error('missing edge collection name');
    }
    if (_.isNil(documentHandle)) {
      throw new Error('missing docuemnt handle');
    }
    const collection = this.graph.edgeCollection(collectionName);
    return collection.edge(documentHandle);
  }

  /**
  * Retrieves a list of all edges of the document with the given documentHandle.
  *
  * @param  {String} collectionName edge collection name
  * @param  {String} documentHandle The handle of the document to retrieve
  * the edges of. This can be either the _id of a document in the database,
  * the _key of an edge in the collection, or a document
  * (i.e. an object with an _id or _key property).
  * @return  {Object} edge object
  */
  async getAllEdgesForVertice(collectionName: string, documentHandle: string):
    Promise<[Object]> {
    if (_.isNil(collectionName)) {
      throw new Error('missing edge collection name');
    }
    if (_.isNil(documentHandle)) {
      throw new Error('missing document handle');
    }
    const collection = this.graph.edgeCollection(collectionName);
    return collection.edges(documentHandle);
  }

  /**
  * get all incoming edges.
  *
  * @param  {String} collectionName edge collection name
  * @param  {String} documentHandle The handle of the document
  * @return  {[Object]} list of edges
  */
  async getInEdges(collectionName: string, documentHandle: string):
    Promise<[Object]> {
    if (_.isNil(collectionName)) {
      throw new Error('missing edge name');
    }
    if (_.isNil(documentHandle)) {
      throw new Error('missing document handle');
    }
    const collection = this.graph.edgeCollection(collectionName);
    return collection.inEdges(documentHandle);
  }

  /**
  * get all outgoing edges.
  *
  * @param  {String} collectionName edge collection name
  * @param  {String} documentHandle The handle of the document
  * @return  {[Object]} list of edges
  */
  async getOutEdges(collectionName: string, documentHandle: string):
    Promise<[Object]> {
    if (_.isNil(collectionName)) {
      throw new Error('missing edge collection name');
    }
    if (_.isNil(documentHandle)) {
      throw new Error('missing document handle');
    }
    const collection = this.graph.edgeCollection(collectionName);
    return collection.outEdges(documentHandle);
  }

  traversalFilter(filterObj: any): string {
    let stringFilter;
    // there could be multiple vertices
    let condition = '';
    for (let i = 0; i < filterObj.length; i++) {
      // check if its last element in array
      if (i === (filterObj.length - 1)) {
        condition = condition + ` (vertex._id.indexOf("${filterObj[i].vertex}") > -1)`;
      } else {
        condition = condition + ` (vertex._id.indexOf("${filterObj[i].vertex}") > -1)  ||`;
      }
    }
    stringFilter = `if (${condition}) { return \"exclude\";} return;`;
    return stringFilter;
  }

  traversalExpander(expanderObj: any): string {
    let expanderFilter;
    // there could be multiple edges
    let condition = '';
    let directionVar;
    for (let i = 0; i < expanderObj.length; i++) {
      // check if its last element in array
      if (i === (expanderObj.length - 1)) {
        condition = condition + ` (e._id.indexOf("${expanderObj[i].edge}") > -1)`;
      } else {
        condition = condition + ` (e._id.indexOf("${expanderObj[i].edge}") > -1)  ||`;
      }
    }
    if ((expanderObj[0].direction).toLowerCase() == 'inbound') {
      directionVar = "getInEdges(vertex)";
    } else {
      directionVar = "getOutEdges(vertex)";
    }
    expanderFilter = `var connections = [];
    config.datasource.${directionVar}.forEach(function (e) {
      if( ${condition} ) {
        connections.push({ vertex: require(\"internal\").db._document(e._to), edge: e});
      }
    });
    return connections;`;
    return expanderFilter;
  }

  /**
  * collection traversal - Performs a traversal starting from the given
  * startVertex and following edges contained in this edge collection.
  *
  * @param {String} collectionName collection name
  * @param  {String | String[]} startVertex Start vertex or vertices.
  * This can be either the _id of a document in the database,
  * the _key of an edge in the collection, or a document
  * (i.e. an object with an _id or _key property).
  * @param  {any} opts opts.direction opts.filter, opts.visitor,
  * opts.init, opts.expander, opts.sort
  * @return  {[Object]} edge traversal path
  */
  async traversal(startVertex: string | string[], opts: any, collectionName?: string,
    edgeName?: string, data_flag?: boolean, path_flag?: boolean,
    aql?: boolean): Promise<Object> {
    let collection;
    let traversedData;
    if (_.isNil(startVertex)) {
      throw new Error('missing start vertex name');
    }
    if (opts.lowest_common_ancestor) {
      return this.findTreesCommonAncestor(startVertex as string[],
        collectionName, edgeName);
    }

    let response: any = {
      vertex_fields: [],
      data: {},
      paths: {}
    };
    if (aql && aql == true) {
      // get all the first level childrens for the start vertex
      let result = await this.getAllChildrenNodes(startVertex as string, edgeName);
      let finalResponse = [];
      for (let item of result._result) {
        finalResponse.push(_.omit(item, ['_key', '_id', '_rev']));
      }
      response.data.value = Buffer.from(JSON.stringify(finalResponse));
      return response;
    }

    const vertex = startVertex as string;
    if (_.isArray(vertex)) {
      throw new Error('Invalid number of starting vertices for traversal: ' + vertex.length);
    }
    for (let key in opts) {
      if (_.isEmpty(opts[key])) {
        delete opts[key];
      }
    }

    if (opts && opts.filter) {
      opts.filter = this.traversalFilter(opts.filter);
    } else if (opts && opts.expander) {
      opts.expander = this.traversalExpander(opts.expander);
    }

    if (!opts) {
      // make outbound traversal by default if not provided
      opts = {};
      opts.direction = 'outbound';
    }

    try {
      if (collectionName) {
        collection = this.graph.edgeCollection(collectionName);
        traversedData = await collection.traversal(vertex, opts);
      } else {
        traversedData = await this.graph.traversal(vertex, opts);
      }
    } catch (err) {
      throw { code: err.code, message: err.message };
    }
    let encodedData = new Set<Object>();
    if (data_flag) {
      if (traversedData.visited && traversedData.visited.vertices) {
        traversedData.visited.vertices = this.arrUnique(traversedData.visited.vertices);
        for (let vertice of traversedData.visited.vertices) {
          response.vertex_fields.push(_.pick(vertice, ['_id', '_key', '_rev', 'id']));
          encodedData.add(_.omit(vertice, ['_key', '_rev']));
        }
        response.data.value = encodeMessage(Array.from(encodedData));
      }
    }

    if (path_flag) {
      if (traversedData.visited && traversedData.visited.paths) {
        traversedData.visited.paths = this.arrUnique(traversedData.visited.paths);
        const encodedPaths = encodeMessage(traversedData.visited.paths);
        response.paths.value = encodedPaths;
      }
    }

    return response;
  }

  async getAllChildrenNodes(startVertex: string,
    edgeName: string): Promise<any> {
    const queryTpl = `FOR v IN 1..1 OUTBOUND @start_vertex @@edge_name RETURN v`;
    const result = await this.db.query(queryTpl, {
      start_vertex: startVertex,
      '@edge_name': edgeName
    });
    return result;
  }

  arrUnique(arr) {
    let cleaned = [];
    arr.forEach(function (itm) {
      let unique = true;
      cleaned.forEach(function (itm2) {
        if (_.isEqual(itm, itm2)) unique = false;
      });
      if (unique) cleaned.push(itm);
    });
    return cleaned;
  }

  /**
   * Finds the lowest common ancestor between two nodes of a tree-shaped graph and returns the subtree in that node.
   */
  async findTreesCommonAncestor(nodes: string[], collectionName: string,
    edgeName: string): Promise<any> {
    // preprocessing to get all the roots
    const collection = this.graph.edgeCollection(edgeName);
    const roots = {};
    for (let node of nodes) {
      node = `${collectionName}/${node}`;
      const result = await collection.traversal(node, {
        direction: 'outbound'
      });
      // const result = await this.db.query(`FOR v IN 1..10000 OUTBOUND @vertex GRAPH @graph FILTER "${rawFilter}" RETURN v`, { graph: this.graph.name, vertex: node });

      if (_.isEmpty(result.visited) || _.isEmpty(result.visited.vertices)) {
        if (!roots[node]) {
          roots[node] = [node];
        }

        continue;
      }
      const items = result.visited.vertices;
      const root = _.isArray(items) ? items[items.length - 1] : items;
      if (!roots[root._id]) {
        roots[root._id] = [node];
      } else {
        roots[root._id].push(node);
      }
    }

    const lca = async function LCA(nodeA, nodeList: string[]) {
      if (nodeList.length > 1) {
        const slices = nodeList.slice(1, nodeList.length);
        return lca(nodeA, lca(nodes[0], slices));
      } else {
        const result = [await findCommonAncestor(nodeA, nodeList[0])];
        return result;
      }
    };

    const that = this;
    const findCommonAncestor = async function findCommonAncestor(nodeA, nodeB) {
      const queryTpl = `LET firstPath = (FOR v IN 1..10000
      OUTBOUND @vertex1 GRAPH @graph RETURN v)
        FOR v,e,p IN 1..10000 OUTBOUND @vertex2 GRAPH @graph
          LET pos = POSITION(firstPath, v, true)
          FILTER pos != -1
          LIMIT 1
          let endPath = REVERSE(p.vertices)
          return endPath`;
      const result = await that.db.query(queryTpl, {
        vertex1: nodeA,
        vertex2: nodeB,
        graph: that.graph.name
      });
      if (result.count == 0) {
        throw new Error('Unimplemented: hierarchical resources do not share the same root');
      }
      const item = await result.next();
      return item[0];
    };

    let paths = []; // the edges allow us to build the tree
    for (let root in roots) {
      let ancestor: string;
      if (roots[root].length == 1) {
        ancestor = root;
      } else {
        const list = roots[root];
        let vertex = await lca(list[0], list.slice(1, list.length));
        if (_.isArray(vertex)) {
          vertex = vertex[0];
        }
        ancestor = vertex._id;
      }
      const traversal = await collection.traversal(ancestor, {
        direction: 'inbound',
      });
      const visited = traversal.visited;
      paths = paths.concat(visited.paths);
    }

    return {
      paths: {
        value: encodeMessage(paths)
      }
    };
  }
  /**
  * Adds the given edge definition to the graph.
  *
  * @param  {string} collectionName edge collection name
  * @param  {Object} fromVertice from vertice
  * @param  {Object} toVertice from vertice
  * @return  {Object} The added edge definition
  */
  async addEdgeDefinition(collectionName: string, fromVertice: Object | [Object],
    toVertice: Object | [Object]): Promise<Object> {
    if (_.isNil(collectionName)) {
      throw new Error('missing edge collection name');
    }
    if (_.isNil(fromVertice)) {
      throw new Error('missing from vertice');
    }
    if (_.isNil(toVertice)) {
      throw new Error('missing to vertice');
    }

    if (!_.isArray(fromVertice)) {
      fromVertice = [fromVertice];
    }

    if (!_.isArray(toVertice)) {
      toVertice = [toVertice];
    }

    let edgeDef;
    try {
      edgeDef = await this.graph.addEdgeDefinition(
        {
          collection: collectionName,
          from: fromVertice,
          to: toVertice
        }
      );
    } catch (err) {
      // if edge def already exists return
      if (err.message === 'multi use of edge collection in edge def') {
        return edgeDef;
      }
      throw { code: err.code, message: err.message };
    }
  }

  /**
  *  Replaces the edge definition for the edge collection named
  *  collectionName with the given definition.
  *
  * @param  {string} collectionName Name of the edge collection
  * to replace the definition of.
  * @param  {Object} definition
  * @return  {Object} replaced edge definition
  */
  async replaceEdgeDefinition(collectionName: string, definition: Object):
    Promise<Object> {
    if (_.isNil(collectionName)) {
      throw new Error('missing edge collection name');
    }
    if (_.isNil(definition)) {
      throw new Error('missing edge definition');
    }

    return this.graph.replaceEdgeDefinition(collectionName, definition);
  }

  /**
  *  Removes the edge definition with the given definitionName form the graph.
  *
  * @param  {string} definitionName Name of the edge definition
  * to remove from the graph.
  * @param  {boolean} dropCollection If set to true, the edge collection
  * associated with the definition will also be deleted from the database.
  * @return  {Object} replaced edge definition
  */
  async removeEdgeDefinition(definitionName: string, dropCollection?: boolean):
    Promise<Object> {
    if (_.isNil(definitionName)) {
      throw new Error('missing definition name');
    }
    return this.graph.removeEdgeDefinition(definitionName, dropCollection);
  }

  /**
   * list graphs.
   *
   * @return  {Promise<any>} list all the graphs
   */
  async listGraphs(): Promise<any> {
    return this.db.listGraphs();
  }

  /**
   * Deletes the edge with the given documentHandle from the collection.
   *
   * @param {string} collectionName edge collection name
   * @param  {string} documentHandle The handle of the edge to retrieve.
   * This can be either the _id or the _key of an edge in the collection,
   * or an edge (i.e. an object with an _id or _key property).
   * @return  {Object} removed Edge
   */
  async removeEdge(collectionName: string, documentHandle: string): Promise<any> {
    if (_.isNil(collectionName)) {
      throw new Error('missing edge collection name');
    }
    if (_.isNil(documentHandle)) {
      throw new Error('missing document handle');
    }
    const collection = this.graph.edgeCollection(collectionName);
    return collection.remove(documentHandle);
  }
}

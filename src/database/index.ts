/**
 * A key, value map containing database providers.
 * Database providers are registered with the register function.
 */
const databases = {};

/**
 * Register a database provider.
 *
 * @param  {string} name     database provider identifier
 * @param  {constructor} provider database provider constructor function
 */
export function register(name: string, provider: any): any {
  databases[name] = provider;
}


// Add default providers
register('arango', require('./provider/arango').create);
register('nedb', require('./provider/nedb').create);

/**
 * Get a new database connection.
 * @param {Object} config Database configuration.
 * @param [Logger] logger
 * @return {Promise} New, active and ready database connection.
 */
export async function get(config: any, logger: any, graphName?: string): Promise<DatabaseProvider> {
  const db = databases[config.provider];
  if (!db) {
    throw new Error(`database provider ${config.provider} does not exist`);
  }
  return db(config, logger, graphName);
}

export interface DatabaseProvider {
  insert(collectionName: string, documents: any): Promise<void>;
  find(collectionName: string, filter?: any, options?: any): Promise<Array<any>>;
  findByID(collectionName: string, ids: string | string[], options?: any): Promise<Array<any>>;
  update(collectionName: string, filter: any, document: any): Promise<Array<any>>;
  upsert(collectionName: string, documents: any): Promise<Array<any>>;
  delete(collectionName: string, filter?: any): Promise<void>;
  count(collectionName: string, filter?: any): Promise<number>;
  truncate(collectionName?: string): Promise<void>;

  registerCustomQuery?: (name: string, script: string, type?: string) => any;
  unregisterCustomQuery?: (name: string) => any;
  listCustomQueries?: () => Array<any>;
}


export interface GraphDatabaseProvider extends DatabaseProvider {
  createGraphDB(graphName: string): any;
  createVertex(collectionName: string, data: any): any;
  getVertex(collectionName: string, documentHandle: string): any;
  removeVertex(collectionName: string, documentHandles: string | string[]): any;
  getVertexCollection(collectionName: string): any;
  listVertexCollections(excludeOrphans?: boolean): any;
  getAllVertexCollections(excludeOrphans?: boolean): any;
  addVertexCollection(collectionName: string): any;
  removeVertexCollection(collectionName: string, dropCollection?: boolean): any;
  getGraphDB(): any;
  createEdge(collectionName: string, data: Object, fromId?: string, toId?: string): any;
  getEdge(collectionName: string, documentHandle: string): any;
  getAllEdgesForVertice(collectionName: string, documentHandle: string): any;
  getInEdges(collectionName: string, documentHandle: string): any;
  getOutEdges(collectionName: string, documentHandle: string): any;
  traversalFilter(filterObj: any): string;
  traversalExpander(expanderObj: any): string;
  traversal(startVertex: string | string[], opts: any, collectionName?: string, edgeName?: string): any;
  findTreesCommonAncestor(nodes: string[], collectionName: string, edgeName: string): any;
  addEdgeDefinition(collectionName: string, fromVertice: Object | [Object], toVertice: Object | [Object]): any;
  replaceEdgeDefinition(collectionName: string, definition: Object): any;
  removeEdgeDefinition(definitionName: string, dropCollection?: boolean): any;
  listGraphs(): any;
  removeEdge(collectionName: string, documentHandle: string): any;
}

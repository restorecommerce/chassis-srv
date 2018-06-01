import { Database, aql } from 'arangojs';
import * as _ from 'lodash';
import * as retry from 'async-retry';

const DB_SYSTEM = '_system';

/**
 * Ensure that the collection exists and process the query
 * @param {Object} db arangodb connection
 * @param {string} collectionName collection name
 * @param {string} query query string
 * @param {Object} args list of arguments, optional
 * @return {Promise} arangojs query result
 */
async function query(db: any, collectionName: string, query: any,
  args?: Object): Promise<any> {
  try {
    return await db.query(query, args);
  } catch (err) {
    if (err.message && err.message.indexOf('collection not found') == -1) {
      throw err;
    }
  }
  const collection = db.collection(collectionName);
  await collection.create();
  await collection.load(false);
  return await db.query(query, args);
}

/**
 * Convert id to arangodb friendly key.
 * @param {string} id document identification
 * @return {any} arangodb friendly key
 */
function idToKey(id: string): any {
  return id.replace(/\//g, '_');
}

/**
 * Ensure that the _key exists.
 * @param {Object} document Document template.
 * @return {any} Clone of the document with the _key field set.
 */
function ensureKey(document: any): any {
  const doc = _.clone(document);
  if (_.has(doc, '_key')) {
    return doc;
  }
  const id = doc.id;
  if (id) {
    _.set(doc, '_key', idToKey(id));
  }
  return doc;
}

/**
 * Remove arangodb specific fields.
 * @param {Object} document A document returned from arangodb.
 * @return {Object} A clone of the document without arangodb specific fields.
 */
function sanitizeFields(document: Object): Object {
  const doc = _.clone(document);
  _.unset(doc, '_id');
  _.unset(doc, '_key');
  _.unset(doc, '_rev');
  return doc;
}

/**
 * Auto-casting reference value by using native function of arangoDB
 *
 * @param {string} key
 * @param {object} value - raw value optional
 * @return {object} interpreted value
 */
function autoCastKey(key: any, value?: any): any {
  if (_.isDate(value)) { // Date
    return `DATE_TIMESTAMP(node.${key})`;
  }
  return 'node.' + key;
}

/**
 * Auto-casting raw data
 *
 * @param {object} value - raw value
 * @returns {any} interpreted value
 */
function autoCastValue(value: any): any {
  if (_.isArray(value)) {
    return value.map(value => `"${value.toString()}"`);
  }
  if (_.isString(value)) { // String
    return value;
  }
  if (_.isBoolean(value)) { // Boolean
    return Boolean(value);
  }
  if (_.isNumber(value)) {
    return _.toNumber(value);
  }
  if (_.isDate(value)) { // Date
    return new Date(value);
  }
  return value;
}

/**
 * Links children of filter together via a comparision operator.
 * @param {Object} filter
 * @param {string} op comparision operator
 * @param {number} index to keep track of bind variables
 * @param {any} bindVarsMap mapping of keys to values for bind variables
 * @return {any} query template string and bind variables
 */
function buildComparison(filter, op, index, bindVarsMap): any {
  const ele = _.map(filter, (e) => {
    if (!_.isArray(e)) {
      e = [e];
    }
    e = buildFilter(e, index, bindVarsMap);
    index += 1;
    return e.q;
  });

  let q = '( ';
  for (let i = 0; i < ele.length; i += 1) {
    if (i == ele.length - 1) {
      q = `${q}  ${ele[i]} )`;
    } else {
      q = `${q}  ${ele[i]} ${op} `;
    }
  }
  return { q, bindVarsMap };
}

/**
 * Creates a filter key, value.
 * When the value is a string, boolean, number or date a equal comparision is created.
 * Otherwise if the key corresponds to a known operator, the operator is constructed.
 * @param {string} key
 * @param {string|boolean|number|date|object} value
 * @param {number} index to keep track of bind variables
 * @param {any} bindVarsMap mapping of keys to values for bind variables
 * @return {String} query template string
 */
function buildField(key: any, value: any, index: number, bindVarsMap: any):
  string {
  let bindValueVar = `@value${index}`;
  let bindValueVarWithOutPrefix = `value${index}`;
  if (_.isString(value) || _.isBoolean(value) || _.isNumber(value || _.isDate(value))) {
    bindVarsMap[bindValueVarWithOutPrefix] = autoCastValue(value);
    return autoCastKey(key, value) + ' == ' + bindValueVar;
  }
  if (value.$eq) {
    bindVarsMap[bindValueVarWithOutPrefix] = autoCastValue(value.$eq);
    return autoCastKey(key, value) + ' == ' + bindValueVar;
  }
  if (value.$gt) {
    bindVarsMap[bindValueVarWithOutPrefix] = autoCastValue(value.$gt);
    return autoCastKey(key, value) + ' > ' + bindValueVar;
  }
  if (value.$gte) {
    bindVarsMap[bindValueVarWithOutPrefix] = autoCastValue(value.$gte);
    return autoCastKey(key, value) + ' >= ' + bindValueVar;
  }
  if (value.$lt) {
    bindVarsMap[bindValueVarWithOutPrefix] = autoCastValue(value.$lt);
    return autoCastKey(key, value) + ' < ' + bindValueVar;
  }
  if (value.$lte) {
    bindVarsMap[bindValueVarWithOutPrefix] = autoCastValue(value.$lte);
    return autoCastKey(key, value) + ' <= ' + bindValueVar;
  }
  if (value.$ne) {
    bindVarsMap[bindValueVarWithOutPrefix] = autoCastValue(value.$ne);
    return autoCastKey(key, value) + ' != ' + bindValueVar;
  }
  if (value.$inVal) {
    bindVarsMap[bindValueVarWithOutPrefix] = autoCastValue(value.$inVal);
    return bindValueVar + ' IN ' + autoCastKey(key, value);
  }
  if (value.$in) {
    bindVarsMap[bindValueVarWithOutPrefix] = autoCastValue(value.$in);
    if (_.isString(value.$in)) {
      // if it is a field which should be an array
      // (useful for querying within a document list-like attributen
      return bindValueVar + ' IN ' + autoCastKey(key);
    }
    // assuming it is a list of provided values
    return autoCastKey(key, value) + ' IN ' + bindValueVar;
  }
  if (value.$nin) {
    bindVarsMap[bindValueVarWithOutPrefix] = autoCastValue(value.$nin);
    return autoCastKey(key, value) + ' NOT IN ' + bindValueVar;
  }
  if (value.$not) {
    const temp = buildField(key, value.$not, index, bindVarsMap);
    return `!(${temp})`;
  }
  if (_.has(value, '$isEmpty')) {
    bindVarsMap[bindValueVarWithOutPrefix] = autoCastValue('');
    // will always search for an empty string
    return autoCastKey(key, '') + ' == ' + bindValueVar;
  }
  if (value.$startswith) {
    let bindValueVar1 = `@value${index + 1}`;
    let bindValueVarWithOutPrefix1 = `value${index + 1}`;
    const k = autoCastKey(key);
    const v = autoCastValue(value.$startswith);
    bindVarsMap[bindValueVarWithOutPrefix] = v;
    bindVarsMap[bindValueVarWithOutPrefix1] = v;
    return `LEFT(${k}, LENGTH(${bindValueVar})) == ${bindValueVar1}`;
  }
  if (value.$endswith) {
    let bindValueVar1 = `@value${index + 1}`;
    let bindValueVarWithOutPrefix1 = `value${index + 1}`;
    const k = autoCastKey(key);
    const v = autoCastValue(value.$endswith);
    bindVarsMap[bindValueVarWithOutPrefix] = v;
    bindVarsMap[bindValueVarWithOutPrefix1] = v;
    return `RIGHT(${k}, LENGTH(${bindValueVar})) == ${bindValueVar1}`;
  }
  throw new Error(`unsupported operator ${_.keys(value)} in ${key}`);
}

/**
 * Build ArangoDB query based on filter.
 * @param {Object} filter key, value tree object.
 * @param {number} index to keep track of bind variables
 * @param {any} bindVarsMap mapping of keys to values for bind variables
 * @return {any} query template string and bind variables
 */
function buildFilter(filter: any, index?: number, bindVarsMap?: any): any {
  if (!index) {
    index = 0;
  }
  if (!bindVarsMap) {
    bindVarsMap = {};
  }
  if (filter.length > 0) {
    let q: any = '';
    let multipleFilters = false;
    for (let eachFilter of filter) {
      _.forEach(eachFilter, (value, key) => {
        switch (key) {
          case '$or':
            if (!multipleFilters) {
              q = buildComparison(value, '||', index, bindVarsMap).q;
              multipleFilters = true;
              // since there is a possiblility for recursive call from buildComparision to buildFilter again.
              index += 1;
            } else {
              q = q + '&& ' + buildComparison(value, '||', index, bindVarsMap).q;
              index += 1;
            }
            break;
          case '$and':
            if (!multipleFilters) {
              q = buildComparison(value, '&&', index, bindVarsMap).q;
              multipleFilters = true;
              index += 1;
            } else {
              q = q + '&& ' + buildComparison(value, '&&', index, bindVarsMap).q;
              index += 1;
            }
            break;
          default:
            if (_.startsWith(key, '$')) {
              throw new Error(`unsupported query operator ${key}`);
            }
            if (!multipleFilters) {
              q = buildField(key, value, index, bindVarsMap);
              multipleFilters = true;
              index += 1;
            } else {
              q = q + ' && ' + buildField(key, value, index, bindVarsMap);
              index += 1;
            }
            break;
        }
      });
    }
    return { q, bindVarsMap };
  }
}

/**
 * Build count and offset filters.
 * @param {Object} options query options
 * @return {String} template query string
 */
function buildLimiter(options: any): string {
  // LIMIT count
  // LIMIT offset, count
  if (!_.isNil(options.limit)) {
    if (!_.isNil(options.offset)) {
      return `LIMIT @offset, @limit`;
    }
    return `LIMIT @limit`;
  }
  return '';
}

/**
 * Build sort filter.
 * @param {Object} options query options
 * @param {number} index to keep track of bind variables
 * @param {any} bindVarsMap Object containing bind key to values
 * @return {any} template query string and bind variables Object
 */
function buildSorter(options: any, index?: number, bindVarsMap?: any): any {
  if (_.isNil(options.sort) || _.isEmpty(options.sort)) {
    return '';
  }

  if (!index) {
    index = 0;
  }
  if (!bindVarsMap) {
    bindVarsMap = {};
  }

  const sort = _.mapKeys(options.sort, (value, key) => {
    return autoCastKey(key);
  });
  let sortKeysOrder = '';
  let i = 1;
  let objLength = Object.keys(sort).length;
  for (let key in sort) {
    if (objLength == i) {
      // Do not append ',' for the last element
      sortKeysOrder = `${sortKeysOrder} ${key} ${sort[key]} `;
    } else {
      sortKeysOrder = `${sortKeysOrder} ${key} ${sort[key]},`;
    }
    i += 1;
  }
  return 'SORT ' + sortKeysOrder;
}

function buildReturn(options: any): any {
  let excludeIndex = 0;
  let includeIndex = 0;
  let bindVarsMap = {};
  let q = '';
  if (_.isNil(options.fields) || _.isEmpty(options.fields)) {
    return { q, bindVarsMap };
  }
  const keep = [];
  const exclude = [];
  _.forEach(options.fields, (value, key) => {
    switch (value) {
      case 0:
        bindVarsMap[`exclude${excludeIndex}`] = key;
        exclude.push(`@exclude${excludeIndex}`);
        excludeIndex += 1;
        break;
      case 1:
      default:
        bindVarsMap[`include${includeIndex}`] = key;
        keep.push(`@include${includeIndex}`);
        includeIndex += 1;
    }
  });
  if (keep.length > 0) {
    const include = _.join(_.map(keep, (e) => { return e; }));
    q = `RETURN KEEP( node, ${include} )`;
    return { q, bindVarsMap };
  }
  if (exclude.length > 0) {
    const unset = _.join(_.map(exclude, (e) => { return e; }));
    q = `RETURN UNSET( node, ${unset} )`;
    return { q, bindVarsMap };
  }
  q = 'RETURN result';
  return { q, bindVarsMap };
}

/**
 * ArangoDB database provider.
 */
class Arango {
  db: any;
  /**
   * ArangoDB provider
   *
   * @param {Object} conn Arangojs database connection.
   */
  constructor(conn: any) {
    this.db = conn;
  }

  /**
   * Insert documents into database.
   *
   * @param  {String} collection Collection name
   * @param  {Object|array.Object} documents  A single or multiple documents.
   */
  async insert(collectionName: string, documents: any): Promise<any> {
    if (_.isNil(collectionName) || !_.isString(collectionName) || _.isEmpty(collectionName)) {
      throw new Error('invalid or missing collection argument');
    }
    if (_.isNil(documents)) {
      throw new Error('invalid or missing documents argument');
    }
    let docs = _.cloneDeep(documents);
    if (!_.isArray(documents)) {
      docs = [documents];
    }
    _.forEach(docs, (document, i) => {
      docs[i] = ensureKey(document);
    });
    const collection = this.db.collection(collectionName);
    const queryTemplate = aql`FOR document in ${docs} INSERT document INTO ${collection}`;
    await query(this.db, collectionName, queryTemplate);
  }

  /**
   * Find documents based on filter.
   *
   * @param  {String} collection Collection name
   * @param  {Object} filter     Key, value Object
   * @param  {Object} options     options.limit, options.offset
   * @return {Promise<any>}  Promise for list of found documents.
   */
  async find(collectionName: string, filter: any, options: any): Promise<any> {
    if (_.isNil(collectionName) || !_.isString(collectionName) ||
      _.isEmpty(collectionName)) {
      throw new Error('invalid or missing collection argument');
    }

    let filterQuery: any = filter || {};
    const opts = options || {};
    let filterResult: any;
    let bindVars: any;

    if (!_.isArray(filterQuery)) {
      filterQuery = [filterQuery];
    }
    if (_.isEmpty(filterQuery[0])) {
      filterQuery = true;
    }
    else {
      filterResult = buildFilter(filterQuery);
      filterQuery = filterResult.q;
    }

    let sortQuery = buildSorter(opts);
    let limitQuery = buildLimiter(opts);
    let returnResult = buildReturn(opts);
    let returnQuery = returnResult.q;
    // return complete node in case no specific fields are specified
    if (_.isEmpty(returnQuery)) {
      returnQuery = 'RETURN node';
    }
    let queryString = `FOR node in @@collection FILTER ${filterQuery} ${sortQuery}
      ${limitQuery} ${returnQuery}`;
    let varArgs = {};
    if (filterResult && filterResult.bindVarsMap) {
      varArgs = filterResult.bindVarsMap;
    }
    let returnArgs = {};
    if (returnResult && returnResult.bindVarsMap) {
      returnArgs = returnResult.bindVarsMap;
    }
    let limitArgs;
    if (_.isEmpty(limitQuery)) {
      limitArgs = {};
    } else {
      if (!_.isNil(opts.limit)) {
        limitArgs = { limit: opts.limit };
        if (!_.isNil(opts.offset)) {
          limitArgs = { offset: opts.offset, limit: opts.limit };
        }
      }
    }
    varArgs = Object.assign(varArgs, limitArgs);
    varArgs = Object.assign(varArgs, returnArgs);
    bindVars = Object.assign({
      '@collection': collectionName
    }, varArgs);
    const res = await query(this.db, collectionName, queryString, bindVars);
    const docs = await res.all();
    _.forEach(docs, (doc, i) => {
      docs[i] = sanitizeFields(doc);
    });
    return docs;
  }

  /**
   * Find documents by id (_key).
   *
   * @param  {String} collection Collection name
   * @param  {String|array.String} ids  A single ID or multiple IDs.
   * @return {Promise<any>} A list of found documents.
   */
  async findByID(collectionName: string, ids: any): Promise<any> {
    if (_.isNil(collectionName) || !_.isString(collectionName) ||
      _.isEmpty(collectionName)) {
      throw new Error('invalid or missing collection argument');
    }

    if (_.isNil(ids)) {
      throw new Error('invalid or missing ids argument');
    }
    if (!_.isArray(ids)) {
      ids = [ids];
    }
    const idVals = new Array(ids.length);
    const filter = ids.map((id) => {
      return { id };
    });

    let filterResult = buildFilter(filter);
    let filterQuery = filterResult.q;

    let varArgs = {};
    if (filterResult && filterResult.bindVarsMap) {
      varArgs = filterResult.bindVarsMap;
    }

    const queryString = `FOR node in @@collection FILTER ${filterQuery} RETURN node`;
    const bindVars = Object.assign({
      '@collection': collectionName
    }, varArgs);
    const res = await query(this.db, collectionName, queryString, bindVars);
    const docs = await res.all();
    _.forEach(docs, (doc, i) => {
      docs[i] = sanitizeFields(doc);
    });
    return docs;
  }

  /**
   * Find documents by filter and updates them with document.
   *
   * @param  {String} collection Collection name
   * @param  {Object} filter     Key, value Object
   * @param  {Object} document  A document patch.
   */
  async update(collectionName: string, filter: any, document: any): Promise<any> {
    if (_.isNil(collectionName) ||
      !_.isString(collectionName) || _.isEmpty(collectionName)) {
      throw new Error('invalid or missing collection argument');
    }
    if (_.isNil(document)) {
      throw new Error('invalid or missing document argument');
    }
    const doc = ensureKey(_.clone(document));
    const collection = this.db.collection(collectionName);
    let queryString = aql`FOR node in ${collection}
      FILTER node.id == ${doc.id}
      UPDATE node WITH ${doc} in ${collection} return NEW`;

    const res = await query(this.db, collectionName, queryString);
    const upDocs = await res.all();
    return _.map(upDocs, (d) => {
      return sanitizeFields(d);
    });
  }

  /**
   * Find each document based on it's key and update it.
   * If the document does not exist it will be created.
   *
   * @param  {String} collection Collection name
   * @param {Object|Array.Object} documents
   */
  async upsert(collectionName: string, documents: any): Promise<any> {
    if (_.isNil(collectionName) ||
      !_.isString(collectionName) || _.isEmpty(collectionName)) {
      throw new Error('invalid or missing collection argument');
    }
    if (_.isNil(documents)) {
      throw new Error('invalid or missing documents argument');
    }
    let docs = _.cloneDeep(documents);
    if (!_.isArray(documents)) {
      docs = [documents];
    }
    _.forEach(docs, (document, i) => {
      docs[i] = ensureKey(document);
    });
    const collection = this.db.collection(collectionName);
    const queryTemplate = aql`FOR document in ${docs} UPSERT { _key: document._key }
      INSERT document UPDATE document IN ${collection} return NEW`;

    const res = await query(this.db, collectionName, queryTemplate);
    const newDocs = await res.all();
    _.forEach(newDocs, (doc, i) => {
      newDocs[i] = sanitizeFields(doc);
    });
    return newDocs;
  }

  /**
   * Delete all documents selected by filter.
   *
   * @param  {String} collection Collection name
   * @param  {Object} filter
   */
  async delete(collectionName: string, filter: any): Promise<any> {
    if (_.isNil(collectionName) ||
      !_.isString(collectionName) || _.isEmpty(collectionName)) {
      throw new Error('invalid or missing collection argument');
    }

    let filterQuery: any = filter || {};
    let filterResult: any;
    if (!_.isArray(filterQuery)) {
      filterQuery = [filterQuery];
    }

    if (_.isEmpty(filterQuery[0])) {
      filterQuery = true;
    }
    else {
      filterResult = buildFilter(filterQuery);
      filterQuery = filterResult.q;
    }
    let varArgs = {};
    if (filterResult && filterResult.bindVarsMap) {
      varArgs = filterResult.bindVarsMap;
    }

    let queryString = `FOR node in @@collection FILTER ${filterQuery} REMOVE
      node in @@collection`;
    const bindVars = Object.assign({
      '@collection': collectionName
    }, varArgs);

    await query(this.db, collectionName, queryString, bindVars);
  }

  /**
   * Count all documents selected by filter.
   *
   * @param  {String} collection Collection name
   * @param  {Object} filter
   */
  async count(collectionName: string, filter: any): Promise<any> {
    if (_.isNil(collectionName) ||
      !_.isString(collectionName) || _.isEmpty(collectionName)) {
      throw new Error('invalid or missing collection argument');
    }
    let filterQuery: any = filter || {};
    let filterResult: any;
    if (!_.isArray(filterQuery)) {
      filterQuery = [filterQuery];
    }

    if (_.isEmpty(filterQuery[0])) {
      filterQuery = true;
    }
    else {
      filterResult = buildFilter(filterQuery);
      filterQuery = filterResult.q;
    }

    let varArgs = {};
    if (filterResult && filterResult.bindVarsMap) {
      varArgs = filterResult.bindVarsMap;
    }
    let queryString = `FOR node in @@collection FILTER ${filterQuery} COLLECT WITH COUNT
      INTO length RETURN length`;
    const bindVars = Object.assign({
      '@collection': collectionName
    }, varArgs);

    const res = await query(this.db, collectionName, queryString, bindVars);
    const nn = await res.all();
    return nn[0];
  }

  /**
   * When calling without a collection name,
   * delete all documents in all collections in the database.
   * When providing a collection name,
   * delete all documents in specified collection in the database.
   * @param [string] collection Collection name.
   */
  async truncate(collection: string): Promise<any> {
    if (_.isNil(collection)) {
      const collections = await this.db.collections();
      for (let i = 0; i < collections.length; i += 1) {
        await collections[i].truncate();
      }
    } else {
      const c = this.db.collection(collection);
      await c.truncate();
    }
  }
}

/**
 * Connect to a ArangoDB.
 * @param {Object} conf Connection options.
 * @param {Logger} logger
 * @return active ArangoDB connection
 */
async function connect(conf: any, logger: any): Promise<any> {
  const dbHost = conf.host || '127.0.0.1';
  const dbPort = conf.port || 8529;
  const dbName = conf.database || 'arango';
  const autoCreate = conf.autoCreate || false;
  const attempts = conf.retries || 3;
  const delay = conf.delay || 1000;
  const arangoVersion = conf.version || 30000;

  let url = 'http://';

  const username = conf.username;
  const password = conf.password;

  if (username && password) {
    url = url + `${username}:${password}@`;
  }

  url = url + `${dbHost}:${dbPort}`;

  let mainError;
  let i = 1;
  try {
    return await retry(async () => {
      logger.info('Attempt to connect database', dbHost, dbPort, dbName, {
        attempt: i
      });
      i += 1;
      const db = new Database({
        url,
        arangoVersion,
      });
      try {
        db.useDatabase(dbName);

        if (username && password) {
          db.useBasicAuth(username, password);
        }
        await db.get();
      } catch (err) {
        if (err.name === 'ArangoError' && err.errorNum === 1228) {
          if (autoCreate) {
            logger.verbose(`auto creating arango database ${dbName}`);
            // Database does not exist, create a new one
            db.useDatabase(DB_SYSTEM);
            await db.createDatabase(dbName);
            db.useDatabase(dbName);
            return db;
          }
        }
        throw err;
      }
      return db;
    }, { retries: attempts, minTimeout: delay });
  }
  catch (err) {
    logger.error(
      'Database connection error',
      err, dbHost, dbPort, dbName, {
        attempt: i
      });
    mainError = err;
  }
  throw mainError;
}

/**
 * Create a new connected ArangoDB provider.
 *
 * @param  {Object} conf   ArangoDB configuration
 * @param  {Object} [logger] Logger
 * @return {Arango}        ArangoDB provider
 */
export async function create(conf: any, logger: any): Promise<any> {
  let log = logger;
  if (_.isNil(logger)) {
    log = {
      verbose: () => { },
      info: () => { },
      error: () => { },
    };
  }
  const conn = await connect(conf, log);
  return new Arango(conn);
}

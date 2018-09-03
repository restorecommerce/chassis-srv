import { Database, aql } from 'arangojs';
import * as _ from 'lodash';
import { buildFilter, buildSorter, buildLimiter, buildReturn, sanitizeFields, query, ensureKey } from './common';
import { DatabaseProvider } from '../..';
import { ArrayCursor } from 'arangojs/lib/cjs/cursor';

export interface CustomQuery {
  code: string; // AQL code
  // filter - combinable with the generic `find` query
  // query - standalone
  type: 'filter' | 'query';
}
/**
 * ArangoDB database provider.
 */
export class Arango implements DatabaseProvider {
  db: Database;
  customQueries: Map<string, CustomQuery>;
  /**
   *
   * @param {Object} conn Arangojs database connection.
   */
  constructor(conn: any) {
    this.db = conn;
    this.customQueries = new Map<string, CustomQuery>();
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

    let customQuery: CustomQuery;

    let filterQuery: any = filter || {};
    const opts = options || {};
    let filterResult: any;
    let bindVars: any;

    // checking if a custom query should be used
    if (!_.isEmpty(opts.customQuery)) {
      if (!this.customQueries.has(opts.customQuery)) {
        throw new Error('custom query not found');
      }
      customQuery = this.customQueries.get(opts.customQuery);
      if (customQuery.type == 'query') {
        // standalone query
        const result: ArrayCursor = await query(this.db, collectionName, customQuery.code, opts.customArguments || {}); // Cursor object
        return result.all(); // TODO: paginate
      }
    }

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
    let queryString = `FOR node in @@collection FILTER ${filterQuery}`;
    if (customQuery && customQuery.type == 'filter') {
      queryString += ` FILTER ${customQuery.code} `;
    }
    queryString   += ` ${sortQuery}
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
    varArgs = _.assign(varArgs, limitArgs);
    varArgs = _.assign(varArgs, returnArgs);
    bindVars = _.assign({
      '@collection': collectionName
    }, varArgs);
    if (customQuery && opts.customArguments) {
      bindVars = _.assign(bindVars, opts.customArguments);
    }

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
  async findByID(collectionName: string, ids: string | string[]): Promise<any> {
    if (_.isNil(collectionName) || !_.isString(collectionName) ||
      _.isEmpty(collectionName)) {
      throw new Error('invalid or missing collection argument');
    }

    if (_.isNil(ids)) {
      throw new Error('invalid or missing ids argument');
    }
    if (!_.isArray(ids)) {
      ids = [ids as string];
    }
    const filter = (ids as string[]).map((id) => {
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
        const c = this.db.collection(collections[i].name);
        await c.truncate();
      }
    } else {
      const c = this.db.collection(collection);
      await c.truncate();
    }
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
   * Registers a custom AQL query.
   *
   * @param script
   * @param name
   */
  registerCustomQuery(name: string, script: string, type: 'filter' | 'query'): void {
    this.customQueries.set(name, {
      code: script,
      type
    });
  }

  /**
   * Unregisters a custom query.
   * @param name
   */
  unregisterCustomQuery(name: string): void {
    if (!this.customQueries.has(name)) {
      throw new Error('custom function not found');
    }
    this.customQueries.delete(name);
  }

  listCustomQueries(): Array<any> {
    return [...this.customQueries];
  }
}

import { Database, aql } from 'arangojs';
import * as _ from 'lodash';
import {
  buildFilter, buildSorter, buildLimiter, buildReturn,
  sanitizeInputFields, query, sanitizeOutputFields
} from './common';
import { DatabaseProvider } from '../..';
import { ViewAnalyzerOptions, ViewMap } from './interface';
import { Logger } from 'winston';

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
  public readonly customQueries = new Map<string, CustomQuery>();
  public readonly collectionNameAnalyzerMap = new Map<string, ViewMap>();
  /**
   *
   * @param {Object} conn Arangojs database connection.
   */
  constructor(
    public readonly db: Database,
    public readonly logger?: Logger,
  ) {}

  /**
   * Find documents based on filter.
   *
   * @param  {String} collectionName Collection name
   * @param  {Object} filter     Key, value Object
   * @param  {Object} options     options.limit, options.offset
   * @return {Promise<any>}  Promise for list of found documents.
   */
  async find(collectionName: string, filter?: any, options?: any): Promise<any> {
    if (_.isNil(collectionName) || !_.isString(collectionName) ||
      _.isEmpty(collectionName)) {
      this.logger?.error('invalid or missing collection argument for find operation');
      throw new Error('invalid or missing collection argument for find operation');
    }

    let filterQuery: any = filter ?? {};
    const opts = options ?? {};
    let filterResult: any;
    let bindVars: any;

    let customFilter = '';
    // checking if a custom query should be used
    if (!_.isEmpty(opts.customQueries)) {
      for (let queryName of opts.customQueries) {
        if (!this.customQueries.has(queryName)) {
          this.logger?.error(`custom query ${query} not found`);
          throw new Error(`custom query ${query} not found`);
        }
        const customQuery = this.customQueries.get(queryName);
        if (customQuery.type == 'query') {
          // standalone query
          const result = await query(this.db, collectionName, customQuery.code, opts.customArguments || {}); // Cursor object
          return result.all(); // TODO: paginate
        } else {
          // filter
          customFilter += ` ${customQuery.code} `;
        }
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
    // if search options are set build search query
    let searchQuery;
    if (opts?.search?.search) {
      const searchString = JSON.stringify(options.search.search);
      if (this.collectionNameAnalyzerMap && this.collectionNameAnalyzerMap.get(collectionName)) {
        const searchFields = (options?.search?.fields?.length > 0) ? options.search.fields : this.collectionNameAnalyzerMap.get(collectionName).fields;
        const similarityThreshold = this.collectionNameAnalyzerMap.get(collectionName).similarityThreshold;
        const viewName = this.collectionNameAnalyzerMap.get(collectionName).viewName;

        const caseSensitive = options?.search?.case_sensitive;
        const analyzerOptions: any = this.collectionNameAnalyzerMap.get(collectionName).analyzerOptions;
        let analyzerName;
        if (caseSensitive) {
          // for casesensitive search use "ngram" analayzer type
          analyzerOptions.forEach((optionObj) => {
            let keyName = Object.keys(optionObj)[0];
            if (optionObj[keyName].type === 'ngram') {
              analyzerName = JSON.stringify(keyName);
            }
          });
        } else {
          // for case-insensitive search use "pipleline" type (ngram + norm)
          analyzerOptions.forEach((optionObj) => {
            let keyName = Object.keys(optionObj)[0];
            if (optionObj[keyName].type === 'pipeline') {
              analyzerName = JSON.stringify(keyName);
            }
          });
        }
        for (let field of searchFields) {
          if (!searchQuery) {
            searchQuery = `NGRAM_MATCH(node.${field}, ${searchString}, ${similarityThreshold}, ${analyzerName}) `;
          } else {
            searchQuery = searchQuery + `OR NGRAM_MATCH(node.${field}, ${searchString}, ${similarityThreshold}, ${analyzerName}) `;
          }
        }
        // override collection name with view name
        collectionName = viewName;
        // override sortQuery (to rank based on score for frequency search match - term frequency–inverse document frequency algorithm TF-IDF)
        sortQuery = `SORT TFIDF(node) DESC`;
      } else {
        this.logger?.info(`View and analyzer configuration data not set for ${collectionName} and hence ignoring search string`);
      }
    }

    let queryString = `FOR node in @@collection FILTER ${filterQuery}`;
    if (searchQuery) {
      queryString = `FOR node in @@collection SEARCH ${searchQuery} FILTER ${filterQuery}`;
    }
    if (!_.isEmpty(customFilter)) {
      queryString += customFilter;
    }

    queryString += ` ${sortQuery}
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
    if (!_.isEmpty(customFilter) && opts.customArguments) {
      bindVars = _.assign(bindVars, { customArguments: opts.customArguments });
    }
    let res;
    if (!searchQuery) {
      res = await query(this.db, collectionName, queryString, bindVars);
    } else {
      res = await this.db.query(queryString, bindVars);
    }
    const docs = await res.all(); // TODO: paginate

    return _.map(docs, sanitizeOutputFields);
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
      this.logger?.error('invalid or missing collection argument for findByID operation');
      throw new Error('invalid or missing collection argument for findByID operation');
    }

    if (_.isNil(ids)) {
      this.logger?.error('invalid or missing ids argument for findByID operation');
      throw new Error('invalid or missing ids argument for findByID operation');
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
    return _.map(docs, sanitizeOutputFields);
  }

  /**
   * retreive the documents including the document handlers (_key, _id and _rev).
   *
   * @param  {String} collectionName Collection name
   * @param  {any} collection Collection Object
   * @param  {any} documents list of documents
   * @param  {string[]} idsArray list of document ids
   * @returns  {Promise<any>} A list of documents including the document handlers
   */
  async getDocumentHandlers(collectionName: string, collection: any, documents: any,
    idsArray?: string[]): Promise<any> {
    let ids = [];
    if (documents && !_.isArray(documents)) {
      documents = [documents];
    }
    if (documents && documents.length > 0) {
      for (let doc of documents) {
        ids.push(doc.id);
      }
    }
    if (!_.isEmpty(idsArray) && _.isArray(idsArray)) {
      ids = idsArray;
    }
    let queryString = aql`FOR node in ${collection}
      FILTER node.id IN ${ids} return node`;
    const res = await query(this.db, collectionName, queryString);
    const docsWithSelector = await res.all();
    return docsWithSelector;
  }

  /**
   * Find documents by filter and updates them with document.
   *
   * @param  {String} collection Collection name
   * @param  {Object} updateDocuments  List of documents to update
   */
  async update(collectionName: string, updateDocuments: any): Promise<any> {
    let documents = _.cloneDeep(updateDocuments);
    let updateDocsResponse = [];
    if (_.isNil(collectionName) ||
      !_.isString(collectionName) || _.isEmpty(collectionName)) {
      this.logger?.error('invalid or missing collection argument for update operation');
      throw new Error('invalid or missing collection argument for update operation');
    }
    if (_.isNil(documents)) {
      this.logger?.error('invalid or missing document argument for update operation');
      throw new Error('invalid or missing document argument for update operation');
    }
    const collection = this.db.collection(collectionName);
    const collectionExists = await collection.exists();
    if (!collectionExists) {
      this.logger?.error(`Collection ${collectionName} does not exist for update operation`);
      throw new Error(`Collection ${collectionName} does not exist for update operation`);
    }
    if (!_.isArray(documents)) {
      this.logger?.error(`Documents should be list for update operation`);
      throw new Error(`Documents should be list for update operation`);
    }
    const docsWithHandlers = await this.getDocumentHandlers(collectionName, collection, documents);

    // update _key for the input documents
    for (let document of documents) {
      let foundInDB = false;
      for (let docWithHandler of docsWithHandlers) {
        if (docWithHandler.id === document.id) {
          foundInDB = true;
          document._key = docWithHandler._key;
          break;
        }
      }
      if (!foundInDB) {
        // if document is not found in DB use the id itself as _key
        // this key will return an array in response since it does not exist
        document._key = document.id;
      }
    }

    let updatedDocs = await collection.updateAll(documents, { returnNew: true });
    for (let doc of updatedDocs) {
      if (doc && doc.new) {
        updateDocsResponse.push(sanitizeOutputFields(doc.new));
      } else {
        updateDocsResponse.push(doc);
      }
    }
    return updateDocsResponse;
  }

  /**
   * Find each document based on it's key and update it.
   * If the document does not exist it will be created.
   *
   * @param  {String} collectionName Collection name
   * @param {Object|Array.Object} documents
   */
  async upsert(collectionName: string, documents: any): Promise<any> {
    if (_.isNil(collectionName) ||
      !_.isString(collectionName) || _.isEmpty(collectionName)) {
      this.logger?.error('invalid or missing collection argument for upsert operation');
      throw new Error('invalid or missing collection argument for upsert operation');
    }
    if (_.isNil(documents)) {
      this.logger?.error('invalid or missing documents argument for upsert operation');
      throw new Error('invalid or missing documents argument for upsert operation');
    }
    let docs = _.cloneDeep(documents);
    if (!_.isArray(documents)) {
      docs = [documents];
    }
    _.forEach(docs, (document, i) => {
      docs[i] = sanitizeInputFields(document);
    });
    let upsertResponse = [];
    const collection = this.db.collection(collectionName);
    const collectionExists = await collection.exists();
    if (!collectionExists) {
      this.logger?.error(`Collection ${collectionName} does not exist for upsert operation`);
      throw new Error(`Collection ${collectionName} does not exist for upsert operation`);
    }
    let upsertedDocs = await collection.saveAll(docs, { returnNew: true, overwriteMode: 'update' });
    if (!_.isArray(upsertedDocs)) {
      upsertedDocs = [upsertedDocs];
    }
    for (let doc of upsertedDocs) {
      if (doc && doc.new) {
        upsertResponse.push(sanitizeOutputFields(doc.new));
      } else {
        upsertResponse.push(doc);
      }
    }
    return upsertResponse;
  }

  /**
   * Delete all documents with provided identifiers ids.
   *
   * @param  {String} collection Collection name
   * @param  {Object} ids list of document identifiers
   * @return  {Promise<any>} delete response
   */
  async delete(collectionName: string, ids: string[]): Promise<any> {
    if (_.isNil(collectionName) ||
      !_.isString(collectionName) || _.isEmpty(collectionName)) {
      this.logger?.error('invalid or missing collection argument');
      throw new Error('invalid or missing collection argument');
    }
    if (_.isNil(ids) || _.isEmpty(ids)) {
      this.logger?.error('invalid or missing document IDs argument for delete operation');
      throw new Error('invalid or missing document IDs argument for delete operation');
    }
    const collection = this.db.collection(collectionName);
    const collectionExists = await collection.exists();
    if (!collectionExists) {
      this.logger?.error(`Collection ${collectionName} does not exist for delete operation`);
      throw new Error(`Collection ${collectionName} does not exist for delete operation`);
    }

    // retreive _key for the give ids
    const docsWithHandlers = await this.getDocumentHandlers(collectionName, collection, null, ids);
    for (let id of ids) {
      // check if given id is present in docsWithHandlers
      let foundDocInDB = false;
      for (let doc of docsWithHandlers) {
        if (doc.id === id) {
          foundDocInDB = true;
          break;
        }
      }
      // if document is not found in DB use the id itself as _key
      // this key will return an array in response since it does not exist
      if (!foundDocInDB) {
        docsWithHandlers.push({ _key: id });
      }
    }
    let deleteHandlerIds = [];
    for (let doc of docsWithHandlers) {
      deleteHandlerIds.push(doc._key);
    }

    return collection.removeAll(deleteHandlerIds);
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
      this.logger?.error('invalid or missing collection argument for count operation');
      throw new Error('invalid or missing collection argument for count operation');
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
   * Drop view
   * @param string[] list of view names.
   */
  async dropView(viewName: string[]): Promise<any> {
    let dropViewResponse = [];
    if (viewName.length > 0) {
      for (let view of viewName) {
        try {
          let response = await this.db.view(view).drop();
          this.logger?.info(`View ${view} dropped successfully`, response);
          if (response === true) {
            dropViewResponse.push({ id: view, code: 200, message: `View ${view} dropped successfully` });
          }
        } catch (err) {
          this.logger?.error(`Error dropping View ${view}`, { code: err.code, message: err.message, stack: err.stack });
          dropViewResponse.push({ id: view, code: err.code, message: err.message });
        }
      }
    }
    return dropViewResponse;
  }

  /**
   * Delete Analyzer
   * @param string[] list of analyzer names.
   */
  async deleteAnalyzer(analyzerName: string[]): Promise<any> {
    let deleteResponse = [];
    if (analyzerName.length > 0) {
      for (let analyzer of analyzerName) {
        try {
          let response = await this.db.analyzer(analyzer).drop();
          this.logger?.info(`Analyzer ${analyzer} deleted successfully`, response);
          if (response.code === 200 && response.error === false) {
            deleteResponse.push({ id: analyzer, code: response.code, message: `Analyzer ${analyzer} deleted successfully` });
          }
        } catch (err) {
          this.logger?.error(`Error deleting analyzer ${analyzer}`, { code: err.code, message: err.message, stack: err.stack });
          deleteResponse.push({ id: analyzer, code: err.code, message: err.message });
        }
      }
    }
    return deleteResponse;
  }

  /**
   * Insert documents into database.
   *
   * @param  {String} collection Collection name
   * @param  {Object|array.Object} documents  A single or multiple documents.
   */
  async insert(collectionName: string, documents: any): Promise<any> {
    if (_.isNil(collectionName) || !_.isString(collectionName) || _.isEmpty(collectionName)) {
      this.logger?.error('invalid or missing collection argument for insert operation');
      throw new Error('invalid or missing collection argument for insert operation');
    }
    if (_.isNil(documents)) {
      this.logger?.error('invalid or missing documents argument for insert operation');
      throw new Error('invalid or missing documents argument for insert operation');
    }
    let docs = _.cloneDeep(documents);
    if (!_.isArray(documents)) {
      docs = [documents];
    }
    _.forEach(docs, (document, i) => {
      docs[i] = sanitizeInputFields(document);
    });
    const collection = this.db.collection(collectionName);
    const collectionExists = await collection.exists();
    if (!collectionExists) {
      await collection.create();
    }
    let insertResponse = [];
    let createdDocs = await collection.saveAll(docs, { returnNew: true });
    if (!_.isArray(createdDocs)) {
      createdDocs = [createdDocs];
    }
    for (let doc of createdDocs) {
      if (doc && doc.new) {
        insertResponse.push(sanitizeOutputFields(doc.new));
      } else {
        insertResponse.push(doc);
      }
    }
    return insertResponse;
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
      this.logger?.error('custom function not found');
      throw new Error('custom function not found');
    }
    this.customQueries.delete(name);
  }

  listCustomQueries(): Array<any> {
    return [...this.customQueries];
  }

  async createAnalyzerAndView(viewConfig: ViewAnalyzerOptions, collectionName: string): Promise<void> {
    if (!viewConfig.view.viewName || !viewConfig?.view?.options) {
      this.logger?.error(`View name or view configuration missing for ${collectionName}`);
      throw new Error(`View name or view configuration missing for ${collectionName}`);
    }
    if ((!viewConfig?.analyzers) || (viewConfig.analyzers.length === 0) || !(viewConfig.analyzerOptions)) {
      this.logger?.error(`Analyzer options or configuration missing for ${collectionName}`);
      throw new Error(`Analyzer options or configuration missing for ${collectionName}`);
    }
    // create analyzer if it does not exist
    for (let analyzerName of viewConfig.analyzers) {
      const analyzer = this.db.analyzer(analyzerName);
      if (!(await analyzer.exists())) {
        try {
          let analyzerCfg = viewConfig.analyzerOptions.filter((optionsCfg) => Object.keys(optionsCfg)[0] === analyzerName);
          if (analyzerCfg?.length === 1) {
            await analyzer.create(analyzerCfg[0][analyzerName] as any);
            this.logger?.info(`Analyzer ${analyzerName} created successfully`);
          }
        } catch (err) {
          this.logger?.error(`Error creating analyzer ${analyzerName}`, { code: err.code, message: err.message, stack: err.stack });
        }
      } else {
        this.logger?.info(`Analyzer ${analyzerName} already exists`);
      }
    }

    // check if collection exits (before creating view)
    const collection = this.db.collection(collectionName);
    const collectionExists = await collection.exists();
    try {
      if (!collectionExists) {
        await collection.create();
        this.logger?.info(`Collection ${collectionName} created successfully`);
      }
    } catch (err) {
      if (err.message && err.message.indexOf('duplicate name') == -1) {
        this.logger?.error(`Error creating collection ${collectionName}`, { code: err.code, message: err.message, stack: err.stack });
        throw err;
      }
    }

    // create view if it does not exist
    const view = this.db.view(viewConfig.view.viewName);
    let viewExists = await view.exists();
    if (!viewExists) {
      try {
        await this.db.createView(viewConfig?.view?.viewName, viewConfig?.view?.options);
        this.logger?.info(`View ${viewConfig?.view?.viewName} created successfully`);
      } catch (err) {
        this.logger?.error(`Error creating View ${viewConfig?.view?.viewName}`, { code: err.code, message: err.message, stack: err.stack });
      }
    } else {
      this.logger?.info(`View ${viewConfig?.view?.viewName} already exists`);
    }
    // map the collectionName with list of indexed fields, view name, analyzerslist, similarity threshold
    // to be used in find()
    const indexedFields = Object.keys(viewConfig.view.options.links[collectionName].fields);
    this.collectionNameAnalyzerMap.set(collectionName, {
      viewName: viewConfig.view.viewName,
      fields: indexedFields,
      analyzerOptions: viewConfig.analyzerOptions,
      similarityThreshold: viewConfig.view.similarityThreshold
    });
  }
}

import * as Datastore from 'nedb';
import * as _ from 'lodash';
import { Logger } from '@restorecommerce/logger';

/**
 * Converts unsupported functions to regexp.
 * @param {object} filter query filter
 * @return {object} the filter querys which are not supported by nedb converted to regexp.
 */
const convertToRegexp = (filter: any): any => {
  const f = filter;
  _.forEach(f, (value, key) => {
    if (value.$startswith) {
      f[key] = {
        $regex: new RegExp(`^${value.$startswith}.*$`, 'i'),
      };
    } else if (value.$endswith) {
      f[key] = {
        $regex: new RegExp(`^.*${value.$endswith}$`, 'i'),
      };
    } else if (_.has(value, '$isEmpty')) {
      f[key] = {
        $regex: new RegExp(`^$`),
      };
    } else if (_.has(value, '$iLike')) {
      // neDB does not have ILIKE (LIKE with ignore case sensitive)
      // e.g.: convert %sOrT% =>  to /sort/ and find all fields
      // whose name contain the substring 'sort' using the regular expression
      let iLikeVal = f[key].$iLike.slice(1,-1).toLowerCase( );
      // convert sort =>  to regexp /sort/
      f[key] = new RegExp(iLikeVal);
    } else if (_.isObject(value)) {
      f[key] = convertToRegexp(value);
    }
  });
  return f;
};

/**
 * Construct or operator.
 * @param {Object} options the or statement
 * example: { $or: [{ planet: 'Earth' }, { planet: 'Mars' }] }
 * @param {string} name the field name the comparison is based on.
 * @return {Object} NeDB or operator query filter.
 */
const buildOrQuery = (options: any, name: string): Object => {
  let opts = options;
  if (!_.isArray(options)) {
    opts = [options];
  }
  const obj = { $or: [] };
  opts.forEach((item) => {
    const toInsert = {};
    toInsert[name] = item;
    obj.$or.push(toInsert);
  });
  return obj;
};

/**
 * NeDB database provider.
 */
class NedbProvider {
  collections: any;
  /**
   * @param {Object} collections a map, collection name mapped to store
   */
  constructor(collections: any) {
    this.collections = collections;
  }

  /**
   * Insert documents into database.
   *
   * @param  {String} collection Collection name
   * @param  {Object|array.Object} documents  A single or multiple documents.
   */
  insert(collection: string, document: any): any {
    const collections = this.collections;
    const doc = _.cloneDeep(document);
    _.set(doc, '_id', doc.id);
    collections[collection].insert(doc, (err, newdoc) => {
      // docs
      if (err) {
        throw err;
      } else {
        _.unset(newdoc, '_id');
        return newdoc;
      }
    });
  }

  /**
   * Find documents based on filter.
   *
   * @param  {String} collection Collection name
   * @param  {Object} filter     Key, value Object
   * @param  {Object} options     options.limit, options.offset
   * @return {array.Object}            A list of found documents.
   */
  async find(collection: string, filter: Object = {}, options: any = {}): Promise<any> {
    const fil = convertToRegexp(filter || {});
    let q = this.collections[collection].find(fil, options.fields);
    if (options.offset) {
      q = q.skip(options.offset);
    }
    if (options.limit) {
      q = q.limit(options.limit);
    }
    if (options.sort) {
      q = q.sort(options.sort);
    }

    const result = new Promise( (resolve, reject) => {
      q.exec((err, docs) => {
        // docs
        if (err) {
          reject(err);
        } else {
          _.map(docs, (doc) => {
            if (_.isNil(doc.id)) {
              _.set(doc, '_id', doc._id);
            }
            _.unset(doc, '_id');
          });
          resolve(docs);
        }
      });
    });
    return result;
  }

  /**
   * Find documents by id (_key).
   *
   * @param  {String} collection Collection name
   * @param  {String|array.String} identifications        A single ID or multiple IDs.
   * @return {array.Object}            A list of found documents.
   */
  async findByID(collection: string, identifications: any): Promise<any> {
    let ids = identifications;
    if (!_.isArray(identifications)) {
      ids = [identifications];
    }
    const q = buildOrQuery(ids, 'id');
    const collections = this.collections;
    const result = new Promise((resolve, reject) => {
      collections[collection].find(q).exec((err, docs) => {
        if (docs) {
          const l = docs.length;
          for (let i = 0; i < l; i += 1) {
            _.unset(docs[i], '_id');
          }
          resolve(docs);
        } else if (err) {
          reject(err);
        }
      });
    });
    return result;
  }

  /**
   * Find documents by filter and updates them with document.
   *
   * @param  {String} collection Collection name
   * @param  {Object} filter     Key, value Object
   * @param  {Object} document  A document patch.
   */
  update(collection: string, filter: any, document: any): any {
    const collections = this.collections;
    const obj = {
      $set: {},
    };
    Object.keys(document).forEach((key) => {
      obj.$set[key] = document[key];
    });
    const fil = convertToRegexp(filter || {});
    collections[collection].update(fil, obj, { multi: true }, (err, numReplaced) => {
      if (err) {
        return err;
      } else {
        return null;
      }
    });
  }

  /**
   * Find each document based on it's key and update it.
   * If the document does not exist it will be created.
   *
   * @param  {String} collection Collection name
   * @param {Object|Array.Object} documents
   */
  async upsert(collection: string, documents: any): Promise<any> {
    const collections = this.collections;
    let docs = _.cloneDeep(documents);
    if (!_.isArray(docs)) {
      docs = [docs];
    }
    let results = [];
    for (let doc of docs) {
      _.set(doc, '_id', doc.id);
      const result = new Promise((resolve, reject) => {
        collections[collection].update({ _id: doc._id },
          doc,
          { upsert: true, returnUpdatedDocs: true },
          (err, numReplaced, upserted) => {
            if (err) {
              reject(err);
            }
            resolve(upserted);
          });
      });
      results.push(await result);
    }
    return _.map(results, (doc) => {
      _.unset(doc, '_id');
      return doc;
    });
  }

  /**
   * Delete all documents selected by filter.
   *
   * @param  {String} collection Collection name
   * @param  {Object} filter
   */
  delete(collection: string, filter: Object = {}): any {
    const collections = this.collections;
    const fil = convertToRegexp(filter || {});
    collections[collection].remove(fil, { multi: true }, (err, numRemoved) => {
      if (err)
        throw new Error(err);
      return numRemoved;
    });
  }

  /**
   * Count all documents selected by filter.
   *
   * @param  {String} collection Collection name
   * @param  {Object} filter
   */
  async count(collection: string, filter: Object = {}): Promise<any> {
    const collections = this.collections;
    const fil = convertToRegexp(filter || {});
    const result =  new Promise((resolve, reject) => {
      collections[collection].count(fil, (err, count) => {
        if (err)
          reject(err);
        resolve(count);
      });
    });
    return result;
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
      const collections = _.keys(this.collections);
      for (let i = 0; i < collections.length; i += 1) {
        await this.delete(collections[i], {});
      }
    } else {
      await this.delete(collection, {});
    }
  }
}

/**
 * Open all configured NeDB datastores.
 * @param {Object} config
 * example:
 * {
 *  "provider": "nedb",
 *  "collections": {
 *    "notifications": {}
 *  }
 * }
 * @param {Logger} logger
 * @return {Object} key, value map containing collection names
 * as keys and the corresponding NeDB datastores as values.
 */
const loadDatastores = async (config: any, logger: Logger): Promise<Object> => {
  if (_.isNil(config.collections)) {
    throw new Error('missing collection config value');
  }
  const collections = {};
  const colNames = _.keys(config.collections);
  for (let i = 0; i < colNames.length; i += 1) {
    const name = colNames[i];
    const conf = config.collections[name];
    if (conf.filename) {
      logger.verbose(`collection ${name} has filename ${conf.filename}`);
      conf.autoload = true;
      const load = () => {
        return (cb) => {
          conf.onload = cb;
          collections[name] = new Datastore(conf);
        };
      };
      await load();
    } else {
      collections[name] = new Datastore(conf);
    }
  }
  return collections;
};

/**
 * Create a new NeDB provider.
 *
 * @param {Object} conf NeDB configuration
 * @param {Object} [logger] Logger
 * @return {NedbProvider} NeDB provider
 */
export const create = async(conf: Object, logger: any): Promise<any> => {
  let log = logger;
  if (_.isNil(logger)) {
    log = {
      verbose: () => { },
    };
  }
  const collections = await loadDatastores(conf, log);
  return new NedbProvider(collections);
};

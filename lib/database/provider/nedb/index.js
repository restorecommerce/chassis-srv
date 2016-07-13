/*

Provde Databse Functions

*/
'use strict';
const Datastore = require('nedb');
const _ = require('lodash');

/**
 * Converts unsupported functions to regexp.
 */
function convertToRegexp(filter) {
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
    } else if (_.isObject(value)) {
      f[key] = convertToRegexp(value);
    }
  });
  return f;
}

class NedbProvider {
  constructor(collections, conf) {
    this.collections = collections;
    this.conf = conf;
  }

  // { $or: [{ planet: 'Earth' }, { planet: 'Mars' }] }
  buildOrQuery(options, name) {
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
  }

  * insert(collection, document) {
    const collections = this.collections;
    const doc = _.cloneDeep(document);
    _.set(doc, '_id', doc.id);
    return yield (() => {
      return (cb) => {
        collections[collection].insert(doc, (err, newdoc) => {
          // docs
          if (err) {
            cb(err);
            throw err;
          } else {
            _.unset(newdoc, '_id');
            cb(null, newdoc);
          }
        });
      };
    })();
  }
  * find(collection, filter = {}, options = {}) {
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
    return yield (() => {
      return (cb) => {
        q.exec((err, docs) => {
          // docs
          if (err) {
            cb(err);
          } else {
            _.map(docs, (doc) => {
              if (_.isNil(doc.id)) {
                _.set(doc, '_id', doc._id);
              }
              _.unset(doc, '_id');
            });
            cb(null, docs);
          }
        });
      };
    })();
  }
  * findByID(collection, identifications) {
    let ids = identifications;
    if (!_.isArray(identifications)) {
      ids = [identifications];
    }
    const q = this.buildOrQuery(ids, 'id');
    const collections = this.collections;
    return yield (() => {
      return (cb) => {
        collections[collection].find(q).exec((err, docs) => {
          if (docs) {
            const l = docs.length;
            for (let i = 0; i < l; i++) {
              _.unset(docs[i], '_id');
            }
            cb(null, docs);
          } else if (err) {
            cb(err);
          }
        });
      };
    })();
  }
  * update(collection, filter, document) {
    const collections = this.collections;
    const obj = {
      $set: {},
    };
    Object.keys(document).forEach((key) => {
      obj.$set[key] = document[key];
    });
    const fil = convertToRegexp(filter || {});
    return yield (() => {
      return (cb) => {
        collections[collection].update(fil, obj, { multi: true }, (err, numReplaced) => {
          if (err) {
            cb(err);
          } else {
            cb(null);
          }
        });
      };
    })();
  }
  * upsert(collection, documents) {
    const collections = this.collections;
    let docs = _.cloneDeep(documents);
    if (!_.isArray(docs)) {
      docs = [docs];
    }
    const calls = [];
    _.forEach(docs, (doc) => {
      _.set(doc, '_id', doc.id);
      function upsert() {
        return (cb) => {
          /* eslint no-underscore-dangle: "off"*/
          collections[collection].update({ _id: doc._id },
            doc,
            { upsert: true, returnUpdatedDocs: true },
            (err, numReplaced, upserted) => {
              cb(err, upserted);
            });
        };
      }
      calls.push(upsert());
    });
    const result = yield calls;
    return _.map(result, (doc) => {
      _.unset(doc, '_id');
      return doc;
    });
  }
  * delete(collection, filter = {}) {
    try {
      const collections = this.collections;
      const fil = convertToRegexp(filter || {});
      return yield (() => {
        return (cb) => {
          collections[collection].remove(fil, { multi: true }, cb);
        };
      })();
    } catch (e) {
      throw new Error(e);
    }
  }

  /**
   * Count all documents selected by filter.
   *
   * @param  {String} collection Collection name
   * @param  {Object} filter
   */
  * count(collection, filter = {}) {
    const collections = this.collections;
    const fil = convertToRegexp(filter || {});
    return yield (() => {
      return (cb) => {
        collections[collection].count(fil, cb);
      };
    })();
  }

  /**
   * When calling without a collection name,
   * delete all documents in all collections in the database.
   * When providing a collection name,
   * delete all documents in specified collection in the database.
   * @param [string] collection Collection name.
   */
  * truncate(collection) {
    if (_.isNil(collection)) {
      const collections = _.keys(this.collections);
      for (let i = 0; i < collections.length; i++) {
        yield this.delete(collections[i], {});
      }
    } else {
      yield this.delete(collection, {});
    }
  }
}

function* loadDatastores(config, logger) {
  if (_.isNil(config.collections)) {
    throw new Error('missing collection config value');
  }
  const collections = {};
  const colNames = _.keys(config.collections);
  for (let i = 0; i < colNames.length; i++) {
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
      yield load();
    } else {
      collections[name] = new Datastore(conf);
    }
  }
  return collections;
}

/**
 * Create a new NeDB provider.
 *
 * @param {Object} conf NeDB configuration
 * @param {Object} [logger] Logger
 * @return {NedbProvider} NeDB provider
 */
module.exports.create = function* create(conf, logger) {
  let log = logger;
  if (_.isNil(logger)) {
    log = {
      verbose: () => { },
    };
  }
  const collections = yield loadDatastores(conf, log);
  return new NedbProvider(collections, conf);
};

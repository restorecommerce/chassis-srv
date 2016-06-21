/*

Provde Databse Functions

*/
'use strict';
const Datastore = require('nedb');
const _ = require('lodash');

class NedbProvider {
  constructor(collections, conf, logger) {
    this.collections = collections;
    this.conf = conf;
    this.logger = logger;
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

  *insert(collection, document) {
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
  *find(collection, filter = {}, options = {}) {
    const fil = filter || {};
    const collections = this.collections;
    if (options.limit) {
      if ((options.offset) && (options.offset !== 0)) {
        return yield (() => {
          return (cb) => {
            collections[collection].find(fil).skip(options.offset).limit(options.limit)
            .exec((err, docs) => {
              // docs
              if (err) {
                cb(err);
              } else {
                const l = docs.length;
                for (let i = 0; i < l; i++) {
                  _.unset(docs[i], '_id');
                }
                cb(null, docs);
              }
            });
          };
        })();
      }
      return yield (() => {
        return (cb) => {
          collections[collection].find(fil).limit(options.limit).exec((err, docs) => {
            // docs
            if (err) {
              cb(err);
            } else {
              const l = docs.length;
              for (let i = 0; i < l; i++) {
                _.unset(docs[i], '_id');
              }
              cb(null, docs);
            }
          });
        };
      })();
    }
    return yield (() => {
      return (cb) => {
        collections[collection].find(fil, (err, docs) => {
          // docs
          if (err) {
            cb(err);
          } else {
            const l = docs.length;
            for (let i = 0; i < l; i++) {
              _.unset(docs[i], '_id');
            }
            /* docs.forEach(function(doc){
              delete doc['_id'];
            });*/
            cb(null, docs);
          }
        });
      };
    })();
  }
  *findByID(collection, identifications) {
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
  *update(collection, filter, document) {
    const collections = this.collections;
    const obj = {
      $set: {},
    };
    Object.keys(document).forEach((key) => {
      obj.$set[key] = document[key];
    });

    return yield (() => {
      return (cb) => {
        collections[collection].update(filter, obj, { multi: true }, (err, numReplaced) => {
          if (err) {
            cb(err);
          } else {
            cb(null);
          }
        });
      };
    })();
  }
  *delete(collection, filter = {}) {
    try {
      const collections = this.collections;
      return yield (() => {
        return (cb) => {
          collections[collection].remove(filter, { multi: true }, (err, numRemoved) => {
            if (err) {
              cb(err);
            } else {
              // console.log(numRemoved);
              cb(null, numRemoved);
            }
          });
        };
      })();
    } catch (e) {
      throw new Error(e);
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
    }
    try {
      const load = () => {
        return (cb) => {
          conf.onload = cb;
          collections[name] = new Datastore(conf);
        };
      };
      yield load();
    } catch (error) {
      throw error;
    }
  }
  return collections;
}


// module.exports.nedbProvider = nedbProvider;

module.exports.create = function* create(conf, logger) {
  try {
    const collections = yield loadDatastores(conf, logger);
    return new NedbProvider(collections, conf, logger);
  } catch (error) {
    throw error;
  }
};

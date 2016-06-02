'use strict';

var Arangojs = require('arangojs');
var aql = Arangojs.aql;
var util = require('util');
var slug = require('slug');
var _ = require('lodash');

const DB_SYSTEM = '_system';

function Arango(conn) {
  this._db = conn;
}

function* query(db, c, q) {
  try {
    return yield db.query(q);
  } catch (err) {
    if (err.message && err.message.startsWith('collection not found')) {
      yield c.create();
    } else {
      throw err;
    }
  }
  return yield db.query(q);
}

function idToKey(id) {
  return slug(id, {
    replacement: '_'
  });
}

function ensureKey(document) {
  if (document._key) {
    document._key = idToKey(document._key);
    return document;
  }
  let id = document.id;
  if (id) {
    document._key = idToKey(id);
  }
  return document;
}

function sanitizeFields(document) {
  delete document._id;
  delete document._key;
  delete document._rev;
  return document;
}

Arango.prototype.insert = function*(collection, documents) {
  if (!_.isArray(documents)) {
    documents = [documents];
  }
  _.forEach(documents, function(document, i) {
    documents[i] = ensureKey(_.clone(document));
  });
  let c = this._db.collection(collection);
  yield query(this._db, c, aql `
    FOR document IN ${documents}
    INSERT document
    IN ${c}`);
}

Arango.prototype.find = function*(collection, filter) {
  let c = this._db.collection(collection);
  if (_.size(filter) === 0) {
    return yield query(this._db, c, aql `
      FOR node in ${c}
        RETURN node
      `);
  }
  let filterStr = '';
  _.forIn(filter, function(value, key) {
    filterStr += util.format(' node.%s == %s', value, key)
  });
  let res = yield query(this._db, c, aql `
    FOR node in ${c}
      FILTER ${filterStr}
      RETURN node
    `);
  let docs = yield res.all();
  _.forEach(docs, function(doc) {
    sanitizeFields(doc);
  })
  return docs;
}

Arango.prototype.findByID = function*(collection, ids) {
  if (!_.isArray(ids)) {
    ids = [ids];
  }
  let keys = new Array(ids.length);
  _.forEach(ids, function(id, i) {
    keys[i] = idToKey(id);
  });
  let c = this._db.collection(collection);
  let res = yield query(this._db, c, aql `
      FOR key IN ${keys}
        FOR node IN ${c}
          FILTER node._key == key
          RETURN node
  `);
  let docs = yield res.all();
  _.forEach(docs, function(doc) {
    sanitizeFields(doc);
  })
  return docs;
}

Arango.prototype.updateOne = function*(collection, id, document) {
  let c = this._db.collection(collection);
  let key = idToKey(id);
  yield query(this._db, c, aql `
    FOR node IN ${c}
    FILTER node._key == ${key}
    UPDATE node WITH ${document} IN ${c}
  `);
}

Arango.prototype.deleteOne = function*(collection, id) {
  let c = this._db.collection(collection);
  let key = idToKey(id);
  yield query(this._db, c, aql `
    FOR node IN ${c}
    FILTER node._key == ${key}
    REMOVE node IN ${c}
  `);
}

function* connect(conf, logger) {
  let dbHost = conf.host || '127.0.0.1';
  let dbPort = conf.port || 8529;
  let dbName = conf.database || 'arango';
  let autoCreate = conf.autoCreate || false;

  let attempts = conf.retries || 3;

  let mainError;
  for (let currentAttempt = 1; currentAttempt <= attempts; currentAttempt++) {
    try {
      logger.log('INFO', 'Attempt to connect database', dbHost, dbPort, dbName, {
        attempt: currentAttempt
      });
      let db = new Arangojs('http://' + dbHost + ':' + dbPort);
      db.useDatabase(dbName);
      try {
        let result = yield db.get();
      } catch (err) {
        if (err.name === 'ArangoError' && err.errorNum === 1228) {
          if (autoCreate) {
            // Database does not exist, create a new one
            db.useDatabase(DB_SYSTEM);
            yield db.createDatabase(dbName);
            db.useDatabase(dbName);
            return db;
          }
        }
        throw err;
      }
      return db;
    } catch (err) {
      logger.log('ERROR', 'Database connection error', err, dbHost, dbPort, dbName, {
        attempt: currentAttempt
      });
      mainError = err;
    }
  }
  throw mainError;
}

module.exports.create = function*(conf, logger) {
  let conn = yield connect(conf, logger);
  return new Arango(conn);
};

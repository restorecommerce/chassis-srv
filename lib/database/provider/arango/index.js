'use strict';

var Arangojs = require('arangojs');
var aql = Arangojs.aql;
var util = require('util');
var slug = require('slug');
var _ = require('lodash');

const DB_SYSTEM = '_system';

/**
 * ArangoDB provider
 * @param {Object} conn Arangojs database connection.
 */
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

function buildFilter(filter) {
  filter = ensureKey(filter);
  let filterStr = '';
  _.forIn(filter, function(value, key) {
    filterStr += util.format(' node.%s == %s', value, key)
  });
  return filterStr;
}

/**
 * Inserts documents into database.
 * @param  {String} collection Collection name
 * @param  {Object|array.Object} documents  A single or multiple documents.
 */
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

/**
 * Find documents based on filter.
 * @param  {String} collection Collection name
 * @param  {Object} filter     Key, value Object
 * @return {array.Object}            A list of found documents.
 */
Arango.prototype.find = function*(collection, filter) {
  let c = this._db.collection(collection);
  if (_.size(filter) === 0) {
    return yield query(this._db, c, aql `
      FOR node in ${c}
        RETURN node
      `);
  }
  let filterStr = buildFilter(filter);
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

/**
 * Find documents by id (_key).
 * @param  {String} collection Collection name
 * @param  {String,array.String} ids        A single ID or multiple IDs.
 * @return {array.Object}            A list of found documents.
 */
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

/**
 * Finds documents by id (_key) and updates them.
 * @param  {String} collection Collection name
 * @param  {Object|array.Object} documents  A single document or an array of documents.
 */
Arango.prototype.update = function*(collection, documents) {
  let c = this._db.collection(collection);
  if (!_.isArray(documents)) {
    documents = [documents];
  }
  _.forEach(documents, function(document, i) {
    documents[i] = ensureKey(_.clone(document));
  });
  yield query(this._db, c, aql `
    FOR document IN ${documents}
      FOR node IN ${c}
        FILTER node._key == document._key
        UPDATE node WITH document IN ${c}
        `);
}

/**
 * Deletes all documents selected by filter.
 * @param  {String} collection Collection name
 * @param  {Object} filter     Key, value Object
 */
Arango.prototype.delete = function*(collection, filter) {
  let c = this._db.collection(collection);
  let filterStr = buildFilter(filter);
  yield query(this._db, c, aql `
    FOR node IN ${c}
    FILTER ${filter}
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

/**
 * Creates a new connected ArangoDB provider.
 * @param  {Object} conf   ArangoDB configuration
 * @param  {Object} logger Logger
 * @return {Arango}        ArangoDB provider
 */
module.exports.create = function*(conf, logger) {
  let conn = yield connect(conf, logger);
  return new Arango(conn);
};

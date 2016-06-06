'use strict';

var Arangojs = require('arangojs');
var aql = Arangojs.aql;
var util = require('util');
var slug = require('slug');
var _ = require('lodash');
var qb = require('aqb');

const DB_SYSTEM = '_system';

/**
 * ArangoDB provider
 *
 * @param {Object} conn Arangojs database connection.
 */
function Arango(conn) {
  this._db = conn;
}

function* query(db, collection, q, bind) {
  try {
    return yield db.query(q, bind);
  } catch (err) {
    if (err.message && err.message.startsWith('collection not found')) {
      let c = db.collection(collection);
      yield c.create();
    } else {
      throw err;
    }
  }
  return yield db.query(q, bind);
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

/**
 * Auto-casting reference value by using native function of arangoDB
 *
 * @param {string} key
 * @param {object} value - raw value
 * @returns {object} interpreted value
 */
function autoCastKey(key, value) {
  if (util.isDate(value)) { // Date
    return qb.fn('DATE_TIMESTAMP')(key);
  } else {
    return key;
  }
}

/**
 * Auto-casting raw data
 *
 * @param {object} value - raw value
 * @returns {object} interpreted value
 */
function autoCastValue(value) {
  if (util.isArray(value)) {
    return value.map(qb.str);
  }
  if (util.isString(value)) { // String
    return qb.str(value);
  }
  if (util.isBoolean(value)) { // Boolean
    return qb.bool(value);
  }
  if (util.isNumber(value)) {
    let i = parseInt(value, 10);
    if (i.toFixed(0) === value) { // Integer
      return qb.int(value);
    } else { // Number
      return qb.num(value);
    }
  }
  if (util.isDate(value)) { // Date
    return qb.fn('DATE_TIMESTAMP')(qb.int(value));
  }
  return value;
}

function buildFilter(filter, q, conjunction, path) {
  if (!path) {
    path = 'node';
  }
  _.forEach(filter, function(value, key) {
    let kp = path + '.' + key;
    switch (key) {
      case '$or':
        q = buildFilter(value, q, 'or', path);
        break;
      case '$and':
        q = buildFilter(value, q, 'and', path);
        break;
      default:
        q = q[conjunction](q.eq(autoCastKey(kp, value), autoCastValue(value)));
    }
  });
  return q;
}

function buildLimiter(q, options) {
  // LIMIT count
  // LIMIT offset, count
  if (options.limit) {
    if (options.offset) {
      return q.limit(options.offset, options.limit);
    } else {
      return q.limit(options.limit);
    }
  }
  return q;
}

/**
 * Inserts documents into database.
 *
 * @param  {String} collection Collection name
 * @param  {Object|array.Object} documents  A single or multiple documents.
 */
Arango.prototype.insert = function*(collection, documents) {
  if (_.isNil(collection) || !_.isString(collection) || _.isEmpty(collection)) {
    throw new Error('invalid or missing collection argument');
  }
  if (_.isNil(documents)) {
    throw new Error('invalid or missing documents argument');
  }
  if (!_.isArray(documents)) {
    documents = [documents];
  }
  _.forEach(documents, function(document, i) {
    documents[i] = ensureKey(_.clone(document));
  });
  let q = qb.for('document').in(qb(documents));
  q = q.insert('document').in('@@collection');
  let bindVars = {
    '@collection': collection,
  };
  yield query(this._db, collection, q, bindVars);
};

/**
 * Find documents based on filter.
 *
 * @param  {String} collection Collection name
 * @param  {Object} filter     Key, value Object
 * @param  {Object} options     options.limit, options.offset
 * @return {array.Object}            A list of found documents.
 */
Arango.prototype.find = function*(collection, filter, options) {
  if (_.isNil(collection) || !_.isString(collection) || _.isEmpty(collection)) {
    throw new Error('invalid or missing collection argument');
  }
  if (_.isNil(filter)) {
    filter = {};
  }
  if (_.isNil(options)) {
    options = {};
  }
  let q = qb.for('node').in('@@collection');
  if (_.size(filter) > 0) {
    let f = buildFilter(filter, qb, 'and');
    q = q.filter(f);
  }
  q = buildLimiter(q, options);
  q = q.return('node');
  let bindVars = {
    '@collection': collection,
  };
  let res = yield query(this._db, collection, q, bindVars);
  let docs = yield res.all();
  _.forEach(docs, function(doc) {
    sanitizeFields(doc);
  });
  return docs;
};

/**
 * Find documents by id (_key).
 *
 * @param  {String} collection Collection name
 * @param  {String|array.String} ids        A single ID or multiple IDs.
 * @return {array.Object}            A list of found documents.
 */
Arango.prototype.findByID = function*(collection, ids) {
  if (_.isNil(collection) || !_.isString(collection) || _.isEmpty(collection)) {
    throw new Error('invalid or missing collection argument');
  }
  if (_.isNil(ids)) {
    throw new Error('invalid or missing ids argument');
  }
  if (!_.isArray(ids)) {
    ids = [ids];
  }
  let keys = new Array(ids.length);
  _.forEach(ids, function(id, i) {
    keys[i] = idToKey(id);
  });

  let q = qb.for('key').in(qb(keys));
  q = q.for('node').in('@@collection');
  q = q.filter(qb.eq('node._key', 'key'));
  q = q.return('node');
  let bindVars = {
    '@collection': collection,
  };
  let res = yield query(this._db, collection, q, bindVars);
  let docs = yield res.all();
  _.forEach(docs, function(doc) {
    sanitizeFields(doc);
  });
  return docs;
};

/**
 * Finds documents by id (_key) and updates them.
 *
 * @param  {String} collection Collection name
 * @param  {Object|array.Object} documents  A single document or an array of documents.
 */
Arango.prototype.update = function*(collection, documents) {
  if (_.isNil(collection) ||
    !_.isString(collection) || _.isEmpty(collection)) {
    throw new Error('invalid or missing collection argument');
  }
  if (_.isNil(documents)) {
    throw new Error('invalid or missing documents argument');
  }
  let c = this._db.collection(collection);
  if (!_.isArray(documents)) {
    documents = [documents];
  }
  _.forEach(documents, function(document, i) {
    documents[i] = ensureKey(_.clone(document));
  });
  let q = qb.for('document').in(qb(documents));
  q = q.for('node').in('@@collection');
  q = q.filter(qb.eq('node._key', 'document._key'));
  q = q.update('node').with('document').in('@@collection');
  let bindVars = {
    '@collection': collection,
  };
  yield query(this._db, collection, q, bindVars);
};

/**
 * Deletes all documents selected by filter.
 *
 * @param  {String} collection Collection name
 * @param  {Object} filter
 */
Arango.prototype.delete = function*(collection, filter) {
  if (_.isNil(collection) ||
    !_.isString(collection) || _.isEmpty(collection)) {
    throw new Error('invalid or missing collection argument');
  }
  if (_.isNil(filter)) {
    filter = {};
  }
  let b = buildFilter(filter, qb, 'and');
  let q = qb.for('node').in('@@collection');
  q = q.filter(b).remove('node').in('@@collection');
  let bindVars = {
    '@collection': collection,
  };
  yield query(this._db, collection, q, bindVars);
};

function* connect(conf, logger) {
  let dbHost = conf.host || '127.0.0.1';
  let dbPort = conf.port || 8529;
  let dbName = conf.database || 'arango';
  let autoCreate = conf.autoCreate || false;

  let attempts = conf.retries || 3;

  let mainError;
  for (let currentAttempt = 1; currentAttempt <= attempts; currentAttempt++) {
    try {
      logger.info(
        'Attempt to connect database', dbHost, dbPort, dbName, {
          attempt: currentAttempt
        });
      let db = new Arangojs('http://' + dbHost + ':' + dbPort);
      try {
        db.useDatabase(dbName);
        let result = yield db.get();
      } catch (err) {
        if (err.name === 'ArangoError' && err.errorNum === 1228) {
          if (autoCreate) {
            logger.verbose(
              util.format('auto creating arango database %s', dbName));
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
      logger.error(
        'Database connection error',
        err, dbHost, dbPort, dbName, {
          attempt: currentAttempt
        });
      mainError = err;
    }
  }
  throw mainError;
}

/**
 * Creates a new connected ArangoDB provider.
 *
 * @param  {Object} conf   ArangoDB configuration
 * @param  {Object} logger Logger
 * @return {Arango}        ArangoDB provider
 */
module.exports.create = function*(conf, logger) {
  let conn = yield connect(conf, logger);
  return new Arango(conn);
};

'use strict';

const Arangojs = require('arangojs');
const util = require('util');
const slug = require('slug');
const _ = require('lodash');
const qb = require('aqb');

const DB_SYSTEM = '_system';

function* query(db, collection, q, bind) {
  try {
    return yield db.query(q, bind);
  } catch (err) {
    if (err.message && err.message.startsWith('collection not found')) {
      const c = db.collection(collection);
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

function sanitizeFields(document) {
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
 * @param {object} value - raw value
 * @returns {object} interpreted value
 */
function autoCastKey(key, value) {
  if (util.isDate(value)) { // Date
    return qb.fn('DATE_TIMESTAMP')(key);
  }
  return key;
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
    const i = parseInt(value, 10);
    if (i.toFixed(0) === value) { // Integer
      return qb.int(value);
    }
    return qb.num(value);
  }
  if (util.isDate(value)) { // Date
    return qb.fn('DATE_TIMESTAMP')(qb.int(value));
  }
  return value;
}

function buildFilter(filter, conjunction, path) {
  const p = path || 'node';
  const items = [];
  _.forEach(filter, (value, key) => {
    if (_.isArray(filter)) {
      items.push(buildFilter(value, conjunction, p));
      return;
    }
    const kp = p + '.' + key;
    switch (key) {
      case '$or':
        items.push(buildFilter(value, 'or', p));
        break;
      case '$and':
        items.push(buildFilter(value, 'and', p));
        break;
      default:
        if (_.isEmpty(value)) {
          return;
        }
        items.push(qb.eq(autoCastKey(kp, value), autoCastValue(value)));
    }
  });
  if (items.length === 0) {
    return qb;
  }
  let q = items[0];
  for (let i = 1; i < items.length; i++) {
    q = q[conjunction](items[i]);
  }
  return q;
}

function buildLimiter(q, options) {
  // LIMIT count
  // LIMIT offset, count
  if (options.limit) {
    if (options.offset) {
      return q.limit(options.offset, options.limit);
    }
    return q.limit(options.limit);
  }
  return q;
}

class Arango {
  /**
   * ArangoDB provider
   *
   * @param {Object} conn Arangojs database connection.
   */
  constructor(conn) {
    this.$db = conn;
  }

  /**
   * Inserts documents into database.
   *
   * @param  {String} collection Collection name
   * @param  {Object|array.Object} documents  A single or multiple documents.
   */
  * insert(collection, documents) {
    if (_.isNil(collection) || !_.isString(collection) || _.isEmpty(collection)) {
      throw new Error('invalid or missing collection argument');
    }
    if (_.isNil(documents)) {
      throw new Error('invalid or missing documents argument');
    }
    let docs = documents;
    if (!_.isArray(documents)) {
      docs = [documents];
    }
    _.forEach(docs, (document, i) => {
      docs[i] = ensureKey(_.clone(document));
    });
    let q = qb.for('document').in(qb(docs));
    q = q.insert('document').in('@@collection');
    const bindVars = {
      '@collection': collection,
    };
    yield query(this.$db, collection, q, bindVars);
  }

  /**
   * Find documents based on filter.
   *
   * @param  {String} collection Collection name
   * @param  {Object} filter     Key, value Object
   * @param  {Object} options     options.limit, options.offset
   * @return {array.Object}            A list of found documents.
   */
  *find(collection, filter, options) {
    if (_.isNil(collection) || !_.isString(collection) || _.isEmpty(collection)) {
      throw new Error('invalid or missing collection argument');
    }
    const fil = filter || {};
    const opts = options || {};
    let q = qb.for('node').in('@@collection');
    if (_.size(fil) > 0) {
      const f = buildFilter(fil, 'and');
      q = q.filter(f);
    }
    q = buildLimiter(q, opts);
    q = q.return('node');
    const bindVars = {
      '@collection': collection,
    };
    const res = yield query(this.$db, collection, q, bindVars);
    const docs = yield res.all();
    _.forEach(docs, (doc, i) => {
      docs[i] = sanitizeFields(doc);
    });
    return docs;
  }

  /**
   * Find documents by id (_key).
   *
   * @param  {String} collection Collection name
   * @param  {String|array.String} identifications        A single ID or multiple IDs.
   * @return {array.Object}            A list of found documents.
   */
  *findByID(collection, identifications) {
    if (_.isNil(collection) || !_.isString(collection) || _.isEmpty(collection)) {
      throw new Error('invalid or missing collection argument');
    }
    if (_.isNil(identifications)) {
      throw new Error('invalid or missing ids argument');
    }
    let ids = identifications;
    if (!_.isArray(identifications)) {
      ids = [identifications];
    }
    const keys = new Array(ids.length);
    _.forEach(ids, (id, i) => {
      keys[i] = idToKey(id);
    });

    let q = qb.for('key').in(qb(keys));
    q = q.for('node').in('@@collection');
    q = q.filter(qb.eq('node._key', 'key'));
    q = q.return('node');
    const bindVars = {
      '@collection': collection,
    };
    const res = yield query(this.$db, collection, q, bindVars);
    const docs = yield res.all();
    _.forEach(docs, (doc, i) => {
      docs[i] = sanitizeFields(doc);
    });
    return docs;
  }

  /**
   * Finds documents by id (_key) and updates them.
   *
   * @param  {String} collection Collection name
   * @param  {Object} filter     Key, value Object
   * @param  {Object} document  A document patch.
   */
  *update(collection, filter, document) {
    if (_.isNil(collection) ||
      !_.isString(collection) || _.isEmpty(collection)) {
      throw new Error('invalid or missing collection argument');
    }
    if (_.isNil(document)) {
      throw new Error('invalid or missing document argument');
    }
    const doc = ensureKey(_.clone(document));
    const fil = filter || {};
    let q = qb.for('node').in('@@collection');
    if (_.size(fil) > 0) {
      const f = buildFilter(fil, 'and');
      q = q.filter(f);
    }
    q = q.update('node').with(qb(doc)).in('@@collection');
    const bindVars = {
      '@collection': collection,
    };
    yield query(this.$db, collection, q, bindVars);
  }

  /**
   * Deletes all documents selected by filter.
   *
   * @param  {String} collection Collection name
   * @param  {Object} filter
   */
  *delete(collection, filter) {
    if (_.isNil(collection) ||
      !_.isString(collection) || _.isEmpty(collection)) {
      throw new Error('invalid or missing collection argument');
    }
    const fil = filter || {};
    const b = buildFilter(fil, 'and');
    let q = qb.for('node').in('@@collection');
    q = q.filter(b).remove('node').in('@@collection');
    const bindVars = {
      '@collection': collection,
    };
    yield query(this.$db, collection, q, bindVars);
  }
}

function* connect(conf, logger) {
  const dbHost = conf.host || '127.0.0.1';
  const dbPort = conf.port || 8529;
  const dbName = conf.database || 'arango';
  const autoCreate = conf.autoCreate || false;
  const attempts = conf.retries || 3;

  let mainError;
  for (let currentAttempt = 1; currentAttempt <= attempts; currentAttempt++) {
    try {
      logger.info(
        'Attempt to connect database', dbHost, dbPort, dbName, {
          attempt: currentAttempt
        });
      const db = new Arangojs('http://' + dbHost + ':' + dbPort);
      try {
        db.useDatabase(dbName);
        yield db.get();
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
module.exports.create = function* create(conf, logger) {
  const conn = yield connect(conf, logger);
  return new Arango(conn);
};

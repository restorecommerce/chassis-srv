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
    if (err.message && !err.message.startsWith('collection not found')) {
      throw err;
    }
  }
  const c = db.collection(collection);
  yield c.create();
  yield c.load(false);
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
    return qb.fn('DATE_TIMESTAMP')('node.' + key);
  }
  return 'node.' + key;
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

function buildComparison(filter, op) {
  const ele = _.map(filter, (e) => {
    return buildFilter(e);
  });
  let e = ele[0];
  for (let i = 1; i < ele.length; i++) {
    e = e[op](ele[i]);
  }
  return e;
}

function buildField(key, value) {
  if (_.isString(value) || _.isBoolean(value) || _.isNumber(value || _.isDate(value))) {
    return qb.eq(autoCastKey(key, value), autoCastValue(value));
  }
  if (value.$eq) {
    return qb.eq(autoCastKey(key, value), autoCastValue(value.$eq));
  }
  if (value.$gt) {
    return qb.gt(autoCastKey(key, value), autoCastValue(value.$gt));
  }
  if (value.$gte) {
    return qb.gte(autoCastKey(key, value), autoCastValue(value.$gte));
  }
  if (value.$lt) {
    return qb.lt(autoCastKey(key, value), autoCastValue(value.$lt));
  }
  if (value.$lte) {
    return qb.lte(autoCastKey(key, value), autoCastValue(value.$lte));
  }
  if (value.$ne) {
    return qb.neq(autoCastKey(key, value), autoCastValue(value.$ne));
  }
  if (value.$in) {
    return qb.in(autoCastKey(key, value), autoCastValue(value.$in));
  }
  if (value.$nin) {
    return qb.notIn(autoCastKey(key, value), autoCastValue(value.$nin));
  }
  if (value.$not) {
    return qb.not(buildField(key, value.$not));
  }
  throw new Error(`unsupported operator ${_.keys(value)} in ${key}`);
}

function buildFilter(filter) {
  let q = qb;
  _.forEach(filter, (value, key) => {
    switch (key) {
      case '$or':
        if (q === qb) {
          q = buildComparison(value, 'or');
        } else {
          q = q.and(buildComparison(value, 'or'));
        }
        break;
      case '$and':
        if (q === qb) {
          q = buildComparison(value, 'and');
        } else {
          q = q.and(buildComparison(value, 'and'));
        }
        break;
      default:
        if (_.startsWith(key, '$')) {
          throw new Error(`unsupported query operator ${key}`);
        }
        if (q === qb) {
          q = buildField(key, value);
        } else {
          q = q.and(buildField(key, value));
        }
        break;
    }
  });
  return q;
}

function buildLimiter(q, options) {
  // LIMIT count
  // LIMIT offset, count
  if (!_.isNil(options.limit)) {
    if (!_.isNil(options.offset)) {
      return q.limit(options.offset, options.limit);
    }
    return q.limit(options.limit);
  }
  return q;
}

function buildSorter(q, options) {
  if (_.isNil(options.sort) || _.isEmpty(options.sort)) {
    return q;
  }
  const sort = _.mapKeys(options.sort, (value, key) => {
    return 'node.' + key;
  });
  const pairs = _.flatten(_.toPairs(sort));
  return q.sort.apply(q, pairs);
}

function buildReturn(q, options) {
  if (_.isNil(options.fields) || _.isEmpty(options.fields)) {
    return q.return('node');
  }
  const keep = [];
  const exclude = [];
  _.forEach(options.fields, (value, key) => {
    switch (value) {
      case 0:
        exclude.push(key);
        break;
      case 1:
      default:
        keep.push(key);
    }
  });
  if (keep.length > 0) {
    const include = _.join(_.map(keep, (e) => { return '"' + e + '"'; }, ','));
    return q.return(qb.expr(`KEEP( node, ${include} )`));
  }
  if (exclude.length > 0) {
    const unset = _.join(_.map(exclude, (e) => { return '"' + e + '"'; }, ','));
    return q.return(qb.expr(`UNSET( node, ${unset} )`));
  }
  return q.return('result');
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
   * Insert documents into database.
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
    let docs = _.cloneDeep(documents);
    if (!_.isArray(documents)) {
      docs = [documents];
    }
    _.forEach(docs, (document, i) => {
      docs[i] = ensureKey(document);
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
      const f = buildFilter(fil);
      q = q.filter(f);
    }
    q = buildLimiter(q, opts);
    q = buildSorter(q, opts);
    q = buildReturn(q, opts);
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
   * Find documents by filter and updates them with document.
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
      const f = buildFilter(fil);
      q = q.filter(f);
    }
    q = q.update('node').with(qb(doc)).in('@@collection');
    const bindVars = {
      '@collection': collection,
    };
    yield query(this.$db, collection, q, bindVars);
  }

  /**
   * Find each document based on it's key and update it.
   * If the document does not exist it will be created.
   *
   * @param  {String} collection Collection name
   * @param {Object|Array.Object} documents
   */
  *upsert(collection, documents) {
    if (_.isNil(collection) ||
      !_.isString(collection) || _.isEmpty(collection)) {
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
    const q = qb.for('document').in('@documents')
      .upsert(qb.obj({ _key: 'document._key' }))
      .insert('document')
      .update('document')
      .in('@@collection')
      .return('NEW');
    const bindVars = {
      '@collection': collection,
      documents: docs,
    };
    const res = yield query(this.$db, collection, q, bindVars);
    const newDocs = yield res.all();
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
  *delete(collection, filter) {
    if (_.isNil(collection) ||
      !_.isString(collection) || _.isEmpty(collection)) {
      throw new Error('invalid or missing collection argument');
    }
    const fil = filter || {};
    const b = buildFilter(fil);
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
 * Create a new connected ArangoDB provider.
 *
 * @param  {Object} conf   ArangoDB configuration
 * @param  {Object} logger Logger
 * @return {Arango}        ArangoDB provider
 */
module.exports.create = function* create(conf, logger) {
  const conn = yield connect(conf, logger);
  return new Arango(conn);
};

import * as _ from 'lodash';

/**
 * Ensure that the collection exists and process the query
 * @param {Object} db arangodb connection
 * @param {string} collectionName collection name
 * @param {string} query query string
 * @param {Object} args list of arguments, optional
 * @return {Promise} arangojs query result
 */
export async function query(db: any, collectionName: string, query: any,
  args?: Object): Promise<any> {
  try {
    return await db.query(query, args);
  } catch (err) {
    if (err.message && err.message.indexOf('collection not found') == -1) {
      throw err;
    }
  }
  const collection = db.collection(collectionName);
  await collection.create();
  await collection.load(false);
  return db.query(query, args);
}

/**
 * Convert id to arangodb friendly key.
 * @param {string} id document identification
 * @return {any} arangodb friendly key
 */
export function idToKey(id: string): any {
  return id.replace(/\//g, '_');
}

/**
 * Ensure that the _key exists.
 * @param {Object} document Document template.
 * @return {any} Clone of the document with the _key field set.
 */
export function ensureKey(document: any): any {
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

/**
 * Remove arangodb specific fields.
 * @param {Object} document A document returned from arangodb.
 * @return {Object} A clone of the document without arangodb specific fields.
 */
export function sanitizeFields(document: Object): Object {
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
 * @param {object} value - raw value optional
 * @return {object} interpreted value
 */
export function autoCastKey(key: any, value?: any): any {
  if (_.isDate(value)) { // Date
    return `DATE_TIMESTAMP(node.${key})`;
  }
  return 'node.' + key;
}

/**
 * Auto-casting raw data
 *
 * @param {object} value - raw value
 * @returns {any} interpreted value
 */
export function autoCastValue(value: any): any {
  if (_.isArray(value)) {
    return value.map(value => value.toString());
  }
  if (_.isString(value)) { // String
    return value;
  }
  if (_.isBoolean(value)) { // Boolean
    return Boolean(value);
  }
  if (_.isNumber(value)) {
    return _.toNumber(value);
  }
  if (_.isDate(value)) { // Date
    return new Date(value);
  }
  return value;
}

/**
 * Links children of filter together via a comparision operator.
 * @param {any} filter
 * @param {string} op comparision operator
 * @param {number} index to keep track of bind variables
 * @param {any} bindVarsMap mapping of keys to values for bind variables
 * @return {any} query template string and bind variables
 */
export function buildComparison(filter: any, op: String, index: number,
  bindVarsMap: any): any {
  const ele = _.map(filter, (e) => {
    if (!_.isArray(e)) {
      e = [e];
    }
    e = buildFilter(e, index, bindVarsMap);
    index += 1;
    return e.q;
  });

  let q = '( ';
  for (let i = 0; i < ele.length; i += 1) {
    if (i == ele.length - 1) {
      q = `${q}  ${ele[i]} )`;
    } else {
      q = `${q}  ${ele[i]} ${op} `;
    }
  }
  return { q, bindVarsMap };
}

/**
 * Creates a filter key, value.
 * When the value is a string, boolean, number or date a equal comparision is created.
 * Otherwise if the key corresponds to a known operator, the operator is constructed.
 * @param {string} key
 * @param {string|boolean|number|date|object} value
 * @param {number} index to keep track of bind variables
 * @param {any} bindVarsMap mapping of keys to values for bind variables
 * @return {String} query template string
 */
export function buildField(key: any, value: any, index: number, bindVarsMap: any): string {
  let bindValueVar = `@value${index}`;
  let bindValueVarWithOutPrefix = `value${index}`;
  if (_.isString(value) || _.isBoolean(value) || _.isNumber(value || _.isDate(value))) {
    bindVarsMap[bindValueVarWithOutPrefix] = autoCastValue(value);
    return autoCastKey(key, value) + ' == ' + bindValueVar;
  }
  if (value.$eq) {
    bindVarsMap[bindValueVarWithOutPrefix] = autoCastValue(value.$eq);
    return autoCastKey(key, value) + ' == ' + bindValueVar;
  }
  if (value.$gt) {
    bindVarsMap[bindValueVarWithOutPrefix] = autoCastValue(value.$gt);
    return autoCastKey(key, value) + ' > ' + bindValueVar;
  }
  if (value.$gte) {
    bindVarsMap[bindValueVarWithOutPrefix] = autoCastValue(value.$gte);
    return autoCastKey(key, value) + ' >= ' + bindValueVar;
  }
  if (value.$lt) {
    bindVarsMap[bindValueVarWithOutPrefix] = autoCastValue(value.$lt);
    return autoCastKey(key, value) + ' < ' + bindValueVar;
  }
  if (value.$lte) {
    bindVarsMap[bindValueVarWithOutPrefix] = autoCastValue(value.$lte);
    return autoCastKey(key, value) + ' <= ' + bindValueVar;
  }
  if (value.$ne) {
    bindVarsMap[bindValueVarWithOutPrefix] = autoCastValue(value.$ne);
    return autoCastKey(key, value) + ' != ' + bindValueVar;
  }
  if (value.$inVal) {
    bindVarsMap[bindValueVarWithOutPrefix] = autoCastValue(value.$inVal);
    return bindValueVar + ' IN ' + autoCastKey(key, value);
  }
  if (value.$in) {
    bindVarsMap[bindValueVarWithOutPrefix] = autoCastValue(value.$in);
    if (_.isString(value.$in)) {
      // if it is a field which should be an array
      // (useful for querying within a document list-like attributen
      return bindValueVar + ' IN ' + autoCastKey(key);
    }
    // assuming it is a list of provided values
    return autoCastKey(key, value) + ' IN ' + bindValueVar;
  }
  if (value.$nin) {
    bindVarsMap[bindValueVarWithOutPrefix] = autoCastValue(value.$nin);
    return autoCastKey(key, value) + ' NOT IN ' + bindValueVar;
  }
  if (value.$not) {
    const temp = buildField(key, value.$not, index, bindVarsMap);
    return `!(${temp})`;
  }
  if (_.has(value, '$isEmpty')) {
    bindVarsMap[bindValueVarWithOutPrefix] = autoCastValue('');
    // will always search for an empty string
    return autoCastKey(key, '') + ' == ' + bindValueVar;
  }
  if (value.$startswith) {
    let bindValueVar1 = `@value${index + 1}`;
    let bindValueVarWithOutPrefix1 = `value${index + 1}`;
    const k = autoCastKey(key);
    const v = autoCastValue(value.$startswith);
    bindVarsMap[bindValueVarWithOutPrefix] = v;
    bindVarsMap[bindValueVarWithOutPrefix1] = v;
    return `LEFT(${k}, LENGTH(${bindValueVar})) == ${bindValueVar1}`;
  }
  if (value.$endswith) {
    let bindValueVar1 = `@value${index + 1}`;
    let bindValueVarWithOutPrefix1 = `value${index + 1}`;
    const k = autoCastKey(key);
    const v = autoCastValue(value.$endswith);
    bindVarsMap[bindValueVarWithOutPrefix] = v;
    bindVarsMap[bindValueVarWithOutPrefix1] = v;
    return `RIGHT(${k}, LENGTH(${bindValueVar})) == ${bindValueVar1}`;
  }
  throw new Error(`unsupported operator ${_.keys(value)} in ${key}`);
}

/**
 * Build ArangoDB query based on filter.
 * @param {Object} filter key, value tree object.
 * @param {number} index to keep track of bind variables
 * @param {any} bindVarsMap mapping of keys to values for bind variables
 * @return {any} query template string and bind variables
 */
export function buildFilter(filter: any, index?: number, bindVarsMap?: any): any {
  if (!index) {
    index = 0;
  }
  if (!bindVarsMap) {
    bindVarsMap = {};
  }
  if (filter.length > 0) {
    let q: any = '';
    let multipleFilters = false;
    for (let eachFilter of filter) {
      _.forEach(eachFilter, (value, key) => {
        switch (key) {
          case '$or':
            if (!multipleFilters) {
              if (_.isEmpty(value)) {
                q = true;
              } else {
                q = buildComparison(value, '||', index, bindVarsMap).q;
              }

              multipleFilters = true;
              // since there is a possiblility for recursive call from buildComparision to buildFilter again.
              index += 1;
            } else {
              q = q + '&& ' + buildComparison(value, '||', index, bindVarsMap).q;
              index += 1;
            }
            break;
          case '$and':
            if (!multipleFilters) {
              if (_.isEmpty(value)) {
                q = false;
              } else {
                q = buildComparison(value, '&&', index, bindVarsMap).q;
              }
              multipleFilters = true;
              index += 1;
            } else {
              q = q + '&& ' + buildComparison(value, '&&', index, bindVarsMap).q;
              index += 1;
            }
            break;
          default:
            if (_.startsWith(key, '$')) {
              throw new Error(`unsupported query operator ${key}`);
            }
            if (!multipleFilters) {
              q = buildField(key, value, index, bindVarsMap);
              multipleFilters = true;
              index += 1;
            } else {
              q = q + ' && ' + buildField(key, value, index, bindVarsMap);
              index += 1;
            }
            break;
        }
      });
    }
    return { q, bindVarsMap };
  }
}

/**
 * Build count and offset filters.
 * @param {Object} options query options
 * @return {String} template query string
 */
export function buildLimiter(options: any): string {
  // LIMIT count
  // LIMIT offset, count
  if (!_.isNil(options.limit)) {
    if (!_.isNil(options.offset)) {
      return `LIMIT @offset, @limit`;
    }
    return `LIMIT @limit`;
  }
  return '';
}

/**
 * Build sort filter.
 * @param {Object} options query options
 * @param {number} index to keep track of bind variables
 * @param {any} bindVarsMap Object containing bind key to values
 * @return {any} template query string and bind variables Object
 */
export function buildSorter(options: any, index?: number, bindVarsMap?: any): any {
  if (_.isNil(options.sort) || _.isEmpty(options.sort)) {
    return '';
  }

  if (!index) {
    index = 0;
  }
  if (!bindVarsMap) {
    bindVarsMap = {};
  }

  const sort = _.mapKeys(options.sort, (value, key) => {
    return autoCastKey(key);
  });
  let sortKeysOrder = '';
  let i = 1;
  let objLength = Object.keys(sort).length;
  for (let key in sort) {
    if (objLength == i) {
      // Do not append ',' for the last element
      sortKeysOrder = `${sortKeysOrder} ${key} ${sort[key]} `;
    } else {
      sortKeysOrder = `${sortKeysOrder} ${key} ${sort[key]},`;
    }
    i += 1;
  }
  return 'SORT ' + sortKeysOrder;
}

export function buildReturn(options: any): any {
  let excludeIndex = 0;
  let includeIndex = 0;
  let bindVarsMap = {};
  let q = '';
  if (_.isNil(options.fields) || _.isEmpty(options.fields)) {
    return { q, bindVarsMap };
  }
  const keep = [];
  const exclude = [];
  _.forEach(options.fields, (value, key) => {
    switch (value) {
      case 0:
        bindVarsMap[`exclude${excludeIndex}`] = key;
        exclude.push(`@exclude${excludeIndex}`);
        excludeIndex += 1;
        break;
      case 1:
      default:
        bindVarsMap[`include${includeIndex}`] = key;
        keep.push(`@include${includeIndex}`);
        includeIndex += 1;
    }
  });
  if (keep.length > 0) {
    const include = _.join(_.map(keep, (e) => { return e; }));
    q = `RETURN KEEP( node, ${include} )`;
    return { q, bindVarsMap };
  }
  if (exclude.length > 0) {
    const unset = _.join(_.map(exclude, (e) => { return e; }));
    q = `RETURN UNSET( node, ${unset} )`;
    return { q, bindVarsMap };
  }
  q = 'RETURN result';
  return { q, bindVarsMap };
}

export function encodeMessage(object: Object) {
  return Buffer.from(JSON.stringify(object));
}

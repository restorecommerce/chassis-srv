import * as _ from 'lodash';
import Long from 'long';
import { GraphFilters, Direction } from './interface';

const filterOperationMap = new Map([
  [0, 'eq'],
  [1, 'lt'],
  [2, 'lte'],
  [3, 'gt'],
  [4, 'gte'],
  [5, 'isEmpty'],
  [6, 'iLike'],
  [7, 'in'],
  [8, 'neq']
]);

const filterOperatorMap = new Map([
  [0, 'and'],
  [1, 'or']
]);

/**
 * Takes filter object containing field, operation and value and inserts it
 * to the obj using the operatorList for finding the last operator position and updates obj
 * @param {filter} filter object containing field, operation, value and type
 * @param {obj} obj converted filter object
 * @param {operatorList} operatorList list of operators from original filter object
 */
const convertFilterToObject = (filter, obj, operatorList) => {
  let temp = _.clone(obj);
  let value;
  if (!filter.type || filter.type === 'STRING' || filter.type === 0) {
    value = filter.value;
  } else if ((filter.type === 'NUMBER' || filter.type === 1) && !isNaN(filter.value)) {
    value = Number(filter.value);
  } else if (filter.type === 'BOOLEAN' || filter.type === 2) {
    if (filter.value === 'true') {
      value = true;
    } else if (filter.value === 'false') {
      value = false;
    }
  } else if (filter.type === 'ARRAY' || filter.type === 4) {
    try {
      value = JSON.parse(filter.value);
    } catch (err) {
      // to handle JSON string parse error
      if (err.message.indexOf('Unexpected token') > -1) {
        value = JSON.parse(JSON.stringify(filter.value));
      } else {
        throw err;
      }
    }
  } else if (filter.type === 'DATE' || filter.type === 3) {
    value = (new Date(filter.value)).getTime();
  }

  for (let i = 0; i < operatorList.length; i++) {
    if (_.isArray(temp)) {
      temp = _.find(temp, operatorList[i]);
    } else {
      temp = temp[operatorList[i]];
    }
    if (i === (operatorList.length - 1)) {
      // push for final element in the operatorList array
      if (filter.operation === 'eq' || filter.operation === 0) {
        if (_.isArray(temp)) {
          temp.push({ [filter.field]: value });
        } else {
          temp[operatorList[i]].push({ [filter.field]: value });
        }
      } else if (filter.operation === 'neq' || filter.operation === 8) {
        if (_.isArray(temp)) {
          temp.push({ [filter.field]: { $not: { $eq: value } } });
        } else {
          temp[operatorList[i]].push({ [filter.field]: { $not: { $eq: value } } });
        }
      } else {
        let op, opValue;
        if (typeof filter.operation === 'string' || filter.operation instanceof String) {
          opValue = filter.operation;
        } else if (Number.isInteger(filter.operation)) {
          opValue = filterOperationMap.get(filter.operation);
        }
        op = `$${opValue}`;
        if (_.isArray(temp)) {
          temp.push({ [filter.field]: { [op]: value } });
        } else {
          temp[operatorList[i]].push({ [filter.field]: { [op]: value } });
        }
      }
    }
  }
  return obj;
};

/**
 * Inserts the new operator into obj iterating throught the operator list and updates obj
 * @param {obj} obj Converted filter object
 * @param {operatorList} operatorList operator list
 * @param {operatorNew} operatorNew new operator
 */
const insertNewOpAndUpdateObj = (obj, operatorList, operatorNew) => {
  let pos = _.clone(obj);
  for (let i = 0; i < operatorList.length; i++) {
    if (_.isArray(pos)) {
      pos = _.find(pos, operatorList[i]);
    } else {
      pos = pos[operatorList[i]];
    }
    // push new operator after iterating to the last element in operatorList
    if (i === (operatorList.length - 1)) {
      pos.push({ [operatorNew]: [] });
    }
  }
  return obj;
};

/**
 * toTraversalFilterObject takes input contained in the proto structure defined in resource_base proto
 * and converts it into Object understandable by the underlying DB implementation in chassis-srv
 * @param {*} input Original filter input object
 * @param {*} obj converted filter objected passed recursively
 * @param {*} operatorList operatorlist updated and passed recursively
 */
export const toTraversalFilterObject = (input: any, obj?: any, operatorList?: string[]) => {
  // since toObject method is called recursively we are not adding the typing to input parameter
  let filters;
  if (input && !_.isEmpty(input.filters)) {
    filters = input.filters;
  } else {
    filters = input;
  }
  // const filters = _.cloneDeep( (input.filters && input.filters.length > 0) ? input.filters : input);
  // by default use 'and' operator if no operator is specified
  if (filters && _.isArray(filters.filter) && !filters.operator) {
    filters.operator = 'and';
  }
  if (!obj) {
    obj = {};
  }
  if (_.isArray(filters.filter)) {
    let operatorValue;
    if (typeof filters.operator === 'string' || filters.operator instanceof String) {
      operatorValue = filters.operator;
    } else if (Number.isInteger(filters.operator)) {
      operatorValue = filterOperatorMap.get(filters.operator);
    }
    const newOperator = `$${operatorValue}`;
    if (operatorList && newOperator) {
      // insert obj with new operator
      obj = insertNewOpAndUpdateObj(obj, operatorList, newOperator);
      operatorList.push(newOperator);
    } else {
      operatorList = [newOperator];
      obj[newOperator] = [];
    }
    // pass operatorList and obj recursively
    toTraversalFilterObject(filters.filter, obj, operatorList);
  } else if (_.isArray(filters)) {
    for (let filterObj of filters) {
      toTraversalFilterObject(filterObj, obj, operatorList);
    }
  } else if (filters.field && (filters.operation || filters.operation === 0) && filters.value) {
    // object contains field, operation and value, update it on obj using convertFilterToObject()
    obj = convertFilterToObject(filters, obj, operatorList);
  }
  return obj;
};

/**
 * Auto-casting reference value by using native function of arangoDB
 *
 * @param {string} key
 * @param {object} value - raw value optional
 * @return {object} interpreted value
 */
export const autoCastKey = (key: any, value?: any): any => {
  if (_.isDate(value)) { // Date
    return `DATE_TIMESTAMP(v.${key})`;
  }
  return 'v.' + key;
};

/**
 * Auto-casting raw data
 *
 * @param {object} value - raw value
 * @returns {any} interpreted value
 */
export const autoCastValue = (value: any): any => {
  if (_.isArray(value)) {
    return value.map(value => value.toString());
  }
  if (_.isString(value)) { // String
    return JSON.stringify(value);
  }
  if (_.isBoolean(value)) { // Boolean
    return Boolean(value);
  }
  if (_.isNumber(value)) {
    return _.toNumber(value);
  }
  if (Long.isLong(value)) {
    return (value as Long).toNumber();
  }
  if (_.isDate(value)) { // Date
    return new Date(value);
  }
  return value;
};


/**
 * Links children of filter together via a comparision operator.
 * @param {any} filter
 * @param {string} op comparision operator
 * @return {any} query template string and bind variables
 */
export const buildComparison = (filter: any, op: String): any => {
  const ele = _.map(filter, (e) => {
    if (!_.isArray(e)) {
      e = [e];
    }
    e = buildGraphFilter(e); // eslint-disable-line
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
  return { q };
};

/**
 * Creates a filter key, value.
 * When the value is a string, boolean, number or date a equal comparision is created.
 * Otherwise if the key corresponds to a known operator, the operator is constructed.
 * @param {string} key
 * @param {string|boolean|number|date|object} value
 * @return {String} query template string
 */
export const buildGraphField = (key: any, value: any): string => {
  if (_.isString(value) || _.isBoolean(value) || _.isNumber(value || _.isDate(value))) {
    return autoCastKey(key, value) + ' == ' + autoCastValue(value);
  }
  if (!_.isNil(value.$eq)) {
    return autoCastKey(key, value) + ' == ' + autoCastValue(value.$eq);
  }
  if (value.$gt) {
    return autoCastKey(key, value) + ' > ' + autoCastValue(value.$gt);
  }
  if (value.$gte) {
    return autoCastKey(key, value) + ' >= ' + autoCastValue(value.$gte);
  }
  if (value.$lt) {
    return autoCastKey(key, value) + ' < ' + autoCastValue(value.$lt);
  }
  if (value.$lte) {
    return autoCastKey(key, value) + ' <= ' + autoCastValue(value.$lte);
  }
  if (!_.isNil(value.$ne)) {
    return autoCastKey(key, value) + ' != ' + autoCastValue(value.$ne);
  }
  if (value.$inVal) {
    return autoCastValue(value.$inVal) + ' IN ' + autoCastKey(key, value);
  }
  if (value.$in) {
    if (_.isString(value.$in)) {
      // if it is a field which should be an array
      // (useful for querying within a document list-like attributen
      return autoCastValue(value.$in) + ' IN ' + autoCastKey(key);
    }
    // assuming it is a list of provided values
    return autoCastKey(key, value) + ' IN ' + autoCastValue(value.$in);
  }
  if (value.$nin) {
    return autoCastKey(key, value) + ' NOT IN ' + autoCastValue(value.$nin);
  }
  if (value.$iLike) {
    // @param 'true' is for case insensitive
    return 'LOWER(' + autoCastKey(key, value) + ') LIKE ' + autoCastValue(value.$iLike.toLowerCase());
  }
  if (!_.isNil(value.$not)) {
    const temp = buildGraphField(key, value.$not);
    return `!(${temp})`;
  }
  if (_.has(value, '$isEmpty')) {
    // will always search for an empty string
    return autoCastKey(key, '') + ' == ' + autoCastValue('');
  }
  throw new Error(`unsupported operator ${_.keys(value)} in ${key}`);
};

/**
 * Build ArangoDB query based on filter.
 * @param {Object} filter key, value tree object
 * @return {any} query template string and bind variables
 */
export const buildGraphFilter = (filter: any): any => {
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
                q = buildComparison(value, '||').q;
              }

              multipleFilters = true;
            } else {
              q = q + '&& ' + buildComparison(value, '||').q;
            }
            break;
          case '$and':
            if (!multipleFilters) {
              if (_.isEmpty(value)) {
                q = false;
              } else {
                q = buildComparison(value, '&&').q;
              }
              multipleFilters = true;
            } else {
              q = q + '&& ' + buildComparison(value, '&&').q;
            }
            break;
          default:
            if (_.startsWith(key, '$')) {
              throw new Error(`unsupported query operator ${key}`);
            }
            if (!multipleFilters) {
              q = buildGraphField(key, value);
              multipleFilters = true;
            } else {
              q = q + ' && ' + buildGraphField(key, value);
            }
            break;
        }
      });
    }
    return { q };
  }
};

/**
 * Find's the list of entities from edge definition config depending on the direction
 * recursively
 * @param collection - root collection / start vertex
 * @param edgeDefConfig - edge definition cofnig
 * @param direction - direction OUTBOUND / INBOUND
 * @param entitiesList - result of entities in the graph of edge definition config
 */
export const recursiveFindEntities = (collection, edgeDefConfig, direction, entitiesList) => {
  if (entitiesList.includes(collection)) {
    return;
  }
  entitiesList.push(collection);
  let items = [];
  if (direction === 'OUTBOUND') {
    items = edgeDefConfig.filter(col => col.from === collection);
  } else if (direction === 'INBOUND') {
    items = edgeDefConfig.filter(col => col.to === collection);
  }
  for (let item of items) {
    if (direction === 'OUTBOUND') {
      recursiveFindEntities(item.to, edgeDefConfig, direction, entitiesList);
    } else if (direction === 'INBOUND') {
      recursiveFindEntities(item.from, edgeDefConfig, direction, entitiesList);
    }
  }
  return entitiesList;
};

/**
 * Build limit and offset filters.
 * @param {limit} limit
 * @param {offset} offset
 * @return {String}  string limit filter
 */
export const buildGraphLimiter = (limit?: number, offset?: number): string => {
  // LIMIT count
  // LIMIT offset, count
  if (!limit) {
    limit = 1000;
  }
  if (!_.isNil(limit)) {
    if (!_.isNil(offset)) {
      return `LIMIT ${offset}, ${limit}`;
    }
    return `LIMIT ${limit}`;
  }
  return '';
};

/**
 * Auto-casting reference value by using native function of arangoDB
 *
 * @param {string} key
 * @param {object} value - raw value optional
 * @return {object} interpreted value
 */
export const autoCastRootKey = (key: any, value?: any): any => {
  if (_.isDate(value)) { // Date
    return `DATE_TIMESTAMP(obj.${key})`;
  }
  return 'obj.' + key;
};

/**
 * Build sort filter.
 * @param {Object} sort sort options
 * @return {any} template sort string
 */
export const buildGraphSorter = (sortList: any): any => {
  if (_.isNil(sortList) || _.isEmpty(sortList)) {
    return '';
  }

  const sort = _.mapKeys(sortList, (value, key) => {
    return autoCastRootKey(key);
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
};

export const createGraphsAssociationFilter = (filters: GraphFilters[],
  direction: Direction, traversalCollectionName: string, edgeDefConfig: any, filter: string): any => {
  let filterObj = [];
  let filteredEntities = []; // used to find difference from graph edgeDefConfig and add missing entities to custom filter
  let completeEntities = [];
  let rootEntityFilter;
  // convert the filter from proto structure (field, operation, value and operand) to {field: value } mapping
  if (filters && !_.isEmpty(filters)) {
    if (!_.isArray(filters)) {
      filters = [filters];
    }
    for (let eachFilter of filters) {
      if (eachFilter.entity && eachFilter.entity === traversalCollectionName) {
        rootEntityFilter = toTraversalFilterObject(eachFilter);
        continue;
      }
      const traversalFilterObj = toTraversalFilterObject(eachFilter);
      if (eachFilter.entity && eachFilter.entity != traversalCollectionName) {
        filteredEntities.push(eachFilter.entity);
        traversalFilterObj.entity = eachFilter.entity;
      } else if (eachFilter.edge) {
        // depending on direction
        const entityConnectedToEdge = edgeDefConfig.filter(e => e.collection === eachFilter.edge);
        if (entityConnectedToEdge?.length === 1) {
          if (direction === 'OUTBOUND') {
            filteredEntities.push(entityConnectedToEdge[0].to);
          } else if (direction === 'INBOUND') {
            filteredEntities.push(entityConnectedToEdge[0].from);
          }
        }
        traversalFilterObj.edge = eachFilter.edge;
      }
      filterObj.push(traversalFilterObj);
    }
  }

  if (!_.isArray(filterObj)) {
    filterObj = [filterObj];
  }

  if (filterObj?.length > 0) {
    completeEntities = recursiveFindEntities(traversalCollectionName, edgeDefConfig, direction, []);
  }

  // construct AQL custom filter based on filterObj using buildFilter api
  let customFilter = '';
  let rootCollectionFilter = '';
  if (filterObj && filterObj.length > 0) {
    for (let i = 0; i < filterObj.length; i++) {
      let entity = '';
      let edge = '';
      if (filterObj[i].entity) {
        entity = filterObj[i].entity;
        delete filterObj[i].entity;
      } else if (filterObj[i].edge) {
        edge = filterObj[i].edge;
        delete filterObj[i].edge;
      }
      let filterString = buildGraphFilter([filterObj[i]]).q;
      if (typeof filterString === 'string' &&
        filterString.startsWith('(') && filterString.endsWith(')')) {
        if (entity) {
          filterString = filterString.substring(0, 1) + ` v._id LIKE "${entity}%" && ` + filterString.substring(1);
          if (traversalCollectionName && entity === traversalCollectionName) {
            rootCollectionFilter = filterString;
          }
        } else if (edge) {
          filterString = filterString.substring(0, 1) + ` e._id LIKE "${edge}%" && ` + filterString.substring(1);
        }
      }
      if (i === filterObj.length - 1) {
        customFilter = customFilter + filterString;
      } else {
        customFilter = customFilter + filterString + ' || ';
      }
    }
  }

  if (customFilter) {
    filter = filter + ` FILTER ${customFilter}`;
    // add missing entities to FILTER query
    filteredEntities = filteredEntities.sort();
    completeEntities = completeEntities.sort();
    if (!_.isEqual(filteredEntities, completeEntities)) {
      for (let removeEntity of _.intersection(filteredEntities, completeEntities)) {
        completeEntities.splice(completeEntities.indexOf(removeEntity), 1);
      }
    }
    // AQL query for missing entities
    if (completeEntities && completeEntities.length > 0) {
      for (let missingEntity of completeEntities) {
        filter = filter + ` || ( v._id LIKE "${missingEntity}%" )`;
      }
    }
  }
  return { rootEntityFilter, associationFilter: filter };
};
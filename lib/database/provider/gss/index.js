'use strict';

let GraphStorageService = require('restore-gss');
let Arangojs = require('arangojs');
let Promise = require('bluebird');
let retry = require('retry');
let util = require('util');
let aqlFunctions = require('restore-aql-function');

function* registerFunction(db) {
  if (util.isFunction(db.createFunction)) {
    yield Object.keys(aqlFunctions).map(fnName => db.createFunction(fnName, aqlFunctions[fnName].toString()));
  }
}

const DB_SYSTEM = '_system';

/**
 * Connects to the database.
 *
 * @param {Object} [options]
 * @returns {DB}
 */
function dbConnection(conf, logger) {
  let dbHost;
  let dbPort;
  let dbName;

  if (conf) {
    dbHost = conf.host || '127.0.0.1';
    dbPort = conf.port || 8529;
    dbName = conf.database || 'arango';
  }
  return (cb) => {
    let operation = retry.operation({
      retries: 10,
      factor: 3,
      minTimeout: 1 * 1000,
      maxTimeout: 60 * 1000,
      randomize: false
    });

    operation.attempt(currentAttempt => {
      logger.info('Attempt to connect database', dbHost, dbPort, dbName, { attempt: currentAttempt });
      let db = new Arangojs('http://' + dbHost + ':' + dbPort);
      db.useDatabase(dbName);

      // Try to fetch info
      db.get((err) => {
        if (err) {
          if (err.name === 'ArangoError' && err.errorNum === 1228) {
            // Database does not exist, create a new one
            db.useDatabase(DB_SYSTEM);
            db.createDatabase(dbName, (err) => {
              // Ignore duplicate to avoid concurrency issues
              if (err) {
                if (err.name !== 'ArangoError' || err.errorNum !== 1207) {
                  logger.error('Database creation error', err);
                  if (operation.retry(err)) {
                    return;
                  }
                  return cb(operation.mainError());
                }
              }
              db.useDatabase(dbName);
              cb(null, db);
            });
          } else {
            logger.error('Database connection error', err);
            if (operation.retry(err)) {
              return;
            }
            cb(operation.mainError());
          }
        } else {
          cb(null, db);
        }
      });
    });
  };
}

module.exports.create = function*(conf, logger) {
  let dbConn = yield dbConnection(conf, logger);

  yield registerFunction(dbConn, logger);

  let provider = 'arango';
  let contextCollection = 'contexts';
  let autoCreate = conf.autoCreate;
  let gss = GraphStorageService.create({
    provider: provider,
    db: dbConn,
    logger: logger,
    contextCollection: contextCollection,
    autoCreate: autoCreate,
  });
  Promise.promisifyAll(gss);
  return gss;
};

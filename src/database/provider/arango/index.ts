import { Arango } from './base';
import { ArangoGraph } from './graph';

import * as retry from 'async-retry';
import * as fs from 'fs';
import { Database } from 'arangojs';
import { Logger } from 'winston';

const DB_SYSTEM = '_system';

/**
 * Connect to a ArangoDB.
 * @param {Object} conf Connection options.
 * @param {Logger} logger
 * @return active ArangoDB connection
 */
const connect = async(conf: any, logger: Logger): Promise<any> => {
  const dbHost = conf.host || '127.0.0.1';
  const dbPort = conf.port || 8529;
  const dbName = conf.database || 'arango';
  const autoCreate = conf.autoCreate || false;
  const attempts = conf.retries || 3;
  const delay = conf.delay || 1000;
  const arangoVersion = conf.version || 30000;

  let url = 'http://';

  const username = conf.username;
  const password = conf.password;

  if (username && password) {
    url = url + `${username}:${password}@`;
  }

  url = url + `${dbHost}:${dbPort}`;

  let mainError;
  let i = 1;
  try {
    return await retry(async () => {
      logger.info('Attempt to connect database', {
        dbHost, dbPort, dbName,
        attempt: i
      });
      i += 1;
      const db = new Database({
        url,
        arangoVersion,
      });
      try {
        db.useDatabase(dbName);

        if (username && password) {
          db.useBasicAuth(username, password);
        }
        await db.get();
      } catch (err) {
        if (err.name === 'ArangoError' && err.errorNum === 1228) {
          if (autoCreate) {
            logger.verbose(`auto creating arango database ${dbName}`);
            // Database does not exist, create a new one
            db.useDatabase(DB_SYSTEM);
            await db.createDatabase(dbName);
            db.useDatabase(dbName);
            return db;
          }
        }
        throw err;
      }
      return db;
    }, { retries: attempts, minTimeout: delay });
  }
  catch (err) {
    const safeError = Object.getOwnPropertyNames(Object.getPrototypeOf(err))
      .reduce((acc, curr) => { return acc[curr] = err[curr], acc; }, {});
    logger.error(
      'Database connection error', {
        err: safeError, dbHost, dbPort, dbName, attempt: i
      });
    mainError = err;
  }
  throw mainError;
};

/**
 * Create a new connected ArangoDB provider.
 *
 * @param  {Object} conf   ArangoDB configuration
 * @param  {Object} [logger] Logger
 * @return {Arango}        ArangoDB provider
 */
export const create = async (conf: any, logger: any, graphName?: string): Promise<Arango> => {
  let log = logger;
  if (!logger) {
    log = {
      verbose: () => { },
      info: () => { },
      error: () => { },
    };
  }
  let graph;
  const conn = await connect(conf, log);
  let db: Arango;
  // conn is nothing but this.db
  if (graphName) {
    graph = conn.graph(graphName);
    try {
      await graph.create();
    } catch (err) {
      if (err.message !== 'graph already exists') {
        throw err;
      }
    }

    db = new ArangoGraph(conn, graph);
  } else {
    db = new Arango(conn);
  }

  if (conf.customQueries) {
    conf.customQueries.forEach((obj) => {
      const { path, name, type } = obj;
      const script = fs.readFileSync(path, 'utf8');
      db.registerCustomQuery(name, script, type);
    });
  }

  return db;
};

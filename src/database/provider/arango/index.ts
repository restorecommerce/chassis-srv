import { Arango } from './base';
import { ArangoGraph } from './graph';

import retry from 'async-retry';
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
const connect = async (conf: any, logger: Logger): Promise<any> => {
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
      logger?.info('Attempt to connect database', {
        dbHost, dbPort, dbName,
        attempt: i
      });
      i += 1;
      const db = new Database({
        url,
        arangoVersion,
      });
      try {
        if (username && password) {
          db.useBasicAuth(username, password);
        }
        await db.database(dbName).get();
      } catch (err) {
        if (err.name === 'ArangoError' && err.errorNum === 1228) {
          if (autoCreate) {
            logger?.verbose(`auto creating arango database ${dbName}`);
            // Database does not exist, create a new one
            db.database(DB_SYSTEM);
            await db.createDatabase(dbName);
            db.database(dbName);
            return db.database(dbName);
          }
        }
        throw err;
      }
      return db.database(dbName);
    }, { retries: attempts, minTimeout: delay });
  }
  catch (err) {
    const safeError = Object.getOwnPropertyNames(Object.getPrototypeOf(err))
      .reduce((acc, curr) => { return acc[curr] = err[curr], acc; }, {});
    logger?.error('Database connection error', { err: safeError, dbHost, dbPort, dbName, attempt: i });
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
export const create = async (conf: any, logger: any, graphName?: string, edgeDefConfig?: any): Promise<Arango> => {
  if (!logger) {
    logger = {
      verbose: () => { },
      info: () => { },
      error: () => { },
    };
  }
  let graph;
  const conn = await connect(conf, logger);
  let db: Arango;
  // conn is nothing but this.db
  if (graphName) {
    try {
      graph = conn.graph(graphName);
      await graph.create(edgeDefConfig);
    } catch (err) {
      if (err.message !== 'graph already exists') {
        throw err;
      }
    }

    db = new ArangoGraph(conn, graph, edgeDefConfig, logger);
  } else {
    db = new Arango(conn, logger);
  }

  // iterate db conf and create list of views / analayzers
  if (conf?.arangoSearch?.length > 0) {
    for (let obj of conf.arangoSearch) {
      try {
        const { collectionName, path } = obj;
        const viewCfg = JSON.parse(fs.readFileSync(path, 'utf8'));
        await db.createAnalyzerAndView(viewCfg, collectionName);
      } catch (error) {
        logger?.error('Error creating analyzer or view', {
          code: error.code, message: error.message, stack: error.stack
        });
      }
    }
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
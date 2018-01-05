'use strict';

import * as co from 'co';
import * as mocha from 'mocha';
import * as coMocha from 'co-mocha';
// microservice chassis
import { config, CommandInterface, database, Server } from './../lib';
import * as chassis from './../lib';
import * as Logger from '@restorecommerce/logger';
import * as should from 'should';
import { Client } from '@restorecommerce/grpc-client';
import { Events, Topic } from '@restorecommerce/kafka-client';
import * as sconfig from '@restorecommerce/service-config';
coMocha(mocha);

/*
 * Note: A running Kafka instance is required for 'restore' test case.
 */

/* global describe it before after beforeEach afterEach */
describe('CommandInterfaceService', () => {
  let db: any;
  let server: Server;
  let events: Events;
  const testEvent = {
    value: 'a test event',
    count: 0,
  };
  let service;
  let cfg;
  let testTopic;
  let commandTopic;
  before(async function setup() {
    cfg = sconfig(process.cwd() + '/test');
    const logger = new chassis.Logger(cfg.get('logger'));

    events = new Events(cfg.get('events:kafka'), logger);
    await events.start();

    const topics = cfg.get('events:kafka:topics');
    testTopic = events.topic(cfg.get('events:kafka:topics:test:topic'));
    commandTopic = events.topic(cfg.get('events:kafka:topics:command:topic'));

    server = new Server(cfg.get('server'), logger);
    db = await co(database.get(cfg.get('database:arango'), server.logger));
    await co(db.truncate());

    const config = cfg.get();
    delete config.database.nedb;  // not supported in default implementation

    const cis = new CommandInterface(server, config, server.logger, events);
    await co(server.bind('commandinterface', cis));
    await co(server.start());

    const client = new Client(cfg.get('client:commandinterface'));
    service = await client.connect();
  });
  after(async function teardown() {
    await co(server.end());
    await events.stop();
  });
  describe('check', () => {
    it('should return the status', async function checkHealth() {
      should.exist(service.check);

      // // check commandinterface service, should serve
      let resp = await service.check({
        service: 'commandinterface',
      });
      should.not.exist(resp.error);
      should.exist(resp.data);
      should.exist(resp.data.status);
      resp.data.status.should.equal('SERVING');

      // check none existing service, should throw error
      resp = await service.check({
        service: 'does_not_exist',
      });
      should.not.exist(resp.data);
      should.exist(resp.error);
      resp.error.message.should.equal('not found');

      // check server, should serve
      resp = await service.check({
        service: '',
      });
      should.not.exist(resp.error);
      should.exist(resp.data);
      should.exist(resp.data.status);
      resp.data.status.should.equal('SERVING');
    });
  });
  describe('reconfigure', () => {
    it('should return an error since it is not implemented', async function reconfigure() {
      should.exist(service.reconfigure);
      const resp = await service.reconfigure({});
      should.exist(resp.error);
    });
  });
  describe('reset', () => {
    const docID = 'test/value';
    before(async function prepareDatabase() {
      await co(db.insert('tests', {
        id: docID,
        value: 101,
      }));
    });
    it('should clean the database', async function reset() {
      should.exist(service.reset);
      const resp = await service.reset({});
      should.not.exist(resp.error);
      should.exist(resp.data);

      const result = await co(db.findByID('tests', docID));
      result.should.be.length(0);
    });
  });

  describe('restore', function checkRestore() {
    let restoreDoneListener: any;
    before(async function prepareKafka() {
      for (let i = 0; i < 10; i += 1) {
        testEvent.count = i;
        await testTopic.emit('test-event', testEvent);
      }
    });
    beforeEach(async function prepareDB() {
      await co(db.truncate('test'));
    });
    it('should re-read all data from the topics the service listens', async function restore() {
      // restore conclusion is checked asynchronously, since it can take a variable
      // and potentially large amount of time
      restoreDoneListener = async function eventListener(msg: any,
        context: any, config: any, eventName: string): Promise<any> {
        const result = await co(db.find('test', {}, {
          sort: {
            count: 1
          }
        }));
        result.should.be.length(10);
        for (let i = 0; i < 10; i++) {
          result[i].count.should.equal(i);
        }
      };
      should.exist(service.restore);
      const resp = await service.restore({
        topics: [
          {
            topic: 'test',
            offset: 0,
            ignore_offset: [],
          },
        ],
      });
      should.not.exist(resp.error);

      // waiting for restore conclusion
      const offset = await commandTopic.$offset(-1);
      await commandTopic.on('restoreResponse', restoreDoneListener);
      await commandTopic.$wait(offset);

    });
    it('should re-read all data from specified offset', async function restore() {
      restoreDoneListener = async function eventListener(msg: any,
        context: any, config: any, eventName: string): Promise<any> {
        const result = await co(db.find('test', {}, {
          sort: {
            count: 1
          }
        }));
        result.should.be.length(5);
        for (let i = 5; i < 10; i++) {
          result[i].count.should.equal(i);
        }
      };
      should.exist(service.restore);
      const resp = await service.restore({
        topics: [
          {
            topic: 'test',
            offset: 5,
            ignore_offset: [],
          },
        ],
      });
      should.not.exist(resp.error);

      // waiting for restore conclusion
      const offset = await commandTopic.$offset(-1);
      await commandTopic.on('restoreResponse', restoreDoneListener);
      await commandTopic.$wait(offset);
    });
  });
  describe('version', () => {
    it('should return the version of the package and nodejs', async function version() {
      should.exist(service.version);
      const resp = await service.version({});
      should.not.exist(resp.error);
      should.exist(resp.data);
      should.exist(resp.data.version);
      resp.data.version.should.equal(process.env.npm_package_version);
      should.exist(resp.data.nodejs);
      resp.data.nodejs.should.equal(process.version);
    });
  });
});

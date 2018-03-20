'use strict';

import * as co from 'co';
import * as mocha from 'mocha';
// microservice chassis
import * as _ from 'lodash';
import { config, CommandInterface, database, Server } from './../lib';
import * as chassis from './../lib';
import * as Logger from '@restorecommerce/logger';
import * as should from 'should';
import { Client } from '@restorecommerce/grpc-client';
import { Events, Topic } from '@restorecommerce/kafka-client';
import * as sconfig from '@restorecommerce/service-config';


/**
 *
 * @param msg google.protobuf.Any
 * @returns Arbitrary JSON
 */
function decodeMsg(msg: any): any {
  const decoded = Buffer.from(msg.value, 'base64').toString();
  return JSON.parse(decoded);
}

/**
 *
 * @param msg Arbitrary JSON
 * @returns google.protobuf.Any formatted message
 */
function encodeMsg(msg: any): any {

  const stringified = JSON.stringify(msg);
  const encoded = Buffer.from(stringified).toString('base64');
  const ret = {
    type_url: 'payload',
    value: encoded
  };
  return ret;
}

/*
 * Note: A running Kafka instance is required for 'restore' test case.
 */
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
  let validate;
  const eventListener = async function (msg: any,
    context: any, config: any, eventName: string): Promise<any> {
    validate(msg, eventName);
  };
  before(async function setup() {
    cfg = sconfig(process.cwd() + '/test');
    const logger = new chassis.Logger(cfg.get('logger'));

    events = new Events(cfg.get('events:kafka'), logger);
    await events.start();

    const topics = cfg.get('events:kafka:topics');
    testTopic = events.topic(cfg.get('events:kafka:topics:test.resource:topic'));
    commandTopic = events.topic(cfg.get('events:kafka:topics:command:topic'));
    // subscribe all response events
    for (let eventName of cfg.get('events:kafka:topics:command:events')) {
      await commandTopic.on(eventName, eventListener);
    }

    server = new Server(cfg.get('server'), logger);
    db = await co(database.get(cfg.get('database:arango'), server.logger));
    await co(db.truncate());

    const config = cfg.get();
    delete config.database.nedb;  // not supported in default implementation

    const cis = new CommandInterface(server, config, server.logger, events);
    await server.bind('commandinterface', cis);
    await server.start();

    const client = new Client(cfg.get('client:commandinterface'));
    service = await client.connect();
  });
  after(async function teardown() {
    await server.end();
    await events.stop();
  });
  describe('check', () => {
    it('should return the status', async function checkHealth() {
      let cmdPayload = encodeMsg({
        service: 'commandinterface'
      });

      const msg = {
        name: 'health_check',
        payload: cmdPayload
      };

      // validator called by the event listener
      validate = function (msg: any, eventName: string): void {
        eventName.should.equal('healthCheckResponse');
        should.exist(msg.services);
        msg.services.should.containEql('commandinterface');
        should.exist(msg.payload);
        const payload = decodeMsg(msg.payload);
        should.not.exist(payload.error);
        should.exist(payload.status);
        payload.status.should.equal('SERVING');
      };

      let offset = await commandTopic.$offset(-1);
      // check commandinterface service, should serve
      let resp = await service.command(msg);
      await commandTopic.$wait(offset); // wait for response on both Kafka & gRPC

      should.not.exist(resp.error);
      should.exist(resp.data);
      let data = decodeMsg(resp.data);
      should.exist(data.status);
      data.status.should.equal('SERVING');

      // should not serve if service does not exist
      cmdPayload = encodeMsg({
        service: 'does_not_exist'
      });
      // check none existing service, should throw error
      resp = await service.command({
        name: 'health_check',
        payload: cmdPayload
      });
      should.exist(resp.data);
      data = decodeMsg(resp.data);
      should.not.exist(resp.error); // no exception thrown
      should.exist(data.error);  // tolerant error handling
      data.error.should.equal('Service does_not_exist does not exist');
      // should check all binded services if no service is specified
      cmdPayload = encodeMsg({
        service: ''
      });
      // check server, should serve
      resp = await service.command({
        name: 'health_check',
        payload: cmdPayload
      });
      await commandTopic.$wait(offset) + 1; // wait for response on both Kafka & gRPC
      should.not.exist(resp.error);
      should.exist(resp.data);
      data = decodeMsg(resp.data);
      should.exist(data.status);
      data.status.should.equal('SERVING');
    });
  });
  describe('reconfigure', () => {
    it('should return an error since it is not implemented', async function reconfigure() {
      const resp = await service.command({
        name: 'reconfigure'
      });
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
      validate = function (msg: any, eventName: string): void {
        eventName.should.equal('resetResponse');
        should.exist(msg.services);
        msg.services.should.containEql('commandinterface');
        should.exist(msg.payload);
        const payload = decodeMsg(msg.payload);
        should.not.exist(payload.error);
      };
      const offset = await commandTopic.$offset(-1);
      const resp = await service.command({
        name: 'reset'
      });
      await commandTopic.$wait(offset);

      should.not.exist(resp.error);
      should.exist(resp.data);

      const result = await co(db.findByID('tests', docID));
      result.should.be.length(0);
    });

  });

  describe('restore', function checkRestore() {
    before(async function prepareKafka() {
      for (let i = 0; i < 10; i += 1) {
        testEvent.count = i;
        await testTopic.emit('testCreated', testEvent);
      }
    });
    beforeEach(async function prepareDB() {
      await co(db.truncate('test'));
    });
    it('should re-read all data from the topics the service listens to', async function restore() {
      const cmdPayload = encodeMsg({
        test: {
          offset: 0,
          ignore_offset: []
        }
      });
      validate = function (msg: any, eventName: string) {
        eventName.should.equal('restoreResponse');
        should.exist(msg.services);
        msg.services.should.containEql('commandinterface');
        should.exist(msg.payload);
        const payload = decodeMsg(msg.payload);
        should.not.exist(payload.error);
        // restore conclusion is checked asynchronously, since it can take a variable
        // and potentially large amount of time
        co(db.find('test', {}, {
          sort: {
            count: 1
          }
        })).then((result) => {
          result.should.be.length(10);
          for (let i = 0; i < 10; i++) {
            result[i].count.should.equal(i);
          }
        });
      };

      // waiting for restore conclusion
      const offset = await commandTopic.$offset(-1);
      const resp = await service.command({
        name: 'restore',
        payload: cmdPayload
      });
      should.not.exist(resp.error);
      await commandTopic.$wait(offset);
    });
    it('should re-read all data from specified offset', async function restore() {
      const cmdPayload = encodeMsg({
        test: {
          offset: 5,
          ignore_offset: [],
        }
      });
      validate = function (msg: any, eventName: string) {
        eventName.should.equal('restoreResponse');
        should.exist(msg.services);
        msg.services.should.containEql('commandinterface');
        should.exist(msg.payload);
        const payload = decodeMsg(msg.payload);
        should.not.exist(payload.error);
        // restore conclusion is checked asynchronously, since it can take a variable
        // and potentially large amount of time
        co(db.find('test', {}, {
          sort: {
            count: 1
          }
        })).then((result) => {
          result.should.be.length(5);
          for (let i = 5; i < 10; i++) {
            result[i].count.should.equal(i);
          }
        });
      };

      // waiting for restore conclusion
      const offset = await commandTopic.$offset(-1);
      const resp = await service.command({
        name: 'restore',
        payload: cmdPayload
      });
      should.not.exist(resp.error);

      await commandTopic.$wait(offset);
    });
  });
  describe('version', () => {
    it('should return the version of the package and nodejs', async function version() {
      validate = function (msg: any, eventName: string): void {
        eventName.should.equal('versionResponse');
        should.exist(msg.services);
        msg.services.should.containEql('commandinterface');
        should.exist(msg.payload);
        const payload = decodeMsg(msg.payload);
        should.exist(payload.version);
        payload.version.should.equal(process.env.npm_package_version);
        should.exist(payload.nodejs);
        payload.nodejs.should.equal(process.version);
      };
      const offset = await commandTopic.$offset(-1);
      const resp = await service.command({
        name: 'version',
      });
      await commandTopic.$wait(offset);
      should.not.exist(resp.error);
      should.exist(resp.data);
      const data = decodeMsg(resp.data);
      should.exist(data.version);
      data.version.should.equal(process.env.npm_package_version);
      should.exist(data.nodejs);
      data.nodejs.should.equal(process.version);
    });
  });
});

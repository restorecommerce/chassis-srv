// microservice chassis
import { CommandInterface, database, Server } from '../src';
import * as should from 'should';
import { Client } from '@restorecommerce/grpc-client';
import { Events } from '@restorecommerce/kafka-client';
import { createServiceConfig } from '@restorecommerce/service-config';
import { createLogger } from '@restorecommerce/logger'
import * as Redis from 'ioredis';


/**
 *
 * @param msg google.protobuf.Any
 * @returns Arbitrary JSON
 */
const decodeMsg = (msg: any): any => {
  const decoded = Buffer.from(msg.value, 'base64').toString();
  return JSON.parse(decoded);
}

/**
 *
 * @param msg Arbitrary JSON
 * @returns google.protobuf.Any formatted message
 */
const encodeMsg = (msg: any): any => {

  const stringified = JSON.stringify(msg);
  const encoded = Buffer.from(stringified).toString('base64');
  const ret = {
    type_url: 'payload',
    value: encoded
  };
  return ret;
}

/*
 * Note: Running Kafka and ArangoDB instances are required.
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
  let redisClient;
  const eventListener = async (msg: any,
    context: any, config: any, eventName: string): Promise<any> => {
    await validate(msg, eventName);
  };
  before(async function setup() {
    this.timeout(30000);
    cfg = createServiceConfig(process.cwd() + '/test');
    const logger = createLogger(cfg.get('logger'));

    events = new Events(cfg.get('events:kafka'), logger);
    await events.start();

    const topics = cfg.get('events:kafka:topics');
    testTopic = await events.topic(cfg.get('events:kafka:topics:test.resource:topic'));
    commandTopic = await events.topic(cfg.get('events:kafka:topics:command:topic'));
    // subscribe all response events
    for (let eventName of cfg.get('events:kafka:topics:command:events')) {
      await commandTopic.on(eventName, eventListener);
    }

    server = new Server(cfg.get('server'), logger);
    db = await database.get(cfg.get('database:arango'), logger);
    await db.truncate();

    const config = cfg.get();
    delete config.database.nedb;  // not supported in default implementation

    // init redis client for subject index
    const redisConfig = cfg.get('redis');
    redisConfig.db = cfg.get('redis:db-indexes:db-subject');
    redisClient = new Redis(redisConfig);

    const cis = new CommandInterface(server, cfg, logger, events, redisClient);
    await server.bind('commandinterface', cis);
    await server.start();

    const client = new Client(cfg.get('client:commandinterface'), logger);
    service = await client.connect();
  });
  after(async function teardown() {
    this.timeout(30000);
    await server.stop();
    await events.stop();
  });
  describe('check', () => {
    it('should return the status', async () => {
      let cmdPayload = encodeMsg({
        service: 'commandinterface'
      });

      const msg = {
        name: 'health_check',
        payload: cmdPayload
      };

      // validator called by the event listener
      validate = (msg: any, eventName: string): void => {
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
      await commandTopic.$wait(offset); // wait for response on both Kafka & gRPC
      should.not.exist(resp.error);
      should.exist(resp.data);
      data = decodeMsg(resp.data);
      should.exist(data.status);
      data.status.should.equal('SERVING');
    });
  });
  describe('reconfigure', () => {
    it('should return an error since it is not implemented', async () => {
      const resp = await service.command({
        name: 'reconfigure'
      });
      should.exist(resp.error);
    });
  });
  describe('reset', () => {
    const docID = 'test/value';
    before(async () => {
      await db.insert('tests', {
        id: docID,
        value: 101,
      });
    });
    it('should clean the database', async () => {
      validate = (msg: any, eventName: string): void => {
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

      const result = await db.findByID('tests', docID);
      result.should.be.length(0);
    });

  });

  describe('restore', () => {
    before(async function prepareKafka() {
      this.timeout(30000);
      for (let i = 0; i < 100; i += 1) {
        testEvent.count = i;
        await testTopic.emit('testCreated', testEvent);
      }
    });
    beforeEach(async () => {
      await db.truncate('tests');
    });
    it('should re-read all data from specified offset', async function restore() {
      this.timeout(30000);
      validate = async (msg: any, eventName: string) => {
        eventName.should.equal('restoreResponse');
        should.exist(msg.services);
        msg.services.should.containEql('commandinterface');
        should.exist(msg.payload);
        const payload = decodeMsg(msg.payload);
        should.not.exist(payload.error);
        // restore conclusion is checked asynchronously, since it can take a variable
        // and potentially large amount of time
        const result = await db.find('tests', {}, {
          sort: {
            count: 1
          }
        });
        for (let i = 0; i < 100; i++) {
          result[i].count.should.equal(i);
        }
      };

      // waiting for restore conclusion
      const offset = await commandTopic.$offset(-1);
      const resourceOffset = await testTopic.$offset(-1);

      const cmdPayload = encodeMsg({
        data: [
          {
            entity: 'test',
            base_offset: resourceOffset - 100,
            ignore_offset: []
          }
        ]
      });

      const resp = await service.command({
        name: 'restore',
        payload: cmdPayload
      });
      should.not.exist(resp.error);

      await commandTopic.$wait(offset);
    });
  });
  describe('version', () => {
    it('should return the version of the package and nodejs', async () => {
      validate = (msg: any, eventName: string): void => {
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
  describe('setApiKey', () => {
    it('should set the provided authentication api key on configuration', async () => {
      validate = (msg: any, eventName: string): void => {
        eventName.should.equal('setApiKeyResponse');
        should.exist(msg.services);
        msg.services.should.containEql('commandinterface');
        should.exist(msg.payload);
        const payload = decodeMsg(msg.payload);
        should.exist(payload.status);
        payload.status.should.equal('ApiKey set successfully');
      };
      const offset = await commandTopic.$offset(-1);
      const apiKeyPayload = encodeMsg({
        authentication: {
          apiKey: 'test-api-key-value'
        }
      });
      const resp = await service.command({
        name: 'set_api_key',
        payload: apiKeyPayload
      });
      await commandTopic.$wait(offset);
      should.not.exist(resp.error);
      should.exist(resp.data);
      const data = decodeMsg(resp.data);
      should.exist(data.status);
      data.status.should.equal('ApiKey set successfully');
    });
  });
  describe('configUpdate', () => {
    it('should update the provide configuration', async () => {
      validate = (msg: any, eventName: string): void => {
        eventName.should.equal('configUpdateResponse');
        should.exist(msg.services);
        msg.services.should.containEql('commandinterface');
        should.exist(msg.payload);
        const payload = decodeMsg(msg.payload);
        should.exist(payload.status);
        payload.status.should.equal('Configuration updated successfully');
      };
      const offset = await commandTopic.$offset(-1);
      const configPayload = encodeMsg({
        authentication: {
        }
      });
      const resp = await service.command({
        name: 'config_update',
        payload: configPayload
      });
      await commandTopic.$wait(offset);
      should.not.exist(resp.error);
      should.exist(resp.data);
      const data = decodeMsg(resp.data);
      should.exist(data.status);
      data.status.should.equal('Configuration updated successfully');
    });
  });
  describe('flushCache', () => {
    it('should flush with given db_index and pattern', async () => {
      validate = (msg: any, eventName: string): void => {
        eventName.should.equal('flushCacheResponse');
        should.exist(msg.payload);
        const payload = decodeMsg(msg.payload);
        should.exist(payload.status);
        payload.status.should.equal('Successfully flushed cache pattern');
      };
      // store 3 keys to redis db index 3
      const redis: any = new Redis({ db: 3 });
      redis.set('user1', 'user1');
      redis.set('user2', 'user2');
      redis.set('user3', 'user3');
      redis.set('testKey', 'testValue');
      const offset = await commandTopic.$offset(-1);
      const flushCachePayload = encodeMsg({
        data:
        {
          db_index: 3,
          pattern: 'user'
        }
      });
      const resp = await service.command({
        name: 'flush_cache',
        payload: flushCachePayload
      });
      const stream = redis.scanStream({ match: '*' });
      // after flushing user pattern keys testKey should still be existing
      stream.on('data', (resultKeys) => {
        resultKeys.length.should.be.equal(1);
      });
      await commandTopic.$wait(offset);
      should.not.exist(resp.error);
      should.exist(resp.data);
      const data = decodeMsg(resp.data);
      should.exist(data.status);
      data.status.should.equal('Successfully flushed cache pattern');
    });
    it('flushdb should flush all keys in specific db_index when no pattern is specified', async () => {
      // store 3 keys to redis db index 3
      const redis: any = new Redis({ db: 3 });
      await redis.set('user1', 'user1');
      await redis.set('user2', 'user2');
      await redis.set('testKey2', 'testValue2');
      const flushCachePayload = encodeMsg({
        data:
        {
          db_index: 3 // No pattern is specified
        }
      });
      const resp = await service.command({
        name: 'flush_cache',
        payload: flushCachePayload
      });
      const stream = redis.scanStream({ match: '*' });
      // after flushing DB
      stream.on('data', (resultKeys) => {
        resultKeys.length.should.be.equal(0);
      });
      should.not.exist(resp.error);
      should.exist(resp.data);
      const data = decodeMsg(resp.data);
      should.exist(data.status);
      data.status.should.equal('Successfully flushed cache with DB index 3');
    });
  });
});

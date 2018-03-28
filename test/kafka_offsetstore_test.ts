'use strict';

import * as should from 'should';
import { Events, Topic } from '@restorecommerce/kafka-client';
import * as Logger from '@restorecommerce/logger';
import { OffsetStore } from './../lib/offsets';
import * as sconfig from '@restorecommerce/service-config';
import * as sleep from 'sleep';


/* global describe it before after */

describe('offsetStore', () => {
  let events: Events;
  const topicName = 'test';
  let topic: Topic;
  let offsetStore: OffsetStore;
  const eventName = 'testCreated';
  const testMessage = { value: 'testValue', count: 1 };

  const cfg = sconfig(process.cwd() + '/test');
  const logger = new Logger(cfg.get('logger'));

  beforeEach(async function start() {
    events = new Events(cfg.get('events:kafka'), logger);
    await events.start();
  });
  afterEach(async function stop() {
    await offsetStore.stop();
    await events.stop();
  });

  it('should emit an event and verify the stored offset value from redis',
    async function testStoredOffsetValue() {
      this.timeout(10000);
      offsetStore = new OffsetStore(events, cfg, logger);
      topic = await (events.topic(topicName));

      const listener = function listener(message, context) {
        testMessage.value.should.equal(message.value);
        testMessage.count.should.equal(message.count);
      };
      // get the current offsetValue for 'test' topic before emitting message
      const currentOffset = await topic.$offset(-1);
      // emit message to kafka
      await topic.on(eventName, listener);
      await topic.emit(eventName, testMessage);
      const newOffset = await new Promise((resolve, reject) => {
        setTimeout(async () => {
          const offsetValue = await offsetStore.getOffset(topicName);
          resolve(offsetValue);
        }, 8000);
      });
      should.exist(newOffset);
      Number(newOffset).should.equal(currentOffset + 1);
    });
  it('should consume a previously emitted message from Kafka',
    async function testConsumeListener() {
      this.timeout(4000);
      // emit testMessage to kafka
      topic = await events.topic(topicName);
      await topic.emit(eventName, testMessage);

      // start offsetTracker subscribing to previous offset value read
      // from redis and consume the above message
      offsetStore = new OffsetStore(events, cfg, logger);
      const listener = async function listener(message, context) {
        testMessage.value.should.equal(message.value);
        testMessage.count.should.equal(message.count);
      };

      // get the current offsetValue for 'test' topic before emitting message
      let startingOffset = await offsetStore.getOffset(topicName);
      await topic.on(eventName, listener, startingOffset);

      // wait for 2sec so that message is consumed and
      // test is not ended immediately
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 2000);
      });
    });
});

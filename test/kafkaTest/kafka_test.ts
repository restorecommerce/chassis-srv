import * as mocha from 'mocha';
import * as coMocha from 'co-mocha';

coMocha(mocha);

import * as should from 'should';
const logger = require('./../logger_test.js');
import * as chassis from '../../lib';
import * as sconfig from '@restorecommerce/service-config';
import { Events } from '@restorecommerce/kafka-client';

/* global describe it before after */
/*  eslint-disable require-yield */
describe('Kafka events provider', () => {
  let events;
  before(async function setupProvider() {
    const cfg = sconfig(process.cwd() + '/test');
    events = new Events(cfg.get('events:kafkaTest'), logger);
    await events.start();
  });
  after(async function stopProvider() {
    await events.end();
  });
  describe('topic.$wait', function testWait() {
    this.timeout(5000);
    it('should wait until the event message is processed', async function waitUntil() {
      const testMessage = { value: 'value', count: 1 };
      const topic = events.topic('test.wait');
      let receivedOffset = await topic.$offset(-1);
      await topic.on('test-event', function onTestEvent(message, context) {
        should.exist(message);
        let receivedOffset = context.offset;
      });
      const offset = await topic.$offset(-1);
      await topic.emit('test-event', testMessage);
      await topic.$wait(offset);
      offset.should.equal(receivedOffset);
    });
  });
});

'use strict';

/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import * as mocha from 'mocha';
const coMocha = require('co-mocha');

coMocha(mocha);

import * as should from 'should';
const logger = require('./../logger_test.js');
import * as chassis from '../../lib';

const config = chassis.config;
import {Events} from "../../lib/events/index";

/* global describe it before after */
/*  eslint-disable require-yield */
describe('Kafka events provider', () => {
  let events;
  before(function* setupProvider() {
    yield config.load(process.cwd() + '/test', logger);
    const cfg = yield chassis.config.get();
    events = new Events(cfg.get('events:kafkaTest'), logger);
    yield events.start();
  });
  after(function* stopProvider() {
    yield events.end();
  });
  describe('topic.$wait', function testWait() {
    this.timeout(5000);
    it('should wait until the event message is processed', function* waitUntil() {
      const testMessage = { value: 'value', count: 1 };
      const topic = yield events.topic('test.wait');
      let receivedOffset = yield topic.$offset(-1);
      yield topic.on('test-event', function* onTestEvent(message, context) {
        should.exist(message);
        receivedOffset = context.offset;
      });
      const offset = yield topic.$offset(-1);
      yield topic.emit('test-event', testMessage);
      yield topic.$wait(offset);
      offset.should.equal(receivedOffset);
    });
  });
});

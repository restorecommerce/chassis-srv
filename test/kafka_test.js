'use strict';

/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
const mocha = require('mocha');
const coMocha = require('co-mocha');
coMocha(mocha);

const should = require('should');
const logger = require('./logger_test.js');
const chassis = require('../');
const config = chassis.config;
const Events = chassis.events.Events;

/* global describe it beforeEach afterEach */

describe('Kafka events provider', () => {
  let events;
  beforeEach(function* setupProvider() {
    config.load(process.cwd() + '/test', logger);
    events = new Events('kafkaTest');
    yield events.start();
  });
  afterEach(function* stopProvider() {
    yield events.end();
  });
  describe('topic.$wait', function testWait() {
    this.timeout(10000);
    it('should wait until the event message is processed', function* waitUntil() {
      const testMessage = {
        value: 'test',
        count: 1,
      };
      // works with topic: test.wait
      // does not work with topic: test
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

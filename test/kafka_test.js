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

/* global describe it before after */

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
      const testProto = require('./protos/test_pb.js');

      const testMessage = new testProto.TestEvent();
      testMessage.setValue('value');
      testMessage.setCount(1);

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

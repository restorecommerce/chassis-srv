'use strict';

const mocha = require('mocha');
const coMocha = require('co-mocha');
coMocha(mocha);

const should = require('should');
const co = require('co');
const isGeneratorFn = require('is-generator').fn;
const logger = require('./logger_test.js');

const Events = require('../lib/events').Events;
const Kafka = require('../lib/events/provider/kafka').Kafka;

/* global describe it */

describe('events', () => {
  describe('without a provider', () => {
    const topicName = 'test';
    describe('yielding subscribe', () => {
      it('should throw an error', function* checkGetTopic() {
        const result = yield co(function* getTopic() {
          const events = new Events();
          return yield events.topic(topicName);
        }).then((res) => {
          should.ok(false, 'should not call then');
        }).catch((err) => {
          should.exist(err);
          err.should.be.Error();
          err.message.should.equal('provider does not exist');
        });
        should.not.exist(result);
      });
    });
  });
  describe('with kafka provider', () => {
    const config = {
      name: 'kafka',
      groupId: 'restore-chassis-example-test',
      clientId: 'restore-chassis-example-test',
      connectionString: 'localhost:9092',
    };
    const kafka = new Kafka(config, logger);
    const events = new Events(kafka);
    const topicName = 'test';
    let topic;
    const eventName = 'test-event';
    const testMessage = {
      value: 'test',
      count: 1,
    };
    describe('yielding subscribe', () => {
      it('should return a topic', function* checkGetTopic() {
        topic = yield events.topic(topicName);
        should.exist(topic);
        should.exist(topic.on);
        should.exist(topic.emit);
        should.exist(topic.listenerCount);
        should.exist(topic.removeListener);
        should.exist(topic.removeAllListeners);
        should.ok(isGeneratorFn(topic.on));
        should.ok(isGeneratorFn(topic.emit));
        should.ok(isGeneratorFn(topic.listenerCount));
        should.ok(isGeneratorFn(topic.removeListener));
        should.ok(isGeneratorFn(topic.removeAllListeners));
      });
    });
    describe('yielding kafka.start', function startKafka() {
      let callback;
      const listener = function* listener(message) {
        should.exist(message);
        testMessage.value.should.equal(message.value);
        testMessage.count.should.equal(message.count);
        if (callback) {
          callback();
          callback = undefined;
        }
      };
      this.timeout(5000);
      it('should connect to kafka cluster', function* connectToKafka() {
        yield kafka.start();
      });
      it('should allow listening to events', function* listenToEvents() {
        const count = yield topic.listenerCount(eventName);
        yield topic.on(eventName, listener);
        const countAfter = yield topic.listenerCount(eventName);
        countAfter.should.equal(count + 1);
      });
      it('should allow removing all listeners', function* removeAllListeners() {
        yield topic.on(eventName, listener);
        yield topic.removeAllListeners(eventName);
        const count = yield topic.listenerCount(eventName);
        count.should.equal(0);
      });
      it('should allow removing a listener', function* removeListener() {
        const count = yield topic.listenerCount(eventName);
        yield topic.on(eventName, listener);
        yield topic.removeListener(eventName, listener);
        const countAfter = yield topic.listenerCount(eventName);
        countAfter.should.equal(count);
      });
      it('should allow counting listeners', function* countListeners() {
        const count = yield topic.listenerCount(eventName);
        should.exist(count);
        const hasListeners = yield topic.hasListeners(eventName);
        hasListeners.should.equal(count > 0);
        yield topic.on(eventName, listener);
        let countAfter = yield topic.listenerCount(eventName);
        countAfter.should.equal(count + 1);
        yield topic.removeListener(eventName, listener);
        countAfter = yield topic.listenerCount(eventName);
        countAfter.should.equal(count);
      });
      it('should allow emitting', function* sendEvents(done) {
        yield topic.on(eventName, listener);
        callback = done;
        try {
          yield topic.emit(eventName, testMessage);
        } catch (e) {
          done(e);
        }
      });
      describe('yielding kafka.end', () => {
        it('should close the kafka connection', function* disconnectFromKafka() {
          yield kafka.end();
        });
      });
    });
  });
});

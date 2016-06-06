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
        should.ok(isGeneratorFn(topic.emit));
      });
    });
    describe('yielding kafka.start', () => {
      let callback;
      const listener = function* makeListener(message) {
        testMessage.value.should.equal(message.value);
        testMessage.count.should.equal(message.count);
        if (callback) {
          callback();
          callback = undefined;
        }
      };
      it('should connect to kafka cluster', function* connectToKafka() {
        yield kafka.start();
      });
      it('should allow listening to events', function* listenToEvents() {
        topic.on(eventName, listener);
      });
      it('should allow sending', function* sendEvents(done) {
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

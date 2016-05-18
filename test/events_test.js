'use strict';

var mocha = require('mocha')
var coMocha = require('co-mocha')
coMocha(mocha)

var assert = require('assert');
var should = require('should');
var util = require('util');
var co = require('co');
var isGenerator = require('is-generator');
var isGeneratorFn = require('is-generator').fn

var Events = require('../lib/transport/events/events').Events;
var Kafka = require('../lib/transport/events/kafka').Kafka;

describe('events', function() {
  describe('without a provider', function() {
    let events = new Events();
    let topicName = 'test';
    describe('yielding subscribe', function() {
      it('should throw an error', function*() {
        let result = yield co(function*() {
          return yield events.subscribe(topicName);
        }).then(function(result) {
          assert.ok(false, 'should not call then');
        }).catch(function(err) {
          assert(err);
        })
        assert(result === undefined);
      })
    });
  });
  describe('with kafka proivder', function() {
    let config = {
      groupId: 'restore-chassis-srv-test',
      clientId: 'restore-chassis-srv-test',
      connectionString: 'localhost:9092',
    };
    let logger = {
      log: function() {}, // silence kafka
    };
    let kafka = new Kafka(config, logger);
    let events = new Events(kafka);
    let topicName = 'test';
    let topic;
    let eventName = 'test-event';
    let testMessage = {
      value: 'test',
      count: 1,
    };
    describe('yielding subscribe', function() {
      it('should return a topic', function*() {
        topic = yield events.subscribe(topicName);
        assert(topic);
        assert(topic.on);
        assert(topic.emit);
        assert(isGeneratorFn(topic.emit));
      });
    });
    describe('yielding kafka.start', function() {
      let callback;
      let listener = function*(message) {
        assert.deepEqual(testMessage, message);
        callback();
      };
      it('should connect to kafka cluster', function*() {
        yield kafka.start();
      });
      it('should allow listening to events', function*() {
        topic.on(eventName, listener);
      });
      it('should allow sending', function*(done) {
        callback = done
        yield topic.emit(eventName, testMessage);
      });
      describe('yielding kafka.end', function() {
        it('should close the kafka connection', function*() {
          yield kafka.end();
        });
      });
    });
  });
});

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
  describe('with kafka provider', function() {
    let logger = {
      log: function(){
        let level = arguments[0].toLowerCase();
        if (level == 'error') {
          let args = Array.prototype.splice.apply(arguments, [1]);
          console.log(level, args);
        }
      },
    };
    let config = {
      "name": "kafka",
      "proto": ["io/restorecommerce/event.proto", "../test/test.proto"],
      "protoRoot": "protos/",
      "groupId": "restore-chassis-example-test",
      "clientId": "restore-chassis-example-test",
      "connectionString": "localhost:9092",
      "message": "io.restorecommerce.event.Event",
      "messages": {},
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
    config.messages[topicName] = {};
    config.messages[topicName][eventName] = 'test.TestEvent';
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

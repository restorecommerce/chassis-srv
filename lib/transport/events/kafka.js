'use strict';

let kafka = require('no-kafka');
let Promise = require('bluebird');
let co = require('co');

function Kafka(options) {
  var self = this;
  self._topics = {};
  self._log = options.logger.logFunction;

  // topic._send = provider.subscribe(name, topic._receive);
  this.subscribe = function(topicName, cb) {
    if (!self._topics[topicName]) {
      self._topics[topicName] = cb;
    }
    return function(eventName, message) {
      self._send(topicName, eventName, message);
    };
  }

  this._send = function(topic, eventName, message) {
    message = {
      name: eventName,
      message: message,
    }
    self._producer.send({
      topic: topic,
      partition: 0,
      message: {
        value: JSON.stringify(message),
      },
    });
  }

  this.start = function*() {
    let topics = Object.keys(self._topics);
    self._consumer = new kafka.GroupConsumer(options);
    var strategies = [{
      strategy: 'RoundRobinAssignment',
      subscriptions: topics,
      handler: function(messageSet, topic, partition) {
        return Promise.each(messageSet, function(m) {
          return co(function*(){
            var msg = JSON.parse(m.message.value);
            var eventType = msg.name;
            let result = yield self._topics[topic](eventType, msg.message);
            self._log('topic', topic, 'event', eventType, 'result', result);
          }).then(function(){
            // commit offset
            self._log('topic', topic, 'commit offset', m.offset);
            return self._consumer.commitOffset({
              topic: topic,
              partition: partition,
              offset: m.offset,
              metadata: 'optional'
            });
          }).catch(function(err){
            // do not commit offset
            self._log('topic', topic, 'error', err);
          });
        });
      }
    }];
    yield self._consumer.init(strategies);

    self._producer = new kafka.Producer(options);
    yield self._producer.init();
  }
  this.end = function*() {
    yield self._consumer.end();
    yield self._producer.end();
  }
}

module.exports.Kafka = Kafka;

'use strict';

let kafka = require('no-kafka');
let Promise = require('bluebird');
let co = require('co');

/**
 * Kafka is a provider for Events.
 * @constructor
 * @see {@link Events}
 * @param {[type]} options [description]
 */
function Kafka(options) {
  this.options = options;
  this._topics = {};
  this._log = options.logger.logFunction;
}

Kafka.prototype.start = function*() {
  let topics = Object.keys(this._topics);
  this._consumer = new kafka.GroupConsumer(this.options);
  var self = this;
  var strategies = [{
    strategy: 'RoundRobinAssignment',
    subscriptions: topics,
    handler: function(messageSet, topic, partition) {
      return Promise.each(messageSet, function(m) {
        return co(function*(){
          var msg = JSON.parse(m.message.value);
          var eventType = msg.name;
          yield self._topics[topic]._receive(eventType, msg.message);
          self._log('DEBUG', 'topic', topic, 'event', eventType);
        }).then(function(){
          // commit offset
          self._log('DEBUG', 'topic', topic, 'commit offset', m.offset);
          return self._consumer.commitOffset({
            topic: topic,
            partition: partition,
            offset: m.offset,
            metadata: 'optional'
          });
        }).catch(function(err){
          // do not commit offset
          self._log('ERROR', 'topic', topic, 'error', err);
        });
      });
    }
  }];
  yield this._consumer.init(strategies);

  this._producer = new kafka.Producer(this.options);
  yield this._producer.init();
}

Kafka.prototype._send = function*(topic, eventName, message) {
  message = {
    name: eventName,
    message: message,
  }
  return yield this._producer.send({
    topic: topic,
    partition: 0,
    message: {
      value: JSON.stringify(message),
    },
  });
}

Kafka.prototype.subscribe = function*(topic) {
  if (!this._topics[topic.name]) {
    this._topics[topic.name] = topic;
  }
  var self = this;
  return function*(eventName, message) {
    yield self._send(topic.name, eventName, message);
  };
}

Kafka.prototype.end = function*() {
  yield this._consumer.end();
  yield this._producer.end();
};

module.exports.Kafka = Kafka;

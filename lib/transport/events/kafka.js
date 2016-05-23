'use strict';

var kafka = require('no-kafka');
var Promise = require('bluebird');
var co = require('co');
var util = require('util');
var path = require("path");
var ProtoBuf = require('protobufjs');

function getDescendantProp(obj, desc) {
    var arr = desc.split(".");
    while(arr.length && (obj = obj[arr.shift()]));
    return obj;
}

/**
 * Kafka is a provider for Events.
 * @constructor
 * @see {@link Events}
 * @param {[type]} options [description]
 */
function Kafka(options, logger) {
  this.options = options;
  this._topics = {};
  this._logger = logger;
  if (logger) {
    this._log = logger.log;
    this.options.logger = {
      logFunction: logger.log,
    };
  } else {
    this._log = options.logger.logFunction;
  }
  let protoFileName = path.join(process.cwd(), this.options.proto);
  this._builder = ProtoBuf.newBuilder({
    convertFieldsToCamelCase: true,
  });
  this._logger.log('VERBOSE', util.format('event provider Kafka: loading protobuf file %s', protoFileName));
  ProtoBuf.loadProtoFile(protoFileName, this._builder);
  this._event = this._builder.build(this.options.message);
  this._messages = {};
}
/**
 * start connects to kafka and listens to all subscribed topics.
 */
Kafka.prototype.start = function*() {
  let topics = Object.keys(this._topics);
  this._consumer = new kafka.GroupConsumer(this.options);
  var self = this;
  var strategies = [{
    strategy: 'RoundRobinAssignment',
    subscriptions: topics,
    handler: function(messageSet, topic, partition) {
      return Promise.each(messageSet, function(m) {
        return co(function*() {
          var msg = self._event.decode(m.message.value.toString());
          var eventType = msg.name;
          let Message = self._builder.build(msg.payload.typeUrl);
          let value = Message.decode(msg.payload.value);
          yield self._topics[topic]._receive(eventType, value);
          self._log('DEBUG', util.format('kafka received message with topic %s and event name %s', topic, eventType), value);
        }).then(function() {
          // commit offset
          self._log('DEBUG', util.format('kafka commit topic %s with offset %d', topic, m.offset));
          return self._consumer.commitOffset({
            topic: topic,
            partition: partition,
            offset: m.offset,
            metadata: 'optional'
          });
        }).catch(function(err) {
          // do not commit offset
          self._log('ERROR', 'topic', topic, 'error', err.stack, err.decoded);

          // TODO Commit for debugging
          return self._consumer.commitOffset({
            topic: topic,
            partition: partition,
            offset: m.offset,
            metadata: 'optional'
          });
        });
      });
    }
  }];
  yield this._consumer.init(strategies);

  this._producer = new kafka.Producer(this.options);
  yield this._producer.init();
}

Kafka.prototype._send = function*(topic, eventName, message) {
  let name = this.options.messages[topic][eventName];
  if (!this._messages[topic]) {
    this._messages[topic] = {};
  }
  if (!this._messages[topic][eventName]) {
    try {
      this._messages[topic][eventName] = this._builder.build(name);
      if (!this._messages[topic][eventName]) {
        throw new Error('builder failed');
      }
    } catch (err) {
      this._logger.log('ERROR', util.format('error on creating event %s for topic %s with protobuf message %s', eventName, topic, name), message, err);
      throw err;
    }
  }
  try {
    console.log('create payload', topic, eventName, message);
    console.log(this._messages);
    let payload = new this._messages[topic][eventName](message);
    console.log('any build');
    let Any = this._builder.build('google.protobuf.Any');

    let any = new Any();
    any.typeUrl = name;
    console.log('encode payload');
    any.value = payload.encode();
    message = {
      name: eventName,
      payload: any,
    };
    console.log('create event');
    let value = new this._event(message);
    let b = value.toBase64();
    this._logger.log('DEBUG', util.format('sending event %s to topic %s', eventName, topic), message);
    return yield this._producer.send({
      topic: topic,
      partition: 0,
      message: {
        value: b,
      },
    });
  } catch (err) {
    this._logger.log('ERROR', util.format('error on sending event %s to topic %s', eventName, topic), message, err);
    throw err;
  }
}

/**
 * subscribe register the topic.
 * @param  {string} topic Topic name
 * @return {function*}       Send event function
 */
Kafka.prototype.subscribe = function*(topic) {
  if (!this._topics[topic.name]) {
    this._topics[topic.name] = topic;
  }
  var self = this;
  return function*(eventName, message) {
    yield self._send(topic.name, eventName, message);
  };
}

/**
 * end stops the connection to kafka.
 */
Kafka.prototype.end = function*() {
  yield this._consumer.end();
  yield this._producer.end();
};

module.exports.Kafka = Kafka;

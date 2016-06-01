'use strict';

var kafka = require('no-kafka');
var Promise = require('bluebird');
var co = require('co');
var util = require('util');
var path = require('path');
var fs = require('fs');
var glob = require("glob")
var _ = require('lodash');
var ProtoBuf = require('protobufjs');

var EventEmitter = require('co-emitter');

/**
 * @constructor
 * @private
 * @param {string} name Topic name
 */
function Topic(name, provider) {
  this.name = name;
  this._emitter = new EventEmitter();
  this._provider = provider;
  this._subscribed = false;
}

Topic.prototype._subscribe = function() {
  var self = this;
  this._consumer = new kafka.GroupConsumer(this._provider.config);
  var strategies = [{
    strategy: 'RoundRobinAssignment',
    subscriptions: [this.name],
    handler: function(messageSet, topic, partition) {
      return Promise.each(messageSet, function(m) {
        return co(function*() {
          var msg = self._provider._event.decode(m.message.value.toString());
          var eventType = msg.name;
          let Message = self._provider._builder.build(msg.payload.typeUrl);
          let value = Message.decode(msg.payload.value);
          yield self._receive(eventType, value);
          self._provider._logger.log('DEBUG', util.format('kafka received message with topic %s and event name %s', topic, eventType), value);
        }).then(function() {
          // commit offset
          self._provider._logger.log('DEBUG', util.format('kafka commit topic %s with offset %d', topic, m.offset));
          return self._consumer.commitOffset({
            topic: topic,
            partition: partition,
            offset: m.offset,
            metadata: 'optional'
          });
        }).catch(function(err) {
          // do not commit offset
          self._provider._logger.log('ERROR', 'topic', topic, 'error', err.stack, err.decoded);

          // TODO Commit for debugging
          return self._consumer.commitOffset({
            topic: topic,
            partition: partition,
            offset: m.offset,
            metadata: 'optional'
          });
        });
      });
    },
  }];
  this._consumer.init(strategies);
}

Topic.prototype._receive = function*(eventName, message) {
  yield this._emitter.emit(eventName, message);
};

/**
 * Listen to events.
 * @param  {string} eventName Event name
 * @param  {function*} listener  Listener
 */
Topic.prototype.on = function(eventName, listener) {
  if(!this._subscribed) {
    this._subscribe();
    this._subscribed = true;
  }
  this._emitter.on(eventName, listener);
};

/**
 * Sends event messages.
 * @param  {string} eventName Event name
 * @param  {Object} message   Message
 */
Topic.prototype.emit = function*(eventName, message) {
  yield this._provider._send(this.name, eventName, message);
};

function buildProtobuf(files, root, logger) {
  // build protobuf
  let builder = ProtoBuf.newBuilder({
    convertFieldsToCamelCase: true,
  });
  _.forEach(files, function(fileName, key){
    let ok = builder.files[fileName];
    if (ok) return;
    logger.log('VERBOSE', util.format('event provider Kafka: loading protobuf file %s with root %s', fileName, root));
    let file = fs.readFileSync(fileName, 'utf8');
    ProtoBuf.loadProto(file, builder, {file:fileName, root: root});
  });
  return builder;
}

function getEventMessages(node) {
  let messages = [];
  for(let i = 0; i < node.children.length; i++) {
      let child = node.children[i];
      switch (child.className) {
      case 'Namespace':
        let msgs = getEventMessages(child);
        messages = messages.concat(msgs);
        break;
      case 'Message':
        if (child.options && child.options.event) {
          messages.push(child);
        }
        break;
      }
  }
  return messages;
}


function getEvents(builder) {
  let messages = [];
  for(let i = 0; i < builder.ns.children.length; i++) {
    let msgs = getEventMessages(builder.ns.children[i]);
    messages = messages.concat(msgs);
  }
  return messages;
}

function createEvents(builder, eventMessages, logger) {
  let event = {};
  for(let i = 0; i < eventMessages.length; i++) {
    let msg = eventMessages[i];
    let eventNames = msg.options.event;
    if (!_.isArray(eventNames)) {
      eventNames = [eventNames];
    }
    for(let j = 0; j < eventNames.length; j++) {
      let eventName = eventNames[j];
      _.set(event, eventName, msg);
      logger.log('DEBUG', util.format('event %s has %s message', eventName, msg.fqn()));
    }
  }
  return event;
}

/**
 * Kafka is a provider for Events.
 * @constructor
 * @see {@link Events}
 * @param {[type]} config [description]
 */
function Kafka(config, logger) {
  let self = this;
  this.config = config;
  this._topics = {};
  this._logger = logger;
  this.config.logger = {
    logFunction: logger.log,
  };

  // build protobuf
  let protoRoot = path.join(process.cwd(), 'protos');
  let files = glob.sync(protoRoot + '/**/*.proto');
  this._builder = buildProtobuf(files, protoRoot, logger);

  // get event messages
  let msgs = getEvents(this._builder);
  this._events = createEvents(this._builder, msgs, logger);

  let messageEventPath = this.config.message || 'io.restorecommerce.event.Event';
  this._event = this._builder.build(messageEventPath);
}

/**
 * start connects to kafka and listens to all subscribed topics.
 */
Kafka.prototype.start = function*() {
  this._producer = new kafka.Producer(this.config);
  yield this._producer.init();
}

Kafka.prototype._send = function*(topic, eventName, message) {
  if(!this._events[topic]) {
    throw new Error(util.format('topic %s does not have any event messages defined', topic));
  }
  if(!this._events[topic][eventName]) {
    throw new Error(util.format('topic %s does not have %s event message defined', topic, eventName));
  }
  try {
    let msgDef = this._events[topic][eventName];
    let name = msgDef.fqn().substring(1);
    let Message = msgDef.build();
    let payload = new Message(message);
    let Any = this._builder.build('google.protobuf.Any');

    let any = new Any();
    any.typeUrl = name;
    any.value = payload.encode();
    let evt = {
      name: eventName,
      payload: any,
    };
    let value = new this._event(evt);
    this._logger.log('DEBUG', util.format('sending event %s to topic %s', eventName, topic), message);
    return yield this._producer.send({
      topic: topic,
      partition: 0,
      message: {
        value: value.toBase64(),
      },
    });
  } catch (err) {
    this._logger.log('ERROR', util.format('error on sending event %s to topic %s', eventName, topic), message, err);
    throw err;
  }
}

/**
 * Returns a topic.
 * @param  {string} topicName Topic name
 * @return {function*}       Send event function
 */
Kafka.prototype.topic = function*(topicName) {
  if (this._topics[topicName]) {
    return this._topics[topicName];
  }
  var self = this;
  let topic = new Topic(topicName, this);
  this._topics[topicName] = topic;
  return topic;
}

/**
 * end stops the connection to kafka.
 */
Kafka.prototype.end = function*() {
  _.forIn(this._topics, function(topic, key){
    if(topic._consumer) {
      topic._consumer.end();
    }
  });
  yield this._producer.end();
};

module.exports.Kafka = Kafka;

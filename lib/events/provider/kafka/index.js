'use strict';

const kafka = require('no-kafka');
const Promise = require('bluebird');
const co = require('co');
const util = require('util');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const _ = require('lodash');
const ProtoBuf = require('protobufjs');

const EventEmitter = require('co-emitter');

/**
 * @constructor
 * @private
 * @param {string} name Topic name
 */
function Topic(name, provider) {
  this.name = name;
  this.$emitter = new EventEmitter();
  this.$provider = provider;
  this.$subscribed = false;
}

Topic.prototype.$subscribe = function subscribe() {
  /* eslint consistent-this: ["error", "that"]*/
  const that = this;

  this.$consumer = new kafka.GroupConsumer(this.$provider.config);
  const strategies = [{
    strategy: 'RoundRobinAssignment',
    subscriptions: [this.name],
    handler: (messageSet, topic, partition) => {
      return Promise.each(messageSet, (m) => {
        return co(function* parseEvent() {
          const msg = that.$provider.$event.decode(m.message.value.toString());
          const eventType = msg.name;
          const Message = that.$provider.$builder.build(msg.payload.typeUrl);
          const value = Message.decode(msg.payload.value);
          yield that.$receive(eventType, value);
          that.$provider.$logger.debug(
            util.format('kafka received event with topic %s and event name %s',
              topic, eventType), value);
        }).then(() => {
          // commit offset
          that.$provider.$logger.debug(
            util.format('kafka commit topic %s with offset %d',
              topic, m.offset));
          return that.$consumer.commitOffset({
            topic,
            partition,
            offset: m.offset,
            metadata: 'optional'
          });
        }).catch((err) => {
          // do not commit offset
          that.$provider.$logger.error(
            util.format('topic %s error', topic), err, err.stack, err.decoded);
          throw err;
        });
      });
    },
  }];
  this.$consumer.init(strategies);
};

Topic.prototype.$receive = function* receive(eventName, message) {
  yield this.$emitter.emit(eventName, message);
};

/**
 * Listen to events.
 *
 * @param  {string} eventName Event name
 * @param  {generator} listener  Listener
 */
Topic.prototype.on = function on(eventName, listener) {
  if (!this.$subscribed) {
    this.$subscribe();
    this.$subscribed = true;
  }
  this.$emitter.on(eventName, listener);
};

/**
 * Sends event messages.
 *
 * @param  {string} eventName Event name
 * @param  {Object} message   Message
 */
Topic.prototype.emit = function* emit(eventName, message) {
  yield this.$provider.$send(this.name, eventName, message);
};

function buildProtobuf(files, root, logger) {
  // build protobuf
  const builder = ProtoBuf.newBuilder({
    convertFieldsToCamelCase: true,
  });
  _.forEach(files, (fileName, key) => {
    const ok = builder.files[fileName];
    if (ok) {
      return;
    }
    const file = fs.readFileSync(fileName, 'utf8');
    ProtoBuf.loadProto(file, builder, {
      file: fileName,
      root
    });
  });
  return builder;
}

function getEventMessages(node) {
  let messages = [];
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    switch (child.className) {
      case 'Namespace':
        messages = messages.concat(getEventMessages(child));
        break;
      case 'Message':
        if (child.options && child.options.event) {
          messages.push(child);
        }
        break;
      default:
        break;
    }
  }
  return messages;
}

function getEvents(builder) {
  let messages = [];
  for (let i = 0; i < builder.ns.children.length; i++) {
    const msgs = getEventMessages(builder.ns.children[i]);
    messages = messages.concat(msgs);
  }
  return messages;
}

function createEvents(builder, eventMessages, logger) {
  const event = {};
  for (let i = 0; i < eventMessages.length; i++) {
    const msg = eventMessages[i];
    let eventNames = msg.options.event;
    if (!_.isArray(eventNames)) {
      eventNames = [eventNames];
    }
    for (let j = 0; j < eventNames.length; j++) {
      const eventName = eventNames[j];
      _.set(event, eventName, msg);
      logger.debug(
        util.format('event %s has %s message', eventName, msg.fqn()));
    }
  }
  return event;
}

/**
 * Kafka is a provider for Events.
 *
 * @constructor
 * @see {@link Events}
 * @param {object} config
 * @param {object} logger
 */
function Kafka(config, logger) {
  this.config = config;
  this.$topics = {};
  this.$logger = logger;
  this.config.logger = logger;
  this.config.logger.logFunction = logger.log;

  // build protobuf
  const protoRoot = config.protoRoot || path.join(process.cwd(), 'protos');
  const files = glob.sync(protoRoot + '/**/*.proto');
  this.$logger.verbose(util.format('Kafka loading protobuf files from root %s', protoRoot), files);
  this.$builder = buildProtobuf(files, protoRoot, logger);

  const timestamp = this.$builder.lookup('google.protobuf.Timestamp');
  if (timestamp) {
    // TODO manipulate timestamp
  }

  // get event messages
  const msgs = getEvents(this.$builder);
  this.$events = createEvents(this.$builder, msgs, logger);

  const messageEventPath = this.config.message ||
    'io.restorecommerce.event.Event';
  this.$event = this.$builder.build(messageEventPath);
}

/**
 * start connects to kafka and listens to all subscribed topics.
 */
Kafka.prototype.start = function* start() {
  this.$producer = new kafka.Producer(this.config);
  yield this.$producer.init();
};

Kafka.prototype.$send = function* $send(topic, eventName, message) {
  if (!this.$events[topic]) {
    throw new Error(
      util.format('topic %s does not have any event messages defined', topic));
  }
  if (!this.$events[topic][eventName]) {
    throw new Error(
      util.format('topic %s does not have %s event message defined',
        topic, eventName));
  }
  try {
    const msgDef = this.$events[topic][eventName];
    const name = msgDef.fqn().substring(1);
    const Message = msgDef.build();
    const payload = new Message(message);
    const Any = this.$builder.build('google.protobuf.Any');

    const any = new Any();
    any.typeUrl = name;
    any.value = payload.encode();
    const evt = {
      name: eventName,
      payload: any,
    };
    const value = new this.$event(evt);
    this.$logger.debug(
      util.format('sending event %s to topic %s', eventName, topic), message);
    return yield this.$producer.send({
      topic,
      partition: 0,
      message: {
        value: value.toBase64(),
      },
    });
  } catch (err) {
    this.$logger.error(
      util.format('error on sending event %s to topic %s', eventName, topic),
      message, err);
    throw err;
  }
};

/**
 * Returns a topic.
 *
 * @param  {string} topicName Topic name
 * @return {generator}       Send event function
 */
Kafka.prototype.topic = function* topic(topicName) {
  if (this.$topics[topicName]) {
    return this.$topics[topicName];
  }
  this.$topics[topicName] = new Topic(topicName, this);
  return this.$topics[topicName];
};

/**
 * end stops the connection to kafka.
 */
Kafka.prototype.end = function* end() {
  _.forIn(this.$topics, (topic, key) => {
    if (topic.$consumer) {
      topic.$consumer.end();
    }
  });
  yield this.$producer.end();
};

module.exports.Kafka = Kafka;

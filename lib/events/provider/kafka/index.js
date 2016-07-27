'use strict';

const kafka = require('no-kafka');
const Promise = require('bluebird');
const co = require('co');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const ProtoBuf = require('protobufjs');
const EventEmitter = require('co-emitter');

const EVENT_OPTION = '(io.restorecommerce.event.event)';

/**
 * A Kafka topic.
 */
class Topic {
  /**
   * Kafka topic.
   * When the listener count for all events are zero, the consumer unsubscribes
   * from the topic.
   *
   * @constructor
   * @private
   * @param {string} name Topic name
   */
  constructor(name, provider) {
    this.name = name;
    this.$emitter = new EventEmitter();
    this.$provider = provider;
    this.$subscribed = false;
    this.waitQueue = [];
    this.$currentOffset = 0;
  }

  /**
   * Returns the number of listeners for the given event.
   *
   * @param  {string} eventName Name of the event
   * @return {number}           Number of listeners
   */
  * listenerCount(eventName) {
    if (_.isNil(eventName)) {
      throw new Error('missing argument eventName');
    }
    const listeners = this.$emitter.listeners(eventName);
    return listeners.length;
  }

  /**
   * Returns whether or not any listeners exist for event.
   *
   * @param  {string}  eventName [description]
   * @return {Boolean}           True when listeners exist, false if not.
   */
  * hasListeners(eventName) {
    if (_.isNil(eventName)) {
      throw new Error('missing argument eventName');
    }
    return this.$emitter.hasListeners(eventName);
  }

  /**
   * Remove the given listener from given event.
   * If no eventName is provided, all listeners from all events will be removed.
   * If no listener is provided, all listeners will be removed from the given event.
   *
   * @param  {string} eventName Name of the event
   * @param  {function|generator} listener  Event listener
   */
  * removeListener(eventName, listener) {
    this.$emitter.off(eventName, listener);
    if ((yield this.listenerCount(eventName)) === 0) {
      yield this.$unsubscribe();
    }
  }

  /**
   * Remove all listeners from given event.
   * If no eventName is provided, all listeners from all events will be removed.
   *
   * @param  {string} eventName Name of the event
   */
  * removeAllListeners(eventName) {
    this.$emitter.off(eventName);
    if ((yield this.listenerCount(eventName)) === 0) {
      yield this.$unsubscribe();
    }
  }

  /**
   * Return the offset number of this topic.
   *
   * @param {number} time Use -1 for latest and -2 for earliest.
   * @return {number} offset number
   */
  * $offset(time) {
    const topic = this.name;
    const partition = 0;
    const tt = time || kafka.LATEST_OFFSET; // the latest (next) offset by default
    const leader = yield this.$provider.$producer.client.findLeader(topic, partition, true);
    const request = {};
    request[leader] = [{
      topicName: topic,
      partitions: [{
        partition,
        time: tt,
        maxNumberOfOffsets: 1,
      }],
    }];
    const result = yield this.$provider.$producer.client.offsetRequest(request);
    const p = result[0];
    if (p.error) {
      throw p.error;
    }
    return p.offset[0];
  }

  $wait(offset) {
    /* eslint consistent-this: ["error", "that"]*/
    const that = this;
    return (cb) => {
      if (that.currentOffset >= offset) {
        cb();
        return;
      }
      that.waitQueue = [{ offset, cb }];
    };
  }

  /**
   * Force a comitted offset reset.
   *
   * @param {number} offset The offset at which to restart from.
   */
  * $reset(offset) {
    if (!this.$subscribed) {
      yield this.$subscribe(offset, offset);
    }
    yield this.$consumer.commitOffset({
      topic: this.name,
      offset: offset - 1,
    });
    if (!this.$subscribed) {
      yield this.$unsubscribe();
    }
    yield this.$subscribe(offset, offset);
  }

  /**
   * Unsubscribe from Kafka topic. Does not remove any listeners.
   */
  * $unsubscribe() {
    if (!this.$subscribed) {
      return;
    }
    this.$subscribed = false;
    yield this.$consumer.unsubscribe(this.name);
  }

  makeDataHandler() {
    const that = this;
    return (messageSet, topic, partition) => {
      return Promise.each(messageSet, (m) => {
        return co(function* parseEvent() {
          const msg = that.$provider.$event.decode(m.message.value.toString());
          const eventType = msg.name;
          const Message = that.$provider.$builder.build(msg.payload.typeUrl);
          const value = Message.decode(msg.payload.value);
          const context = {
            offset: m.offset,
            topic,
            partition,
          };
          yield that.$receive(eventType, value, context);
          that.$provider.$logger.debug(
            `kafka received event with topic ${topic} and event name ${eventType}`, value);
        }).then(() => {
          // commit offset
          that.$provider.$logger.debug(`kafka commit topic ${topic} with offset ${m.offset}`);
          const waitQueue = _.filter(that.waitQueue, (w) => {
            if (w.offset <= m.offset) {
              w.cb();
              return false;
            }
            return true;
          });
          _.set(that, 'waitQueue', waitQueue);
          _.set(that, '$currentOffset', m.offset);
          return that.$consumer.commitOffset({
            topic,
            partition,
            offset: m.offset,
            metadata: 'optional'
          });
        }).catch((error) => {
          if (error.name === 'NoKafkaConnectionError') {
            return;
          }
          // do not commit offset
          that.$provider.$logger.error(`topic ${topic} error`, error);
          throw error;
        });
      });
    };
  }

  /**
   * Subscribe to the kafka topic.
   *
   * @param  {number} startingOffset =             Kafka.LATEST_OFFSET Offset index
   * @param  {number} recoveryOffset =             Kafka.EARLIEST_OFFSET Offset index
   */
  * $subscribe(startingOffset = kafka.LATEST_OFFSET,
    recoveryOffset = kafka.LATEST_OFFSET) {
    const config = _.cloneDeep(this.$provider.config);
    if (startingOffset === 0) {
      config.startingOffset = kafka.EARLIEST_OFFSET;
    } else {
      config.startingOffset = startingOffset;
    }
    if (recoveryOffset === 0) {
      config.recoveryOffset = kafka.EARLIEST_OFFSET;
    } else {
      config.recoveryOffset = recoveryOffset;
    }
    this.$consumer = new kafka.GroupConsumer(config);
    const strategies = [{
      strategy: 'RoundRobinAssignment',
      subscriptions: [this.name],
      handler: this.makeDataHandler(),
      metadata: {
        weight: 4
      },
    }];
    yield this.$consumer.init(strategies);
    this.$subscribed = true;
  }

  /**
   * Internal function for receiving event messages from Kafka and
   * forwarding them to local listeners.
   */
  * $receive(eventName, message, context) {
    yield this.$emitter.emit(eventName, message, context);
  }

  /**
   * Listen to events.
   * When the topic is not subscribed to a Kafka topic, a connection to Kafka is
   * made and a group consumer subscribes to the Kafka topic with the name
   * of this topic.
   * NOTE When subscribing this call can take a bit. You can subscribe to a topic
   * preemptively by calling $subscribe.
   *
   * @param  {string} eventName Event name
   * @param  {function|generator} listener  Listener
   */
  * on(eventName, listener) {
    if (!this.$subscribed) {
      yield this.$subscribe();
    }
    this.$emitter.on(eventName, listener);
  }

  /**
   * Send event messages.
   *
   * @param  {string} eventName Event name
   * @param  {Object} message   Message
   */
  * emit(eventName, message) {
    yield this.$provider.$send(this.name, eventName, message);
  }
}

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
    const file = fs.readFileSync(root + fileName, 'utf8');
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
        if (child.options && child.options[EVENT_OPTION]) {
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
    let eventNames = msg.options[EVENT_OPTION];
    if (!_.isArray(eventNames)) {
      eventNames = [eventNames];
    }
    for (let j = 0; j < eventNames.length; j++) {
      const eventName = eventNames[j];
      _.set(event, eventName, msg);
      logger.debug(`event ${eventName} has ${msg.fqn()} message`);
    }
  }
  return event;
}

/**
 * Events provider.
 */
class Kafka {
  /**
   * Kafka is a provider for Events.
   *
   * @constructor
   * @see {@link Events}
   * @param {object} config
   * @param {object} logger
   */
  constructor(config, logger) {
    this.config = _.cloneDeep(config);
    this.$topics = {};
    this.$logger = logger;
    this.config.logger = logger;
    this.config.logger.logFunction = logger.log;

    // build protobuf
    const protoRoot = config.protoRoot || path.join(process.cwd(), 'protos');
    if (_.isNil(protoRoot) || _.size(protoRoot) === 0) {
      throw new Error('config value protoRoot is not set');
    }
    const protos = config.protos;
    if (_.isNil(protos) || _.size(protos) === 0) {
      throw new Error('config value protos is not set');
    }
    this.$logger.verbose(`Kafka loading protobuf files from root ${protoRoot}`, protos);
    this.$builder = buildProtobuf(protos, protoRoot, logger);

    // get event messages
    const msgs = getEvents(this.$builder);
    this.$events = createEvents(this.$builder, msgs, logger);

    const messageEventPath = this.config.message || 'io.restorecommerce.event.Event';
    this.$event = this.$builder.build(messageEventPath);
  }

  /**
   * start connects to kafka and listens to all subscribed topics.
   */
  * start() {
    this.$producer = new kafka.Producer(this.config);
    yield this.$producer.init();
  }

  /**
   * Send a message event to a Kafka topic.
   * A protobuf message containing an event option with the value
   * <topicName>.<eventName> is required.
   *
   * @param  {string} topicName
   * @param  {string} eventName
   * @param  {object} message
   */
  * $send(topicName, eventName, message) {
    const topic = _.get(this.$events, topicName);
    if (!topic) {
      throw new Error(`topic ${topicName} does not have any event messages defined`);
    }
    const msgDef = _.get(topic, eventName);
    if (!msgDef) {
      throw new Error(`topic ${topicName} does not have ${eventName} event message defined`);
    }
    try {
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
      this.$logger.debug(`sending event ${eventName} to topic ${topicName}`, message);
      return yield this.$producer.send({
        topic: topicName,
        partition: 0,
        message: {
          value: value.toBase64(),
        },
      });
    } catch (err) {
      this.$logger.error(`error on sending event ${eventName} to topic ${topicName}`, message, err);
      throw err;
    }
  }

  /**
   * Returns a topic.
   *
   * @param  {string} topicName Topic name
   * @return {generator}       Send event function
   */
  * topic(topicName) {
    if (this.$topics[topicName]) {
      return this.$topics[topicName];
    }
    this.$topics[topicName] = new Topic(topicName, this);
    return this.$topics[topicName];
  }

  /**
   * end stops the connection to kafka.
   */
  * end() {
    const errors = [];
    try {
      yield this.$producer.end();
    } catch (error) {
      errors.push(error);
    }
    const topicNames = _.keys(this.$topics);
    for (let i = 0; i < topicNames.length; i++) {
      const topic = this.$topics[topicNames[i]];
      if (topic.$consumer) {
        try {
          yield topic.$unsubscribe();
          yield topic.$consumer.end();
        } catch (error) {
          errors.push(error);
        }
      }
    }
    if (errors.length > 0) {
      throw errors;
    }
  }
}

module.exports.Name = 'kafka';
module.exports.Kafka = Kafka;
module.exports.EARLIEST_OFFSET = kafka.EARLIEST_OFFSET;
module.exports.LATEST_OFFSET = kafka.LATEST_OFFSET;

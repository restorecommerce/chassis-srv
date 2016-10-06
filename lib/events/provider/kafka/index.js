'use strict';

const kafka = require('kafka-node');
const Promise = require('bluebird');
const co = require('co');
const path = require('path');
const _ = require('lodash');
const EventEmitter = require('co-emitter');


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
    this.$provider.$producer.createTopics([this.name], true,
      (err, data) => {
        if (err) {
          this.$provider.$logger.error(`Cannot Creat Topic ${this.name} : ${err}`);
          throw err;
        }
        this.$provider.$logger.info(` Topic ${this.name} Created Successfully : ${data}`);
      }
    );
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
    const offset = new kafka.Offset(this.$provider.$producer.client);
    return yield (() => {
      return (cb) => {
        offset.fetch([
          { topic, partition, time: tt, maxNum: 1 }
        ], (err, data) => {
          // data
          // { 't': { '0': [999] } }
          if (err) {
            cb(err);
          }
          cb(null, data[topic][partition][0]);
        });
      };
    })();
  }

  /**
   * Suspend the calling function until the Kafka client received a message with the offset.
   * @param {number} offset Kafka message offset.
   * @return {thunk} Thunk will be resolved when a message is received
   * with the corresponding offset.
   */
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
    // yield this.$consumer.unsubscribe(this.name);
    yield (() => {
      return (cb) => {
        this.$consumer.removeTopics([this.name], (err, removed) => {
          if (err) {
            cb(err);
          }
          cb(null, removed);
        });
      };
    })();
  }

  /**
   * Construct Kafka topic handler.
   * Maps messages to events.
   * @return {function}
   */
  makeDataHandler() {
    const that = this;
    return (messageSet) => {
      return Promise.each([messageSet], (message) => {
        return co(function* parseEvent() {
          const msg = message.value;
          const eventType = message.key.toString('utf8');
          const context = {
            offset: message.offset,
            topic: message.topic,
            partition: message.partition,
          };
          yield that.$receive(eventType, msg, context);
          that.$provider.$logger.debug(
            `kafka received event with topic ${message.topic} and event name ${eventType}`, msg);
        }).then(() => {
          // commit offset
          that.$provider.$logger.debug(
            `kafka commit topic ${message.topic} with offset ${message.offset}`);
          const waitQueue = _.filter(that.waitQueue, (w) => {
            if (w.offset <= message.offset) {
              w.cb();
              return false;
            }
            return true;
          });
          _.set(that, 'waitQueue', waitQueue);
          _.set(that, '$currentOffset', message.offset);
          that.$consumer.commit((err, data) => { });
        }).catch((error) => {
          if (error.name === 'NoKafkaConnectionError') {
            return;
          }
          // do not commit offset
          that.$provider.$logger.error(`topic ${message.topic} error`, error);
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
   **/
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
    this.$consumer = new kafka.Consumer(
      this.$provider.$client,
      [
        { topic: this.name }
      ],
      {
        autoCommit: true,
        encoding: 'buffer'
      }
    );
    this.$consumer.on('message', (message) => {
      this.makeDataHandler()(message);
    });
    this.$subscribed = true;
  }

  /**
   * Internal function for receiving event messages from Kafka and
   * forwarding them to local listeners.
   * @param {string} eventName
   * @param {Object} message
   * @param {Object} context
   */
  * $receive(eventName, message, context) {
    yield this.$emitter.emit(eventName, { key: eventName, value: message }, context);
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
    this.ready = false;
    // build protobuf
    const protoRoot = config.protoRoot || path.join(process.cwd(), 'protos');
    if (_.isNil(protoRoot) || _.size(protoRoot) === 0) {
      throw new Error('config value protoRoot is not set');
    }
    const protos = config.protos;
    if (_.isNil(protos) || _.size(protos) === 0) {
      throw new Error('config value protos is not set');
    }
  }

  /**
   * Start connects to kafka with a producer.
   * Suspends the calling function until the producer is connected.
   */
  * start() {
    //  The passed connectionString is the connectionString to Zookeeper
    this.$client = new kafka.Client(this.config.connectionString);
    this.$producer = new kafka.Producer(this.$client);
    //  wait for producer to be ready
    return yield (() => {
      return (cb) => {
        this.$producer.on('ready', () => {
          this.$logger.info('The Producer is ready.');
          cb(null, true);
        });
        this.$producer.on('error', (err) => {
          this.$logger.error('The Producer have an error : ', err);
          cb(err);
        });
      };
    })();
  }

  /**
   * Send a message event to a Kafka topic.
   * A protobuf message is an instance of the google's protobuf generated class
   *
   * @param  {string} topicName
   * @param  {string} eventName
   * @param  {Object} message
   * @param  {array.Object} message
   * @param {string} messageType
   */
  * $send(topicName, eventName, message, messageType) {
    let messages = message;
    if (!_.isArray(message)) {
      messages = [message];
    }
    try {
      const values = [];
      for (let i = 0; i < messages.length; i++) {
        //  get the binary representation of the message using serializeBinary()
        //  and build a Buffer from it.
        values.push(new kafka.KeyedMessage(eventName, Buffer.from(messages[i].serializeBinary())));
      }
      this.$logger.debug(`sending event ${eventName} to topic ${topicName}`, messages);
      return yield (() => {
        return (cb) => {
          this.$producer.send([{ topic: topicName, messages: values }], (err, data) => {
            if (err) {
              this.$logger.error(
                `error sending event ${eventName} to topic ${topicName}`, messages, ' ', err);
              cb(err);
            }
            this.$logger.info(` Sent event ${eventName} to topic ${topicName}`, messages);
            cb(null, data);
          });
        };
      })();
    } catch (err) {
      this.$logger.error(`error on sending event ${eventName} to topic ${topicName}`, message, err);
      throw err;
    }
  }

  /**
   * Returns a Kafka topic.
   *
   * @param  {string} topicName Topic name
   * @return {Topic} Kafka topic
   */
  * topic(topicName) {
    if (this.$topics[topicName]) {
      return this.$topics[topicName];
    }
    this.$topics[topicName] = new Topic(topicName, this);
    return this.$topics[topicName];
  }

  /**
   * End stops the connection to kafka.
   * The calling function is suspended until the producer and
   * all consumers from topics are disconnected.
   */
  * end() {
    const errors = [];
    try {
      yield (() => {
        return (cb) => {
          this.$client.close((err, data) => {
            cb(err, data);
          });
        };
      })();
    } catch (error) {
      errors.push(error);
    }
    const topicNames = _.keys(this.$topics);
    for (let i = 0; i < topicNames.length; i++) {
      const topic = this.$topics[topicNames[i]];
      if (topic.$consumer) {
        try {
          yield topic.$unsubscribe();
          yield (() => {
            return (cb) => {
              topic.$consumer.close((err, data) => {
                cb(err, data);
              });
            };
          })();
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

/**
 * Name of the event provider.
 */
module.exports.Name = 'kafka';

/**
 * Kafka events provider.
 */
module.exports.Kafka = Kafka;

/**
 * Lowest Kafka message offset for a specific topic.
 */
module.exports.EARLIEST_OFFSET = kafka.EARLIEST_OFFSET;

/**
 * Highest Kafka message offset for a specific topic.
 */
module.exports.LATEST_OFFSET = kafka.LATEST_OFFSET;

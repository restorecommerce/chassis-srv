'use strict';

const _ = require('lodash');
const isGeneratorFn = require('is-generator').fn;

/**
 * Topic handles listening and sending events to a specific topic.
 */
class Topic {
  constructor(topicName) {
    this.event = {};
    this.name = topicName;
  }

  /**
   * Listen to eventName events with listener.
   *
   * @param {string} eventName Identification name of the event.
   * @param {function} listener Event listener.
   */
  *on(eventName, listener) {
    if (_.isNil(this.event[eventName])) {
      this.event[eventName] = {
        listeners: [],
        messages: [],
      };
    }
    this.event[eventName].listeners.push(listener);
  }

  /**
   * Send message to listeners listening to eventName events.
   *
   * @param {string} eventName Identification name of the event.
   * @param {object} message Event message which is send to all listeners.
   */
  *emit(eventName, message) {
    let e = this.event[eventName];
    if (_.isNil(e)) {
      e = this.event[eventName] = {
        listeners: [],
        messages: [],
      };
    }
    e.messages.push(message);
    const context = {
      offset: e.messages.length,
      topic: this.name,
    };
    const listeners = e.listeners;
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      if (isGeneratorFn(listener)) {
        yield listener(message, context);
      } else {
        listener(message, context);
      }
    }
  }

  /**
   * Number of listener which are listening to eventName event.
   * @param {string} eventName Identification name of the event.
   * @return {number} Number of listeners.
   */
  *listenerCount(eventName) {
    const e = this.event[eventName];
    if (_.isNil(e)) {
      return 0;
    }
    return e.listeners.length;
  }

  /**
   * Is a listener listening to eventName event.
   * @param {string} eventName Identification name of the event.
   * @return {boolean} True if any listener is listening, otherwise false.
   */
  *hasListeners(eventName) {
    const e = this.event[eventName];
    if (_.isNil(e)) {
      return false;
    }
    return e.listeners > 0;
  }

  /**
   * Remove listener from eventName event.
   * @param {string} eventName Identification name of the event.
   * @param {function} listener Listener function.
   */
  *removeListener(eventName, listener) {
    const e = this.event[eventName];
    if (_.isNil(e)) {
      return;
    }
    const index = e.listeners.indexOf(listener);
    if (!index) {
      e.listeners.splice(index, 1);
    }
  }

  /**
   * Remove all listener listening to eventName event.
   * @param {string} eventName Identification name of the event.
   */
  *removeAllListeners(eventName) {
    _.unset(this.event, eventName);
  }
}

/**
 * Local is a events provider.
 * It uses in-process communication
 * and does not support sending events to other processes or hosts.
 */
class Local {
  constructor() {
    this.$topics = {};
  }

  /**
   * Return topicName topic.
   * @param {string} topicName The identification name of the topic.
   * @return {Topic}
   */
  *topic(topicName) {
    if (this.$topics[topicName]) {
      return this.$topics[topicName];
    }
    this.$topics[topicName] = new Topic(topicName);
    return this.$topics[topicName];
  }

  /**
   * Initialize the event provider.
   */
  *start() {
    if (_.isNil(this.$topics)) {
      this.$topics = {};
    }
  }

  /**
   * Stop the event provider and all event communication.
   */
  *end() {
    _.forIn(this.$topics, function* endTopics(topic, key) {
      yield topic.removeAllListeners();
    });
  }
}

module.exports.Name = 'local';
module.exports.Local = Local;

'use strict';

const _ = require('lodash');
const isGeneratorFn = require('is-generator').fn;

class Topic {
  constructor(topicName) {
    this.event = {};
    this.name = topicName;
  }

  *on(eventName, listener) {
    if (_.isNil(this.event[eventName])) {
      this.event[eventName] = {
        listeners: [],
        messages: [],
      };
    }
    this.event[eventName].listeners.push(listener);
  }

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

  *listenerCount(eventName) {
    const e = this.event[eventName];
    if (_.isNil(e)) {
      return 0;
    }
    return e.listeners.length;
  }

  *hasListeners(eventName) {
    const e = this.event[eventName];
    if (_.isNil(e)) {
      return false;
    }
    return e.listeners > 0;
  }

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

  *removeAllListeners(eventName) {
    _.unset(this.event, eventName);
  }
}

class Local {
  constructor() {
    this.$topics = {};
  }

  *topic(topicName) {
    if (this.$topics[topicName]) {
      return this.$topics[topicName];
    }
    this.$topics[topicName] = new Topic(topicName);
    return this.$topics[topicName];
  }

  *start() {
    if (_.isNil(this.$topics)) {
      this.$topics = {};
    }
  }

  *end() {
    _.forIn(this.$topics, function* endTopics(topic, key) {
      yield topic.removeAllListeners();
    });
  }
}

module.exports.Name = 'local';
module.exports.Local = Local;

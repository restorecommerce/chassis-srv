'use strict';

const _ = require('lodash');
const isGeneratorFn = require('is-generator').fn;

function Topic(topicName) {
  this.event = {};
}

Topic.prototype.on = function* on(eventName, listener) {
  if (_.isNil(this.event[eventName])) {
    this.event[eventName] = {
      listeners: [],
      messages: [],
    };
  }
  this.event[eventName].listeners.push(listener);
};

Topic.prototype.emit = function* emit(eventName, message) {
  const e = this.event[eventName];
  if (_.isNil(e)) {
    return;
  }
  e.messages.push(message);
  const listeners = e.listeners;
  for (let i = 0; i < listeners.length; i++) {
    const listener = listeners[i];
    if (isGeneratorFn(listener)) {
      yield listener(message);
    } else {
      listener(message);
    }
  }
};

Topic.prototype.listenerCount = function* listenerCount(eventName) {
  const e = this.event[eventName];
  if (_.isNil(e)) {
    return 0;
  }
  return e.listeners.length;
};

Topic.prototype.hasListeners = function* hasListeners(eventName) {
  return _.isNil(this.event[eventName]) === false;
};

Topic.prototype.removeListener = function* removeListener(eventName, listener) {
  const e = this.event[eventName];
  if (_.isNil(e)) {
    return;
  }
  const index = e.listeners.indexOf(listener);
  if (!index) {
    e.listeners.splice(index, 1);
  }
};

Topic.prototype.removeAllListeners = function* removeAllListeners(eventName) {
  _.unset(this.event, eventName);
};

function Local() {
  this.$topic = {};
}

Local.prototype.topic = function* topic(topicName) {
  if (this.$topics[topicName]) {
    return this.$topics[topicName];
  }
  this.$topics[topicName] = new Topic(topicName);
  return this.$topics[topicName];
};

module.exports = Local;
'use strict';

var EventEmitter = require('co-emitter');
//const EventEmitter = require('events');

function Topic(name) {
  var self = this;
  self.topic = name;
  self._emitter = new EventEmitter();

  this._send = function*() {
    throw new Error('Topic._send was not set to a provider send function');
  };
  this._receive = function*(eventName, message) {
    yield self._emitter.emit(eventName, message);
  }

  this.on = function(eventName, listener) {
    self._emitter.on(eventName, listener);
  }
  this.emit = function*(eventName, message) {
    yield this._send(eventName, message);
  }
}

function Events(provider) {
  var self = this;
  self._provider = provider;

  this.subscribe = function*(name) {
    let topic = new Topic(name);
    topic._send = yield provider.subscribe(name, topic._receive);
    return topic;
  }
}

module.exports.Events = Events;
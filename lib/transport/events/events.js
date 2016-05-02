'use strict';

var EventEmitter = require('co-emitter');

/**
 * @constructor
 * @private
 * @param {string} name Topic name
 */
function Topic(name) {
  this.name = name;
  this._emitter = new EventEmitter();
}

Topic.prototype._send = function*() {
  throw new Error('Topic._send was not set to a provider send function');
};

Topic.prototype._receive = function*(eventName, message) {
  yield this._emitter.emit(eventName, message);
};

Topic.prototype.on = function(eventName, listener) {
  this._emitter.on(eventName, listener);
};

Topic.prototype.emit = function*(eventName, message) {
  yield this._send(eventName, message);
};


/**
 * Events provides abstract event messaging.
 * @constructor
 * @param {Object} provider [description]
 */
function Events(provider) {
  this._provider = provider;
}

Events.prototype.subscribe = function*(name) {
  let topic = new Topic(name);
  topic._send = yield this._provider.subscribe(topic);
  return topic;
}

module.exports.Events = Events;

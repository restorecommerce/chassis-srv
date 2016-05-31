'use strict';


/**
 * Events provides abstract event messaging.
 * @constructor
 * @param {Object} provider [description]
 */
function Events(provider) {
  this.provider = provider;
}

/**
 * Returns a topic.
 * @param  {string} name Topic name
 * @return {Topic}      Topic
 */
Events.prototype.topic = function*(name) {
  return yield this.provider.topic(name);
}

module.exports.Events = Events;

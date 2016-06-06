'use strict';

const _ = require('lodash');

/**
 * Events provides abstract event messaging.
 *
 * @constructor
 * @param {Object} provider [description]
 */
function Events(provider) {
  if (_.isNil(provider)) {
    throw new Error('provider does not exist');
  }
  this.provider = provider;
}

/**
 * Returns a topic.
 *
 * @param  {string} name Topic name
 * @return {Topic}      Topic
 */
Events.prototype.topic = function* topic(name) {
  return yield this.provider.topic(name);
};

module.exports.Events = Events;

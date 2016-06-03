'use strict';

var util = require('util');
var co = require('co');
var fixedPublisher = require('./fixedPublisher').fixedPublisher;

/**
 * StaticPublisher yields a set of static endpoints as produced by the passed factory.
 *
 * @param  {Array.<string>} instances Typically host:port strings which can be converted into endpoints.
 * @param  {generator} factory   Converts instance strings into endpoints.
 * @param  {Object} logger
 */
function* staticPublisher(instances, factory, logger) {
  let endpoints = co(function*() {
    let endpoints = [];
    for (let i = 0; i < instances.length; i++) {
      let instance = instances[i];
      try {
        let e = factory(instance);
        endpoints.push(e);
      } catch (err) {
        logger.log('ERROR', 'factory', instance, 'err', err);
      }
    }
    if (endpoints.length === 0) {
      throw new Error('no endpoints');
    }
    return yield endpoints;
  }).catch(function(err) {
    throw err;
  });
  logger.log('DEBUG',
    util.format('staticPublisher provides %d endpoint(s) from %d instance(s)',
      endpoints.length, instances.length), instances);
  yield * fixedPublisher(endpoints);
}

module.exports.staticPublisher = staticPublisher;

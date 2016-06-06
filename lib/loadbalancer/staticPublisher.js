'use strict';

const util = require('util');
const co = require('co');
const fixedPublisher = require('./fixedPublisher').fixedPublisher;

/**
 * StaticPublisher yields a set of static endpoints as produced by the passed factory.
 *
 * @param  {Array.<string>} instances Typically host:port strings
 * which the factory converts into endpoints.
 * @param  {generator} factory   Converts instance strings into endpoints.
 * @param  {Object} logger
 */
function* staticPublisher(instances, factory, logger) {
  const endpoints = co(function* send() {
    const epoints = [];
    for (let i = 0; i < instances.length; i++) {
      const instance = instances[i];
      try {
        const e = factory(instance);
        epoints.push(e);
      } catch (err) {
        logger.error('factory', instance, 'err', err);
      }
    }
    if (epoints.length === 0) {
      throw new Error('no endpoints');
    }
    return yield epoints;
  }).catch((err) => {
    throw err;
  });
  logger.debug(
    util.format('staticPublisher provides %d endpoint(s) from %d instance(s)',
      endpoints.length, instances.length), instances);
  yield* fixedPublisher(endpoints);
}

module.exports.staticPublisher = staticPublisher;

'use strict';

/*  eslint-disable require-yield */

import * as co from "co";
const fixedPublisher = require('./fixedPublisher').fixedPublisher;

/**
 * StaticPublisher yields a set of static endpoints as produced by the passed factory.
 *
 * @param  {Array.<string>} instances Typically host:port strings
 * which the factory converts into endpoints.
 * @param  {generator} factory   Converts instance strings into endpoints.
 * @param  {Object} logger
 */
function* staticPublisher(instances: string[], factory: any,
                            logger: any): any {
  const endpoints = co(function* send(): any {
    const epoints = [];
    for (let i = 0; i < instances.length; i += 1) {
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
    logger.debug(`staticPublisher provides ${epoints.length} endpoint(s)
      from ${instances.length} instance(s)`, instances);
    return yield epoints;
  }).catch((err) => {
    throw err;
  });
  yield* fixedPublisher(endpoints);
}
export {staticPublisher as staticPublisher};
// module.exports.staticPublisher = staticPublisher;

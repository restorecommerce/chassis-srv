'use strict';

/*  eslint-disable require-yield */

import * as co from "co";
// const co = require('co');

/**
 * fixedPublisher yields a set of fixed endpoints provided to it.
 *
 * @param  {array.generator} endpoints   Fixed endpoints.
 */
export function* fixedPublisher(endpoints: any): any {
  while (endpoints !== undefined) {
    yield co(function* send(): any {
      return endpoints;
    });
  }
}

// module.exports.fixedPublisher = fixedPublisher;

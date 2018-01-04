'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/*  eslint-disable require-yield */
const co = require("co");
// const co = require('co');
/**
 * fixedPublisher yields a set of fixed endpoints provided to it.
 *
 * @param  {array.generator} endpoints   Fixed endpoints.
 */
function* fixedPublisher(endpoints) {
    while (endpoints !== undefined) {
        yield co(function* send() {
            return endpoints;
        });
    }
}
exports.fixedPublisher = fixedPublisher;

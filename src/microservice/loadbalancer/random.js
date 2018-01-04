'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const Random = require('random-js');
const co = require("co");
// const co = require('co');
function* send(publisher, rnd) {
    const p = publisher.next();
    if (p.done) {
        throw new Error('publisher is done');
    }
    const endpoints = yield p.value;
    if (!endpoints || endpoints.length === 0) {
        throw new Error('publisher did not return endpoints');
    }
    const m = Math.max(endpoints.length - 1, 0);
    return endpoints[rnd.integer(0, m)];
}
/**
 * random is a simple load balancer that returns a randomly selected endpoint;
 *
 * @param  {generator} publisher An endpoint publisher.
 * @param  {number} seed      Seed for random generator.
 */
function* random(publisher, seed) {
    if (!publisher) {
        throw new Error('missing publisher');
    }
    const rnd = new Random(Random.engines.mt19937().seed(seed));
    while (publisher !== undefined) {
        yield co(send(publisher, rnd)).catch((err) => {
            throw err;
        });
    }
}
exports.random = random;

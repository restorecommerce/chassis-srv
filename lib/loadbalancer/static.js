'use strict';

module.exports.StaticPublisher = function*(instances, factory, logger) {
  let endpoints = [];
  for (let instance of instances) {
    try {
      let e = yield factory(instance);
      endpoints.push(e);
    } catch (err) {
      logger.log('instance', instance, 'err', err);
    }
  }
  return {
    $endpoints: endpoints,
    endpoints: function() {
      return this.$endpoints;
    }
  };
}

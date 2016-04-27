'use strict';

module.exports.StaticPublisher = function(instances, factory) {
  let endpoints = [];
  for (let instance of instances) {
    let e = factory(instance);
    endpoints.push(e);
  }
  this.endpoints = function(){
    return endpoints;
  };
}

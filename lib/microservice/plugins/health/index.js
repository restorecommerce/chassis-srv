'use strict';

const _ = require('lodash');
const errors = require('../../errors');

const ServingStatus = {
  UNKNOWN: 0,
  SERVING: 1,
  NOT_SERVING: 2,
};

class Health {
  constructor(server, config) {
    this.healh = {
      status: ServingStatus.UNKNOWN,
    };
    this.service = {};
    const service = this.service;
    const healh = this.healh;
    _.forEach(config.services, (serviceCfg, serviceName) => {
      service[serviceName] = {
        bound: false,
        transport: {},
      };
    });
    server.on('bound', (serviceName) => {
      service[serviceName].bound = true;
      healh.status = ServingStatus.NOT_SERVING;
    });
    server.on('serving', (transports) => {
      healh.status = ServingStatus.SERVING;
      _.forEach(transports, (transport, transportName) => {
        _.forEach(service, (srv, serviceName) => {
          service[serviceName].transport[transportName] = ServingStatus.SERVING;
        });
      });
    });
    server.on('stopped', (transports) => {
      healh.status = ServingStatus.NOT_SERVING;
      _.forEach(transports, (transport, transportName) => {
        _.forEach(service, (srv, serviceName) => {
          service[serviceName].transport[transportName] = ServingStatus.NOT_SERVING;
        });
      });
    });
  }
  *check(call, context) {
    const request = call.request;
    if (_.isNil(request.service) || _.size(request.service) === 0) {
      return {
        status: this.healh.status,
      };
    }
    const service = this.service[request.service];
    if (_.isNil(service)) {
      throw new errors.NotFound(`service ${request.service} does not exist`);
    }
    if (!service.bound) {
      return {
        status: ServingStatus.NOT_SERVING,
      };
    }
    let status = ServingStatus.UNKNOWN;
    // If one transports serves the service, set it to SERVING
    _.forEach(service.transport, (transportStatus) => {
      if (transportStatus === ServingStatus.SERVING) {
        status = transportStatus;
      }
    });
    return {
      status,
    };
  }
}

module.exports.Health = Health;

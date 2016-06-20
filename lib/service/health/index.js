'use strict';

const _ = require('lodash');
const chassis = require('../../../');

const ServingStatus = {
  UNKNOWN: 0,
  SERVING: 1,
  NOT_SERVING: 2,
};

class Health {
  constructor(server, config) {
    /* eslint consistent-this: ["error", "that"]*/
    const that = this;
    this.server = {
      status: ServingStatus.UNKNOWN,
    };
    this.service = {};
    _.forEach(config.services, (serviceCfg, serviceName) => {
      that.service[serviceName] = {
        bound: false,
        transport: {},
      };
    });
    server.on('bound', (serviceName) => {
      that.service[serviceName].bound = true;
      that.server.status = ServingStatus.NOT_SERVING;
    });
    server.on('serving', (transports) => {
      that.server.status = ServingStatus.SERVING;
      _.forEach(transports, (transport, transportName) => {
        _.forEach(that.service, (service, serviceName) => {
          that.service[serviceName].transport[transportName] = ServingStatus.SERVING;
        });
      });
    });
    server.on('stopped', (transports) => {
      that.server.status = ServingStatus.NOT_SERVING;
      _.forEach(transports, (transport, transportName) => {
        _.forEach(that.service, (service, serviceName) => {
          that.service[serviceName].transport[transportName] = ServingStatus.NOT_SERVING;
        });
      });
    });
  }
  *check(call, context) {
    const request = call.request;
    if (_.isNil(request.service) || _.size(request.service) === 0) {
      return {
        status: this.server.status,
      };
    }
    const service = this.service[request.service];
    if (_.isNil(service)) {
      throw new chassis.errors.NotFound(`service ${request.service} does not exist`);
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

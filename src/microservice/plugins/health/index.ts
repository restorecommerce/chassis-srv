'use strict';

/*  eslint-disable require-yield */

import * as _ from "lodash";
const errors = require('../../errors');
import {Server} from "../../server";

const ServingStatus = {
  UNKNOWN: 0,
  SERVING: 1,
  NOT_SERVING: 2,
};

/**
 * Health service provides the endpoint check.
 * It returns the status of the server or it's services.
 * @class
 */
export class Health {
  health: any;
  service: any;
  /**
   * @constructor
   * @param {Server} server The server this service and others are bound to.
   * @param {object} config The server config.
   */
  constructor(server: Server, config: any) {
    this.health = {
      status: ServingStatus.UNKNOWN,
    };
    this.service = {};
    const service = this.service;
    const health = this.health;
    _.forEach(config.services, (serviceCfg, serviceName) => {
      service[serviceName] = {
        bound: false,
        transport: {},
      };
    });
    server.on('bound', (serviceName) => {
      service[serviceName].bound = true;
      health.status = ServingStatus.NOT_SERVING;
    });
    server.on('serving', (transports) => {
      health.status = ServingStatus.SERVING;
      _.forEach(transports, (transport, transportName) => {
        _.forEach(service, (srv, serviceName) => {
          service[serviceName].transport[transportName] = ServingStatus.SERVING;
        });
      });
    });
    server.on('stopped', (transports) => {
      health.status = ServingStatus.NOT_SERVING;
      _.forEach(transports, (transport, transportName) => {
        _.forEach(service, (srv, serviceName) => {
          service[serviceName].transport[transportName] = ServingStatus.NOT_SERVING;
        });
      });
    });
  }

  /**
   * Endpoint check.
   * @return Serving status.
   */
  * check(call: any, context: any): any {
    const request = call.request;
    if (_.isNil(request.service) || _.size(request.service) === 0) {
      return {
        status: this.health.status,
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

// module.exports.Health = Health;

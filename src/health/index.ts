import { CommandInterface } from '../command-interface';
import { ServiceConfig } from '@restorecommerce/service-config';
import { GrpcClient } from '@restorecommerce/grpc-client';
import { Logger } from 'winston';

const ServingStatus = {
  UNKNOWN: 'UNKNOWN',
  SERVING: 'SERVING',
  NOT_SERVING: 'NOT_SERVING',
};

export interface HealthOptions {
  cfg?: ServiceConfig;
  dependencies?: string[];
  logger?: Logger;
  readiness?: () => Promise<boolean>;
}

export class Health {

  readonly ci: CommandInterface;
  readonly opts?: HealthOptions;
  readonly endpoints?: { [key: string]: any };

  constructor(ci: CommandInterface, opts?: HealthOptions) {
    this.ci = ci;
    this.opts = opts;

    if (this.opts) {
      if (this.opts.dependencies && this.opts.cfg && this.opts.logger) {
        this.endpoints = {};
        const clientCfg = this.opts.cfg.get('client');
        for (const dependency of this.opts.dependencies) {
          if (!(dependency in clientCfg)) {
            throw new Error('Dependency "' + dependency + '" not provided in client config!');
          }

          let dependencyCfg = {
            packageName: 'grpc.health.v1',
            serviceName: 'Health'
          };
          const serviceConfig = {
            ...clientCfg[dependency],
            proto: {
              ...clientCfg[dependency]['proto'],
              protoPath: 'grpc/health/v1/health.proto',
              services: {
                ['dependency']: dependencyCfg
              }
            }
          };

          const client = new GrpcClient(serviceConfig, this.opts.logger);
          this.endpoints[dependency] = client.dependency;
        }
      }
    }
  }

  async watch(call, context?: any): Promise<any> {
    // TODO
    // IGNORED
  }

  async check(call, context?: any): Promise<any> {
    const service = (call.request && call.request.service) || 'liveness';

    if (service === 'readiness') {
      if (this.ci.redisClient && !this.ci.redisClient.ping()) {
        return { status: ServingStatus.NOT_SERVING };
      }

      if (this.opts) {
        if (this.endpoints) {
          for (const service of Object.keys(this.endpoints)) {
            const response = await this.endpoints[service].check({});
            if ('error' in response && response.error) {
              this.opts.logger.warn('Readiness error from ' + service + ':', response);
              return { status: ServingStatus.NOT_SERVING };
            }
          }
        }

        try {
          if (this.opts.readiness && !await this.opts.readiness()) {
            return { status: ServingStatus.NOT_SERVING };
          }
        } catch (e) {
          return { status: ServingStatus.NOT_SERVING };
        }
      }
    }

    const response = await this.ci.check({});

    if (!('status' in response)) {
      return { status: ServingStatus.UNKNOWN };
    }

    return response;
  }

}

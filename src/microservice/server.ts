import { makeEndpoint } from './endpoint';
import { createLogger } from '@restorecommerce/logger';
import { Logger } from 'winston';
import * as _ from 'lodash';
import { EventEmitter } from 'events';

const transports: any = {};

/**
 * register transport provider
 *
 * @param  {string} name     transport provider identifier
 * @param  {constructor} provider transport provider constructor function
 */
export const registerTransport = (name: string, provider: any): void => {
  transports[name] = provider;
};

// register included providers
const grpc = require('./transport/provider/grpc');
registerTransport('grpc', grpc.Server);

/**
 * Initializes all configured transports.
 * @param  {object} config Configuration
 * @param  {object} logger
 * @return {object} Transport
 */
const setupTransport = (config: any, logger: Logger): any => {
  const transport = {};
  logger.debug('available transport providers',
    Object.keys(transports).join(','));
  for (let i = 0; i < config.length; i += 1) {
    const transportCfg = config[i];
    const providerName = transportCfg.provider;
    if (_.isNil(providerName)) {
      throw new Error('transport configuration without a provider');
    }
    const transportName = transportCfg.name;
    if (_.isNil(providerName)) {
      throw new Error('transport configuration without a name');
    }
    const TransportProvider = transports[providerName];
    if (_.isNil(TransportProvider)) {
      throw new Error(`transport provider ${providerName} does not exist`);
    }
    const provider = new TransportProvider(transportCfg, logger);
    transport[transportName] = provider;
  }
  logger.debug('using transports', Object.keys(transport).join(','));
  return transport;
};

/**
 * Server is a microservice server chassis.
 * It enables business logic to be accessed over transports and listen to events.
 * Default event providers: 'kafka'
 * Default transports: 'grpc'
 * @class
 */
export class Server extends EventEmitter {

  config: any;
  logger: Logger;
  middleware: any;
  transport: any;

  /**
   * @constructor
   * @param {object} config Server config.
   * @param {Logger} logger
   */
  constructor(config?: any, logger?: Logger, middleware?: any) {
    super();
    if (_.isNil(config)) {
      throw new Error('mising argument config');
    }
    this.config = config;

    // logger
    if (_.isNil(logger)) {
      if (_.isNil(this.config.logger)) {
        this.logger = createLogger();
      } else {
        const loggerCfg = this.config.logger;
        loggerCfg.esTransformer = (msg) => {
          msg.fields = JSON.stringify(msg.fields);
          return msg;
        };
        this.logger = createLogger(loggerCfg);
      }
    } else {
      this.logger = logger;
    }

    // services
    this.logger.debug('setting up service endpoints');
    if (!this.config.services || !this.config.transports) {
      if (this.config.events) {
        if (this.config.transports) {
          this.logger.warn('missing endpoints configuration');
        }
        if (this.config.services) {
          this.logger.warn('missing services configuration');
        }
        return;
      }
      if (this.config.transports && this.config.transports.length > 0) {
        throw new Error('missing services configuration');
      }
      if (this.config.services) {
        throw new Error('missing transports configuration');
      }
      throw new Error('missing server configuration');
    }

    // transports
    this.logger.debug('setting up transports');
    try {
      this.transport = setupTransport(this.config.transports, this.logger);
    } catch (error) {
      this.logger.error('setupTransports', error);
      throw error;
    }

    /**
     * Requests will traverse the middlewares in the order they're declared.
     * That is, the first middleware is called first.
     *
     * @type {Array.<generator>}
     */
    if (!middleware) {
      this.middleware = [];
    } else {
      this.middleware = middleware;
    }
  }

  /**
   * bind connects the service to configured transports.
   *
   * @param  {string} name Service name.
   * @param  {object} service A business logic service.
   */
  async bind(name: string, service: any): Promise<any> {
    if (_.isNil(name)) {
      throw new Error('missing argument name');
    }
    if (!_.isString(name)) {
      throw new Error('argument name is not of type string');
    }
    if (_.isNil(service)) {
      throw new Error('missing argument service');
    }
    const serviceCfg = this.config.services[name];
    if (!serviceCfg) {
      throw new Error(`configuration for ${name} does not exist`);
    }

    const transportNames = Object.keys(this.transport);

    // endpoints
    const logger = this.logger;
    const endpoints = {};
    Object.keys(serviceCfg).forEach((endpointName) => {
      const endpointCfg = serviceCfg[endpointName];
      if (_.isNil(endpointCfg)) {
        logger.error(`configuration for service
        ${name} endpoint ${endpointName} does not exist`);
        return;
      }
      for (let i = 0; i < endpointCfg.transport.length; i += 1) {
        const transportName = endpointCfg.transport[i];
        if (!endpoints[transportName]) {
          endpoints[transportName] = [];
        }
        if (!_.includes(transportNames, transportName)) {
          logger.warn(`transport ${transportName} does not exist`, {
            service: name,
            method: endpointName,
          });
          continue;
        }
        endpoints[transportName].push(endpointName);
      }
    });
    logger.debug('endpoints', endpoints);

    logger.debug('binding endpoints to transports');
    const middleware = this.middleware;
    const transport = this.transport;
    const cfg = this.config;
    for (let i = 0; i < transportNames.length; i += 1) {
      const transportName = transportNames[i];
      const provider = transport[transportName];
      const methodNames = endpoints[transportName];
      if (!methodNames) {
        logger.verbose(`transport ${transportName} does not have any endpoints configured`);
        continue;
      }
      const binding = {};
      for (let j = 0; j < methodNames.length; j += 1) {
        const methodName = methodNames[j];
        if (!_.isFunction(service[methodName])) {
          logger.warn(`endpoint ${methodName} does not have matching service method`);
          continue;
        }
        const methodCfg = serviceCfg[methodName];
        if (_.isNil(methodCfg)) {
          logger.error(`endpoint ${name}.${methodName} does not have configuration`);
          continue;
        }
        if (!_.includes(methodCfg.transport, transportName)) {
          logger.error(`endpoint ${name}.${methodName}
        is not configured for transport ${transportName}, skipping endpoint binding`);
          continue;
        }
        binding[methodName] = makeEndpoint(middleware,
          service, transportName, methodName, logger, cfg);
        logger.debug(`endpoint ${methodName} bound to transport ${transportName}`);
      }
      if (_.size(_.functions(binding)) === 0) {
        logger.verbose(`service ${name} has no endpoints configured
          for transport ${transportName}, skipping service binding`);
        continue;
      }
      await provider.bind(name, binding);
      this.emit('bound', name, binding, provider);
    }
  }

  /**
   * start launches the server by starting transports and listening to events.
   */
  async start(): Promise<any> {
    const transportNames = Object.keys(this.transport);
    for (let i = 0; i < transportNames.length; i += 1) {
      const name = transportNames[i];
      const provider = this.transport[name];
      await provider.start();
      this.logger.info(`transport ${name} started`);
    }
    this.emit('serving', this.transport);
  }

  /**
   * Shuts down all transport provider servers.
   */
  async stop(): Promise<any> {
    const transportNames = _.keys(this.transport);
    for (let i = 0; i < transportNames.length; i += 1) {
      const name = transportNames[i];
      if (this.transport[name].end) {
        await this.transport[name].end();
      }
    }
    this.emit('stopped', this.transport);
  }
}

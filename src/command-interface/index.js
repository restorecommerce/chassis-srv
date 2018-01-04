'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const mixinEmitter = require("co-emitter");
const co = require("co");
const errors = require("./../microservice/errors");
const database = require("./../database");
const ServingStatus = {
    UNKNOWN: 0,
    SERVING: 1,
    NOT_SERVING: 2,
};
class CommandInterface {
    constructor(server, events, config, logger) {
        if (!_.has(config, 'server.services')) {
            throw new Error('missing config server.services');
        }
        this.hasDatabase = _.has(config, 'database');
        if (this.hasDatabase === false) {
            logger.warn('missing database config, disabling endpoints', {
                disabledEndpoints: ['reset', 'restore'],
            });
            this.reset = undefined;
            this.restore = undefined;
        }
        mixinEmitter(this);
        this.logger = logger;
        this.events = events;
        this.config = {
            workers: 4,
            workerConfig: config,
        };
        // Health
        this.health = {
            status: ServingStatus.UNKNOWN,
        };
        this.service = {};
        const service = this.service;
        const health = this.health;
        _.forEach(config.server.services, (serviceCfg, serviceName) => {
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
     * Reconfigure
     * @param call
     * @param context
     */
    reconfigure(call, context) {
        this.logger.info('reconfigure is not implemented');
        throw new errors.Unimplemented('reconfigure is not implemented');
    }
    /**
     * used to restore the system by re-reading the Kafka messages
     * @param call list of Kafka topics to be restored
     * @param context
     */
    restore(call, context) {
        return __awaiter(this, void 0, void 0, function* () {
            let topics;
            if (call && call.request) {
                topics = call.request.topics;
            }
            else {
                topics = call.topics;
            }
            // Check if all topics specified in the request are registered
            for (let i = 0; i < topics.length; i += 1) {
                const topic = topics[i];
                if (_.isNil(this.events[topic.topic])) {
                    throw new errors.NotFound(`topic ${topic.topic} is not registered for the restore process`);
                }
            }
            const logger = this.logger;
            // Start the restore process
            logger.warn('restoring data');
            for (let i = 0; i < topics.length; i += 1) {
                const topic = topics[i];
                const restoreTopic = this.events[topic.topic];
                const eventNames = _.keys(restoreTopic.events);
                const targetOffset = (yield restoreTopic.topic.$offset(-1)) - 1;
                const ignoreOffsets = topic.ignore_offset;
                this.logger.debug(`topic ${topic.topic} has current offset ${targetOffset}`);
                for (let j = 0; j < eventNames.length; j += 1) {
                    const eventName = eventNames[j];
                    const listener = restoreTopic.events[eventName];
                    const listenUntil = function listenUntil(message, ctx, config, eventNameRet) {
                        return __awaiter(this, void 0, void 0, function* () {
                            logger.debug(`received message ${ctx.offset}/${targetOffset}`, ctx);
                            if (_.includes(ignoreOffsets, ctx.offset)) {
                                return;
                            }
                            try {
                                yield listener(message, ctx, config, eventNameRet);
                            }
                            catch (e) {
                                logger.debug('Exception caught :', e.message);
                            }
                            if (ctx.offset >= targetOffset) {
                                for (let k = 0; k < eventNames.length; k += 1) {
                                    const eventToRemove = eventNames[k];
                                    logger.debug('Number of listeners before removing :', restoreTopic.topic.listenerCount(eventToRemove));
                                    yield restoreTopic.topic.removeAllListeners(eventToRemove);
                                    logger.debug('Number of listeners after removing :', restoreTopic.topic.listenerCount(eventToRemove));
                                }
                            }
                        });
                    };
                    logger.debug(`listening to topic ${topic.topic} event ${eventName}
          until offset ${targetOffset} while ignoring offset`, ignoreOffsets);
                    yield restoreTopic.topic.on(eventName, listenUntil);
                    logger.debug(`reseting commit offset of topic ${topic.topic} to ${topic.offset}`);
                    restoreTopic.topic.$reset(eventName, topic.offset);
                    logger.debug(`reset done for topic ${topic.topic} to commit offset ${topic.offset}`);
                }
            }
            // wait until all committed offsets reached targetOffset
            logger.debug('waiting until all messages are processed');
            logger.info('restore process done');
            return {};
        });
    }
    /**
     * used to reset the system
     * @param call
     * @param context
     */
    reset(call, context) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.info('reset process started');
            if (this.health.status !== ServingStatus.NOT_SERVING) {
                this.logger.warn('reset process starting while server is serving');
            }
            yield this.emit('reset.start');
            const dbCfgs = this.config.workerConfig.database;
            const dbCfgNames = _.keys(dbCfgs);
            for (let i = 0; i < dbCfgNames.length; i += 1) {
                const dbCfgName = dbCfgNames[i];
                const dbCfg = dbCfgs[dbCfgName];
                const db = yield co(database.get(dbCfg, this.logger));
                switch (dbCfg.provider) {
                    case 'arango':
                        yield co(db.truncate());
                        this.logger.info(`arangodb ${dbCfg.database} truncated`);
                        break;
                    default:
                        this.logger.error(`unsupported database provider ${dbCfg.provider} in database config ${dbCfgName}`);
                        break;
                }
            }
            yield this.emit('reset.end');
            this.logger.info('reset process ended');
            return {};
        });
    }
    /**
     * used to check the service status
     * @param call list of service names
     * @param context
     */
    check(call, context) {
        let serviceName;
        if (call && call.request) {
            serviceName = call.request.service;
        }
        else {
            serviceName = call.service;
        }
        if (_.isNil(serviceName) || _.size(serviceName) === 0) {
            return {
                status: this.health.status,
            };
        }
        const service = this.service[serviceName];
        if (_.isNil(service)) {
            this.logger.info('service ' + serviceName + ' does not exist');
            throw new errors.NotFound(`service ${serviceName} does not exist`);
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
    /**
     * get the npm package and node version of system
     * @param call
     * @param context
     */
    version(call, context) {
        this.logger.info('process version');
        return {
            nodejs: process.version,
            version: process.env.npm_package_version,
        };
    }
}
exports.CommandInterface = CommandInterface;

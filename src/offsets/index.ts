'use strict';
import * as _ from 'lodash';
import * as Logger from '@restorecommerce/logger';
import { Events, Topic } from '@restorecommerce/kafka-client';
import * as redis from 'redis';

/**
 * Stores the offsets of the provided topics to redis periodically
 */
export class OffsetStore {
  logger: Logger;
  config: any;
  kafkaEvents: Events;
  redisClient: any;
  topics: any;

  constructor(events: Events, config: any, logger) {
    if (!logger) {
      throw new Error('Missing logger config or object');
    }
    if (_.isNil(events)) {
      if (logger.error) {
        logger.error('No Kafka client was provided, offsets will not be stored to redis');
        return;
      }
    }

    this.config = config;
    this.logger = logger;

    if (!(this.config.get('events'))
      || !(this.config.get('events:kafka'))
      || !(this.config.get('events:kafka:topics'))) {
      throw new Error('Kafka events configuration was not provided.');
    }

    this.kafkaEvents = events;
    if (this.config.get('redis')) {
      const redisConfig = this.config.get('redis');
      if (this.config.get('redis:db-indexes:db-offsetStore')) {
        redisConfig.db = this.config.get('redis:db-indexes:db-offsetStore');
      }
      this.redisClient = redis.createClient(redisConfig);
    }
    this.topics = {};
    setTimeout(this.updateTopicOffsets.bind(this), 5000);
  }

  /**
  * updates the topic offset in redis periodically
  *
  */
  updateTopicOffsets(): any {
    // Iterate through the topics and updateOffsets periodically for each topic
    // events.topic(TopicName) - gives the topic object
    const kafkaCfg = this.config.get('events:kafka');
    const topicTypes = _.keys(kafkaCfg.topics);
    for (let topicType of topicTypes) {
      const topicName = kafkaCfg.topics[topicType].topic;
      this.topics[topicType] = this.kafkaEvents.topic(topicName);
      setInterval(this.storeOffset.bind(this),
        this.config.get('redis:offsetStoreInterval'), this.topics[topicType], topicName);
    }
  }

  /**
   * stores the offset to redis
   * @param  {object} topic Topic object
   * @param  {object} redisClient
   * @return {object}
   */
  async storeOffset(topic: Topic, topicName: string): Promise<any> {
    // get the latest offset here each time and store it.
    const offsetValue = await topic.$offset(-1);
    const redisKey = this.config.get('events:kafka:groupId') + ':' + topicName;
    this.redisClient.set(redisKey, offsetValue, this.redisClient.print);
  }

  /**
   * get the offset value for the topic from redis
   * @param  {string} topic Topic name
   * @return {object}
   */
  async getOffset(topicName: string): Promise<any> {
    const redisKey = this.config.get('events:kafka:groupId') + ':' + topicName;
    const offsetValue = await new Promise((resolve, reject) => {
      this.redisClient.get(redisKey, (err, response) => {
        if (err) {
          reject(err);
        }
        resolve(response);
      });
    });
    this.logger.info('The offset value retreived from redis for topic is :',
      topicName, offsetValue);
    return offsetValue;
  }

  /**
   * stops the redis client
   * @param  {object} topic Topic object
   * @param  {object} redisClient
   * @return {object}
   */
  async stop(): Promise<any> {
    if (this.redisClient) {
      await this.redisClient.quit();
    }
  }
}
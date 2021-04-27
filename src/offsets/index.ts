import * as _ from 'lodash';
import { Events, Topic } from '@restorecommerce/kafka-client';
import * as Redis from 'ioredis';
import { Logger } from 'winston';

/**
 * Stores the offsets of the provided topics to redis periodically
 */
export class OffsetStore {
  logger: Logger;
  config: any;
  kafkaEvents: Events;
  redisClient: Redis;
  topics: any;
  timerID: any;

  constructor(events: Events, config: any, logger: Logger) {
    if (!logger) {
      throw new Error('Missing logger config or object');
    }
    if (_.isNil(events)) {
      logger.error('No Kafka client was provided, offsets will not be stored to redis');
      return;
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
      if (_.has(redisConfig, 'db-indexes.db-offsetStore')) {
        redisConfig.db = _.get(redisConfig, 'db-indexes.db-offsetStore');
      }
      this.redisClient = new Redis(redisConfig);
    }
    this.topics = {};
    this.timerID = [];
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
    for (let i = 0; i < topicTypes.length; i += 1) {
      const topicType = topicTypes[i];
      const topicName = kafkaCfg.topics[topicType].topic;

      this.kafkaEvents.topic(topicName).then(topic => {
        this.topics[topicType] = topic;
        this.timerID[i] = setInterval(this.storeOffset.bind(this),
          this.config.get('redis:offsetStoreInterval'), this.topics[topicType], topicName);
      });
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
    const redisKey = this.config.get('events:kafka:clientId') + ':' + topicName;
    this.redisClient.set(redisKey, offsetValue);
  }

  /**
   * get the offset value for the topic from redis
   * @param  {string} topic Topic name
   * @return {object}
   */
  async getOffset(topicName: string): Promise<number> {
    const redisKey = this.config.get('events:kafka:clientId') + ':' + topicName;
    const offsetValue = await new Promise<number>((resolve, reject) => {
      this.redisClient.get(redisKey, (err, response) => {
        if (err) {
          reject(err);
        }
        resolve(response);
      });
    });
    this.logger.info('The offset value retreived from redis for topic is:',
      { topicName, offsetValue });
    return offsetValue;
  }

  /**
   * stops the redis client
   * @param  {object} topic Topic object
   * @param  {object} redisClient
   * @return {object}
   */
  async stop(): Promise<any> {
    for (let i = 0; i < this.timerID.length; i += 1) {
      clearInterval(this.timerID[i]);
    }
    if (this.redisClient) {
      await this.redisClient.quit();
    }
  }
}

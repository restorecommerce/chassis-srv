import { Logger as RestoreLogger, createLogger, RestoreLoggerOptions } from '@restorecommerce/logger';

// TODO Remove

class WinstonLoggerClass {
  constructor(opts?: RestoreLoggerOptions) {
    const logger = createLogger(opts);
    Object.setPrototypeOf(this, logger);
  }
}

const RCLogger = WinstonLoggerClass as { new(opts?: RestoreLoggerOptions): RestoreLogger };

/**
 * Logger based on a customized winston logger.
 */
export class Logger extends RCLogger {
  /**
   * @param {Object} config Logger configuration
   */
  constructor(config?: RestoreLoggerOptions) {
    super(config);
  }
}

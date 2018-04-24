import * as RestoreLogger from "@restorecommerce/logger";
import * as _ from "lodash";

/**
 * Logger based on a customized winston logger.
 */
export class Logger extends RestoreLogger {
  /**
   * @param {Object} config Logger configuration
   */
  constructor(config?: any) {
    let conf = config || {};
    if (_.isEmpty(conf)) {
      conf = {
        console: {
          handleExceptions: false,
          level: 'silly',
          colorize: true,
          prettyPrint: true,
        },
      };
    }
    super(conf);
  }
}

// module.exports = Logger;

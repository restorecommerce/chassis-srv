'use strict';

const co = require('co');
const util = require('util');
const Client = require('../../lib/microservice').Client;
const config = require('../../lib/config');

// makeLogging returns a simple middleware which is called before each transport endpoint is called
function makeLogging(logger) {
  return function* makeMiddleware(next) {
    return function* middleware(request, context) {
      logger.info(
        util.format('sending request attempt: %d/%d',
          context.currentAttempt, context.attempts), request);
      const result = yield next(request, context);
      logger.info(
        util.format('received request attempt: %d/%d',
          context.currentAttempt, context.attempts), request);
      return result;
    };
  };
}

co(function* init() {
  config.load(process.cwd() + '/example/client');

  const client = new Client('user');
  client.middleware.push(makeLogging(client.logger));
  const user = yield client.connect();

  const results = yield [
    user.register({
      guest: false,
      name: 'example',
      email: 'example@example.com',
      password: 'example_password',
    }, {
      retry: 3,
      timeout: 1000
    }),
    user.find({
      id: '/users/example',
    }, {
      timeout: 1000,
    }),
    user.find({
      id: '/users/admin',
    }, {
      timeout: 1000,
    }),
    user.find({
      id: '/users/me',
    }, {
      timeout: 1000,
    }),
    user.find({
      id: '/users/does_not_exist',
    }, {
      timeout: 1000,
    }),
  ];
  client.logger.info(util.format('calls finished with %s results',
    results.length));
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (!result) {
      client.logger.error(util.format('result %d is undefined', i));
      continue;
    }
    if (result.error) {
      client.logger.error(
        util.format('result %d error:"%s" %s',
          i, result.error, result.error.details || ''));
    } else {
      client.logger.info(util.format('result %d: %j', i, result.data));
    }
  }
}).catch((err) => {
  /* eslint no-console: ["error", { allow: ["error"] }] */
  console.error('client error', err.stack);
  process.exit(1);
});

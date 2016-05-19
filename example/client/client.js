'use strict';

let co = require('co');
let util = require('util');
let Client = require('../../lib/microservice').Client;
let loadConfig = require('../../lib/config').load;

// makeLogging returns a simple middleware which is called before each transport endpoint is called
function makeLogging(logger) {
  return function*(next) {
    return function*(request, context){
      logger.log('INFO', util.format('sending request attempt: %d/%d', context.currentAttempt, context.attempts), request);
      let result = yield next(request, context);
      logger.log('INFO', util.format('received request attempt: %d/%d', context.currentAttempt, context.attempts), request);
      return result;
    };
  };
}

co(function*() {
  loadConfig(process.cwd());
  let client = new Client('user');
  client.middleware.push(makeLogging(client.logger));
  let user = yield client.connect();

  let results = yield [
    user.register({
      guest: false,
      name: 'example' ,
      email: 'example@example.com',
      password: 'example_password',
    }, {retry:3, timeout: 1000}),
    user.get({
      id: '/users/admin'
    }, {timeout: 1000}),
    user.get({
      id: '/users/me'
    }, {timeout: 1000}),
    user.get({
      id: '/users/does_not_exist'
    }, {timeout: 1000}),
  ];
  client.logger.log('INFO', util.format('calls finished with %s results', results.length));
  for (let i = 0; i < results.length; i++) {
    let result = results[i];
    if (!result) {
      console.error(util.format('result %d is undefined',i));
      continue
    }
    if (result.error) {
      console.error(util.format('result %d error:"%s" %s', i, result.error, result.error.details || ''));
    } else {
      console.log(util.format('result %d: %j', i, result.data));
    }
  }
}).catch(function(err) {
  console.error('client error', err.stack);
  process.exit(1);
});

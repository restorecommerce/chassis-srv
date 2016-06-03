'use strict';

// calls each middleware
function chain(middleware) {
  return function *generator(next) {
    for (let i = middleware.length - 1; i >= 1; i--) {
      next = yield middleware[i](next);
    }
    return yield middleware[0](next);
  };
}

module.exports.chain = chain;

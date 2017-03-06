'use strict';

// calls each middleware
export function chain(middleware: any): any {
  return function* generator(next: any): any {
    let n = next;
    for (let i = middleware.length - 1; i >= 1; i -= 1) {
      n = yield middleware[i](n);
    }
    return yield middleware[0](n);
  };
}

// module.exports.chain = chain;

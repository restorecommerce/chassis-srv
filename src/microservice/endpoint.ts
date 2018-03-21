'use strict';

/**
 * calls each middleware
 * @param middleware
 */
export function chain(middleware: any): any {
  return async function middlewareChain(next: any): Promise<any> {
    let n = next;
    for (let i = middleware.length - 1; i >= 1; i -= 1) {
      n = await middleware[i](n);
    }
    return await middleware[0](n);
  };
}

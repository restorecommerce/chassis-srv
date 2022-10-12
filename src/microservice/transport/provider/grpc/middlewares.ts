import { CallContext, ServerError, ServerMiddlewareCall } from 'nice-grpc';
import { isAbortError } from 'abort-controller-x';
import { Logger } from 'winston';
import { v1 as uuidv1 } from 'uuid';

const tracingHeader = 'x-request-id';

export interface WithRequestID {
  rid: string;
}

export async function* tracingMiddleware<Request, Response>(
  call: ServerMiddlewareCall<Request, Response, WithRequestID>,
  context: CallContext,
) {
  const nextID = context.metadata.get(tracingHeader) || uuidv1();
  context.metadata?.set(tracingHeader, nextID);
  return yield* call.next(call.request, {
    ...context,
    rid: nextID
  });
}

export const loggingMiddleware = (logger: Logger) => {
  return async function* <Request, Response>(
    call: ServerMiddlewareCall<Request, Response>,
    context: CallContext & WithRequestID,
  ) {
    const {path} = call.method;

    logger.verbose(`[rid: ${context.rid}] received request to method ${path}`, call.request);

    try {
      const response = yield* call.next(call.request, context);
      logger.verbose(`[rid: ${context.rid}] request to method ${path} response`, {request: call.request, response});
      return response;
    } catch (error) {
      if (error instanceof ServerError) {
        logger.error(`${context.rid} request to method ${path} server error`, {
          message: error.details,
          code: error.code
        });
      } else if (isAbortError(error)) {
        logger.error(`${context.rid} request to method ${path} cancel`, {
          message: error.message,
          stack: error.stack
        });
      } else {
        logger.error(`${context.rid} request to method ${path} error`, {
          message: error.message,
          stack: error.stack
        });
      }

      return {
        status: {
          code: 500,
          message: error.message
        }
      } as Awaited<Response>;
    }
  };
};

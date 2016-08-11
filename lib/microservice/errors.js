'use strict';

/**
 * Canceled indicates the operation was cancelled (typically by the caller).
 */
class Cancelled extends Error {
  constructor(details) {
    super();
    this.name = this.constructor.name;
    this.message = 'operation was cancelled';
    this.details = details;
  }
}

/**
 * InvalidArgument indicates client specified an invalid argument.
 */
class InvalidArgument extends Error {
  constructor(details) {
    super();
    this.name = this.constructor.name;
    this.message = 'invalid argument';
    this.details = details;
  }
}

/**
 *  NotFound means some requested entity was not found.
 */
class NotFound extends Error {
  constructor(details) {
    super();
    this.name = this.constructor.name;
    this.message = 'not found';
    this.details = details;
  }
}

/**
 * AlreadyExists means an entity the operation attempted to create
 * already exists.
 */
class AlreadyExists extends Error {
  constructor(details) {
    super();
    this.name = this.constructor.name;
    this.message = 'already exists';
    this.details = details;
  }
}

/**
 * PermissionDenied indicates the caller does not have permission to
 * execute the specified operation.
 */
class PermissionDenied extends Error {
  constructor(details) {
    super();
    this.name = this.constructor.name;
    this.message = 'permission denied';
    this.details = details;
  }
}

/**
 * Unauthenticated means the caller could not be authenticated.
 */
class Unauthenticated extends Error {
  constructor(details) {
    super();
    this.name = this.constructor.name;
    this.message = 'unauthenticated';
    this.details = details;
  }
}

/**
 * FailedPrecondition means the system is not in a state in which
 * the operation can be executed. A precondition, for example a call
 * to a different endpoint before this call is required.
 */
class FailedPrecondition extends Error {
  constructor(details) {
    super();
    this.name = this.constructor.name;
    this.message = 'failed precondition';
    this.details = details;
  }
}

/**
 * Aborted indicates the operation was aborted because
 * of transaction aborts or sequencer check failures.
 */
class Aborted extends Error {
  constructor(details) {
    super();
    this.name = this.constructor.name;
    this.message = 'aborted';
    this.details = details;
  }
}

/**
 * OutOfRange means one of the provided arguments is
 * outside the range of the iterated data.
 */
class OutOfRange extends Error {
  constructor(details) {
    super();
    this.name = this.constructor.name;
    this.message = 'out of range';
    this.details = details;
  }
}

/**
 * Unimplemented means the endpoint is not implemented,
 * not specified or not configured.
 */
class Unimplemented extends Error {
  constructor(details) {
    super();
    this.name = this.constructor.name;
    this.message = 'unimplemented';
    this.details = details;
  }
}

/**
 * ResourceExhausted indicates that a quota or storage is used up.
 */
class ResourceExhausted extends Error {
  constructor(details) {
    super();
    this.name = this.constructor.name;
    this.message = 'resource exhausted';
    this.details = details;
  }
}

/**
 * DeadlineExceeded means the operation expired before completion.
 * It does not mean the operation did not complete.
 */
class DeadlineExceeded extends Error {
  constructor(details) {
    super();
    this.name = this.constructor.name;
    this.message = 'deadline exceeded';
    this.details = details;
  }
}

/**
 * Internal indicates an uncaught or unhandled server error.
 */
class Internal extends Error {
  constructor(details) {
    super();
    this.name = this.constructor.name;
    this.message = 'internal';
    this.details = details;
  }
}

/**
 * Unavailable indicates that the service currently is not
 * processing requests.
 * This is mostlikly only a short condition.
 */
class Unavailable extends Error {
  constructor(details) {
    super();
    this.name = this.constructor.name;
    this.message = 'unavailable';
    this.details = details;
  }
}

/**
 * DataLoss indicates unrecoverable data loss or corruption.
 */
class DataLoss extends Error {
  constructor(details) {
    super();
    this.name = this.constructor.name;
    this.message = 'data loss';
    this.details = details;
  }
}

module.exports = {
  Cancelled,
  InvalidArgument,
  NotFound,
  AlreadyExists,
  PermissionDenied,
  Unauthenticated,
  FailedPrecondition,
  Aborted,
  OutOfRange,
  Unimplemented,
  ResourceExhausted,
  DeadlineExceeded,
  Internal,
  Unavailable,
  DataLoss,
};

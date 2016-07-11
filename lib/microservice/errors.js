'use strict';

const util = require('util');

/**
 * Canceled indicates the operation was cancelled (typically by the caller).
 */
function Cancelled(details) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = 'operation was cancelled';
  this.details = details;
}

/**
 * InvalidArgument indicates client specified an invalid argument.
 */
function InvalidArgument(details) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = 'invalid argument';
  this.details = details;
}

/**
 *  NotFound means some requested entity was not found.
 */
function NotFound(details) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = 'not found';
  this.details = details;
}

/**
 * AlreadyExists means an entity the operation attempted to create
 * already exists.
 */
function AlreadyExists(details) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = 'already exists';
  this.details = details;
}

/**
 * PermissionDenied indicates the caller does not have permission to
 * execute the specified operation.
 */
function PermissionDenied(details) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = 'permission denied';
  this.details = details;
}

/**
 * Unauthenticated means the caller could not be authenticated.
 */
function Unauthenticated(details) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = 'unauthenticated';
  this.details = details;
}

/**
 * FailedPrecondition means the system is not in a state in which
 * the operation can be executed. A precondition, for example a call
 * to a different endpoint before this call is required.
 */
function FailedPrecondition(details) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = 'failed precondition';
  this.details = details;
}

/**
 * Aborted indicates the operation was aborted because
 * of transaction aborts or sequencer check failures.
 */
function Aborted(details) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = 'aborted';
  this.details = details;
}

/**
 * OutOfRange means one of the provided arguments is
 * outside the range of the iterated data.
 */
function OutOfRange(details) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = 'out of range';
  this.details = details;
}

/**
 * Unimplemented means the endpoint is not implemented,
 * not specified or not configured.
 */
function Unimplemented(details) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = 'unimplemented';
  this.details = details;
}

/**
 * ResourceExhausted indicates that a quota or storage is used up.
 */
function ResourceExhausted(details) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = 'resource exhausted';
  this.details = details;
}

/**
 * DeadlineExceeded means the operation expired before completion.
 * It does not mean the operation did not complete.
 */
function DeadlineExceeded(details) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = 'deadline exceeded';
  this.details = details;
}

/**
 * Internal indicates an uncaught or unhandled server error.
 */
function Internal(details) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = 'internal';
  this.details = details;
}

/**
 * Unavailable indicates that the service currently is not
 * processing requests.
 * This is mostlikly only a short condition.
 */
function Unavailable(details) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = 'unavailable';
  this.details = details;
}

/**
 * DataLoss indicates unrecoverable data loss or corruption.
 */
function DataLoss(details) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = 'data loss';
  this.details = details;
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

util.inherits(module.exports.Cancelled, Error);
util.inherits(module.exports.InvalidArgument, Error);
util.inherits(module.exports.NotFound, Error);
util.inherits(module.exports.AlreadyExists, Error);
util.inherits(module.exports.PermissionDenied, Error);
util.inherits(module.exports.Unauthenticated, Error);
util.inherits(module.exports.FailedPrecondition, Error);
util.inherits(module.exports.Aborted, Error);
util.inherits(module.exports.OutOfRange, Error);
util.inherits(module.exports.Unimplemented, Error);
util.inherits(module.exports.ResourceExhausted, Error);
util.inherits(module.exports.DeadlineExceeded, Error);
util.inherits(module.exports.Internal, Error);
util.inherits(module.exports.Unavailable, Error);
util.inherits(module.exports.DataLoss, Error);

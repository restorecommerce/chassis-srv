'use strict';

const util = require('util');

function Cancelled(details) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = 'operation was cancelled';
  this.details = details;
}

function InvalidArgument(details) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = 'invalid argument';
  this.details = details;
}

function NotFound(details) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = 'not found';
  this.details = details;
}

function AlreadyExists(details) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = 'already exists';
  this.details = details;
}

function PermissionDenied(details) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = 'permission denied';
  this.details = details;
}

function Unauthenticated(details) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = 'unauthenticated';
  this.details = details;
}

function FailedPrecondition(details) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = 'failed precondition';
  this.details = details;
}

function Aborted(details) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = 'aborted';
  this.details = details;
}

function OutOfRange(details) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = 'out of range';
  this.details = details;
}

function Unimplemented(details) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = 'unimplemented';
  this.details = details;
}

function ResourceExhausted(details) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = 'resource exhausted';
  this.details = details;
}

function DeadlineExceeded(details) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = 'deadline exceeded';
  this.details = details;
}

function Internal(details) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = 'internal';
  this.details = details;
}

function Unavailable(details) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = 'unavailable';
  this.details = details;
}

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

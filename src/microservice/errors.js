'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.Cancelled = Cancelled;
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
exports.InvalidArgument = InvalidArgument;
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
exports.NotFound = NotFound;
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
exports.AlreadyExists = AlreadyExists;
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
exports.PermissionDenied = PermissionDenied;
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
exports.Unauthenticated = Unauthenticated;
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
exports.FailedPrecondition = FailedPrecondition;
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
exports.Aborted = Aborted;
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
exports.OutOfRange = OutOfRange;
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
exports.Unimplemented = Unimplemented;
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
exports.ResourceExhausted = ResourceExhausted;
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
exports.DeadlineExceeded = DeadlineExceeded;
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
exports.Internal = Internal;
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
exports.Unavailable = Unavailable;
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
exports.DataLoss = DataLoss;

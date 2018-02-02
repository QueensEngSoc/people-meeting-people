/**
 * @fileoverview custom error classes for Queen's Housing Connect
 * @author astral.cai@queensu.ca (Astral Cai)
 */

"use strict";

class BaseError extends Error {
    constructor(message) {
        super(message);
        this.name = 'BaseError';
        Error.captureStackTrace(this, this.constructor);
    }
}

exports.BaseError = BaseError;

class DatabaseError extends BaseError {
    constructor(message) {
        super(message);
        this.name = 'DatabaseError';
        Error.captureStackTrace(this, this.constructor);
    }
}

exports.DatabaseError = DatabaseError;

class FailedQueryError extends DatabaseError {
    constructor(message) {
        super(message);
        this.name = 'FailedQueryError';
        Error.captureStackTrace(this, this.constructor);
    }
}

exports.FailedQueryError = FailedQueryError;

class DuplicateEntryError extends DatabaseError {
    constructor(message) {
        super(message);
        this.name = 'DuplicateEntryError';
        Error.captureStackTrace(this, this.constructor);
    }
}

exports.DuplicateEntryError = DuplicateEntryError;

class IllegalEntryError extends DatabaseError {
    constructor(message) {
        super(message);
        this.name = 'IllegalEntryError';
        Error.captureStackTrace(this, this.constructor);
    }
}

exports.IllegalEntryError = IllegalEntryError;

class InvalidOperationError extends DatabaseError {
    constructor(message) {
        super(message);
        this.name = 'InvalidOperationError';
        Error.captureStackTrace(this, this.constructor);
    }
}

exports.InvalidOperationError = InvalidOperationError;
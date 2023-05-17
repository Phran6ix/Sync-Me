"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HTTPException extends Error {
    constructor(message, code) {
        super(message);
        this.statusCode = code;
        this.isOperational = true;
        this.success = `${this.statusCode}`.startsWith("4") ? "fail" : "error";
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = HTTPException;

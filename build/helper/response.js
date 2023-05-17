"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function response(res, statusCode, status, data) {
    return res.status(statusCode).json({
        success: status,
        data,
    });
}
exports.default = response;

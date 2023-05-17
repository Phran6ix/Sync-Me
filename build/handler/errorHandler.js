"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = __importDefault(require("../helper/response"));
function handleDuplicateError(err, req, res, next) {
    err.message = `${Object.keys(err.keyValue)[0]} already exists`;
    err.statusCode = 400;
    return (0, response_1.default)(res, err.statusCode, false, {
        message: err.message,
    });
}
function sendResponse(error, res) {
    return (0, response_1.default)(res, error.statusCode, false, {
        success: false,
        message: error.message,
        error,
    });
}
function handleGlobalError(error, req, res, next) {
    const err = __rest(error, []);
    if (error.code === 11000)
        return handleDuplicateError(err, req, res, next);
    error.statusCode = error.statusCode || 500;
    error.message = error.message || "An Error Occured, reach out to the admin";
    return sendResponse(error, res);
}
exports.default = handleGlobalError;

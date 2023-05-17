"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseController {
    constructor() { }
    //  public readonly S
    sendResponse(res, status, code, data) {
        return res.status(code).json({
            success: `${status}`.includes("success") ? true : false || true,
            data: data,
        });
    }
}
exports.default = BaseController;

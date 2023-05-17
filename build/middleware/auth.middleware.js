"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const exceptions_1 = __importDefault(require("../exception/exceptions"));
const user_implementation_1 = __importDefault(require("../modules/implementation/user.implementation"));
const user_repo = new user_implementation_1.default();
function protect(req, res, next) {
    if (!req.session || !req.session.user) {
        throw new exceptions_1.default("You are not logged in", 403);
    }
    if (req.user.isModified()) {
        user_repo.findUserById(req.user._id).then((res) => {
            req.user = res;
        });
    }
    else {
        req.user = req.session.user;
    }
    next();
}
exports.protect = protect;

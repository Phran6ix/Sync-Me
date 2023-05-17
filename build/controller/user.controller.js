"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_services_1 = __importDefault(require("../services/user.services"));
const user_implementation_1 = __importDefault(require("../modules/implementation/user.implementation"));
const express_1 = require("express");
const BaseController_1 = __importDefault(require("./BaseController"));
const auth_middleware_1 = require("../middleware/auth.middleware");
class UserController extends BaseController_1.default {
    constructor() {
        super();
        this.path = "/user";
        this.router = (0, express_1.Router)();
        this.user_service = new user_services_1.default(new user_implementation_1.default());
        this.initializeRoute();
    }
    initializeRoute() {
        this.router.get(`${this.path}/me`, auth_middleware_1.protect, (...a) => this.HTTPGetUserProfile(...a));
        this.router.patch(`${this.path}/update-me`, auth_middleware_1.protect, (...a) => this.HTTPUpdateUserProfile(...a));
        this.router.patch(`${this.path}/update-password`, auth_middleware_1.protect, (...a) => this.HTTPUpdateUserPassword(...a));
        this.router.patch(`${this.path}/upload-photo`, auth_middleware_1.protect, (...a) => this.HTTPUploadProfilePhoto(...a));
    }
    HTTPGetUserProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.user_service.getUserProfile(req.user);
                return this.sendResponse(res, "success", 200, user);
            }
            catch (error) {
                next(error);
            }
        });
    }
    HTTPUpdateUserProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.user_service.updateUserProfile(req.user, req.body);
                return this.sendResponse(res, "success", 203, {
                    message: "User profile has been updated",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    HTTPUpdateUserPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.user_service.updateUserPassword(req.user, req.body.password);
                return this.sendResponse(res, "success", 203, {
                    message: "Password has been updated",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    HTTPUploadProfilePhoto(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.user_service.updateUserProfilePicture(req.user, req.body.photo);
                return this.sendResponse(res, "success", 203, {
                    message: "Profile photo has been uploaded successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = UserController;

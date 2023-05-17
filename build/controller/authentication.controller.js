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
const express_1 = require("express");
const BaseController_1 = __importDefault(require("./BaseController"));
const validator_1 = require("../validator/validator");
const authentication_services_1 = __importDefault(require("../services/authentication.services"));
const hashpassword_1 = require("../utils/bcrypt/hashpassword");
class AuthenticationController extends BaseController_1.default {
    constructor() {
        super();
        this.path = "/auth";
        this.router = (0, express_1.Router)();
        this.initiateRoute();
        this.authService = new authentication_services_1.default();
    }
    // IMPLEMENTING FULL OOP BY HAVING THE CONTROLLER AND ROUTES IN THE SAME CLASS
    initiateRoute() {
        this.router.post(`${this.path}/sign-up`, (...fromexpress) => this.HTTPsignupuser(...fromexpress));
        this.router.post(`${this.path}/login`, (...args) => this.HTTPloginAUser(...args));
        this.router.patch(`${this.path}/verify-account`, (...fromexpress) => {
            this.HTTPVerifyAccount(...fromexpress);
        });
        this.router.post(`${this.path}/resend-otp`, (...args) => {
            this.HTTPResentOTP(...args);
        });
        this.router.get(`${this.path}/forgot-password`, (...args) => this.HTTPForgotPassword(...args));
        this.router.patch(`${this.path}/reset-password`, (...args) => this.HTTPResetPassword(...args));
    }
    // SIGNUP A USER
    HTTPsignupuser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = yield validator_1.signupSchema.validate(req.body);
                let { password } = payload, data = __rest(payload, ["password"]);
                password = yield (0, hashpassword_1.hashpassword)(password);
                yield this.authService.Register(Object.assign({ password }, data));
                return this.sendResponse(res, "success", 201, {
                    message: "User successfully registered",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    HTTPVerifyAccount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otp = "" + req.query.otp;
                const response = yield this.authService.verifyAccount(otp);
                return this.sendResponse(res, "success", 200, {
                    message: "Account has verified",
                    user: response,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    HTTPResentOTP(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                yield this.authService.resendOTP(email);
                return this.sendResponse(res, "success", 200, {
                    message: "OTP has been sent to your email",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    HTTPloginAUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = yield validator_1.loginSchema.validate(req.body);
                const { email, password, username } = payload;
                const user = yield this.authService.loginAUser({
                    email,
                    username,
                    password,
                });
                req.session.user = user;
                return this.sendResponse(res, "success", 200, {
                    message: "User signed in successful",
                    user,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    HTTPForgotPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                yield this.authService.forgotPassword(email);
                return this.sendResponse(res, "success", 200, {
                    message: "OTP has been sent to your email",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    HTTPResetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { password } = yield validator_1.resetPasswordSchema.validate(req.body);
                let id = "" + req.query.userid;
                password = yield (0, hashpassword_1.hashpassword)(password);
                yield this.authService.resetPassword(id, password);
                return this.sendResponse(res, "success", 200, {
                    message: "Password reset successful",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = AuthenticationController;

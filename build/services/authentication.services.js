"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const crypto = __importStar(require("crypto"));
const user_implementation_1 = __importDefault(require("../modules/implementation/user.implementation"));
const userModel_1 = require("../database/models/userModel");
const otpModel_1 = require("../database/models/otpModel");
const email_1 = __importDefault(require("../utils/nodemailer/email"));
const hashpassword_1 = require("../utils/bcrypt/hashpassword");
const exceptions_1 = __importDefault(require("../exception/exceptions"));
class AuthenticationServices {
    constructor() {
        this.User = userModel_1.User;
        this.user_repo = new user_implementation_1.default();
    }
    Register(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.user_repo.createUser(payload);
                if (!user) {
                    throw new exceptions_1.default("An Error occured", 400);
                }
                const code = Math.round(Math.random() * 1000000);
                const hashed = crypto
                    .createHash("sha256")
                    .update(`${code}`)
                    .digest("hex");
                const otp = new otpModel_1.OTP({
                    user: user._id,
                    otp: hashed,
                    purpose: "sign-up",
                });
                yield otp.save();
                yield new email_1.default(`Your OTP code is ${code}`, "Email Verification", user.email).sendEmail();
                return true;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    verifyAccount(otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hashed = crypto.createHash("sha256").update(`${otp}`).digest("hex");
                const otpDoc = yield otpModel_1.OTP.findOne({ otp: hashed });
                if (!otpDoc) {
                    throw new exceptions_1.default("Account with this OTP does not exist", 404);
                }
                if (+new Date() - +otpDoc.createdAt > 600000) {
                    throw new exceptions_1.default("This token has expired", 400);
                }
                otpDoc.verified = true;
                yield otpDoc.save();
                const user = yield userModel_1.User.findByIdAndUpdate(otpDoc.user, {
                    isVerified: true,
                });
                return { _id: user.id, fullname: user.fullname, username: user.username };
            }
            catch (error) {
                throw error;
            }
        });
    }
    resendOTP(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const code = Math.round(Math.random() * 1000000);
                const hashedotp = crypto
                    .createHash("sha256")
                    .update(`${code}`)
                    .digest("hex");
                const user = yield userModel_1.User.findOne({ email });
                if (!user) {
                    throw new exceptions_1.default("User not found", 404);
                }
                const otp = new otpModel_1.OTP({
                    otp: hashedotp,
                    user: user._id,
                    purpose: "sign-up",
                });
                yield otp.save();
                yield new email_1.default(`Your OTP code is ${code}`, "Resend One Time Token", user.email).sendEmail();
                return;
            }
            catch (error) {
                throw error;
            }
        });
    }
    loginAUser(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, username, password } = payload;
                let user;
                if (email)
                    user = yield this.user_repo.findUserByEmail(email);
                if (username)
                    user = yield this.user_repo.findUserByUsername(username);
                if (!user)
                    throw new exceptions_1.default("User with this credential is not found, try again", 404);
                if (!(yield (0, hashpassword_1.comparepassword)(password, user.password)))
                    throw new exceptions_1.default("Invalid password", 400);
                if (!user.isVerified)
                    throw new exceptions_1.default("User account is not verified", 401);
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userexist = yield this.user_repo.findUserByEmail(email);
                if (!userexist) {
                    throw new exceptions_1.default("User with this email does not exist", 404);
                }
                const resetToken = Math.round(Math.random() * 1000000);
                const hashToken = crypto
                    .createHash("sha256")
                    .update(`${resetToken}`)
                    .digest("hex");
                const otp = new otpModel_1.OTP({
                    user: userexist._id,
                    otp: hashToken,
                    purpose: "reset-password",
                    email: userexist.email,
                });
                yield otp.save();
                userexist.isVerified = false;
                yield userexist.save();
                yield new email_1.default(`Your Reset Password Token is ${resetToken}`, "Reset Password", userexist.email).sendEmail();
                return;
            }
            catch (error) {
                throw error;
            }
        });
    }
    resetPassword(id, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.user_repo.findUserById(id);
                if (!user.isVerified) {
                    throw new exceptions_1.default("Your account is not verified.", 400);
                }
                user.password = password;
                yield user.save();
                return;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = AuthenticationServices;

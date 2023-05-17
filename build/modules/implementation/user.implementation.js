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
const userModel_1 = require("../../database/models/userModel");
const exceptions_1 = __importDefault(require("../../exception/exceptions"));
class UserRepo {
    constructor() {
        this.userModel = userModel_1.User;
    }
    createUser(User) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userModel.create(User);
            if (!user) {
                throw new exceptions_1.default("User not created", 500);
            }
            return user;
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email) {
                return null;
            }
            const user = yield this.userModel
                .findOne({ email })
                .select("+password");
            if (!user) {
                return null;
            }
            return user;
        });
    }
    findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userModel.findById(userId);
            if (!user) {
                return null;
            }
            return user;
        });
    }
    findUserByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userModel
                .findOne({ username })
                .select("+password");
            if (!user) {
                return null;
            }
            return user;
        });
    }
    userExists(username, email) {
        return __awaiter(this, void 0, void 0, function* () {
            let user;
            if (email) {
                user = yield this.findUserByEmail(email);
            }
            if (username) {
                user = yield this.findUserByUsername(username);
            }
            if (!user)
                return false;
            return true;
        });
    }
    updateUser(userId, User) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(userId);
            const user = yield this.userModel.findByIdAndUpdate(userId, User);
            if (!user)
                return false;
            return true;
        });
    }
}
exports.default = UserRepo;

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
const exceptions_1 = __importDefault(require("../exception/exceptions"));
const hashpassword_1 = require("../utils/bcrypt/hashpassword");
const validator_1 = require("../validator/validator");
class UserService {
    constructor(user_repo) {
        this.user_repo = user_repo;
    }
    getUserProfile(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.user_repo.findUserById(user._id);
        });
    }
    updateUserProfile(user, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateuser = yield this.user_repo.updateUser(user._id, payload);
                if (!updateuser)
                    throw new exceptions_1.default("An Error occured", 400);
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateUserPassword(user, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = yield validator_1.resetPasswordSchema.validate({ password });
                password = yield (0, hashpassword_1.hashpassword)(payload.password);
                const update_user = yield this.updateUserProfile(user, {
                    password,
                });
                return;
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateUserProfilePicture(user, photo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.updateUserProfile(user, { photo });
                return;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = UserService;
//
// user_repo = new UserRepo();
// const user_service = new UserService(user_repo);

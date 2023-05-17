"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    fullname: {
        type: String,
        required: [true, "Input your fullname"],
    },
    email: {
        type: String,
        required: [true, "Input your email"],
        unique: [true, "Email already exists"],
    },
    password: {
        type: String,
        select: false,
    },
    username: {
        type: String,
        required: [true, "Input your username"],
        unique: [true, "Username already exists"],
    },
    photo: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
});
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
const userModel = (0, mongoose_1.model)("User", userSchema);
exports.User = userModel;

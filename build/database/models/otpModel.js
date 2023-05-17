"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTP = void 0;
const mongoose_1 = require("mongoose");
const OTPSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
    },
    otp: {
        type: String,
        required: [true, "OTP is required"],
    },
    verified: { type: Boolean, default: false },
    purpose: {
        type: String,
        enum: ["sign-up", "reset-password"],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});
OTPSchema.index({ otp: 1 });
const otpModel = (0, mongoose_1.model)("OTP", OTPSchema);
exports.OTP = otpModel;

import { model, Schema, Document, Types } from "mongoose";
import IOtp from "../../interfaces/otp.interface";

const OTPSchema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: "User",
  },
  otp: {
    type: String,
    required: [true, "OTP is required"],
  },
  verified: { type: Boolean, default: true },
  purpose: {
    type: String,
    enum: ["sign-up", "reset-password"],
  },
});

OTPSchema.index({ otp: 1 });

const otpModel = model<IOtp & Document>("OTP", OTPSchema);

export { otpModel as OTP };

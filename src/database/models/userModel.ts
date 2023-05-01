import { Document, ObjectId, Schema, model, Types } from "mongoose";
import { IUser } from "../../interfaces/user.interface";

const userSchema = new Schema({
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

const userModel = model<IUser & Document>("User", userSchema);

export { userModel as User };

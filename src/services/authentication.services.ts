import * as crypto from "crypto";
import UserRepo from "../modules/implementation/user.implementation";
import { User } from "../database/models/userModel";
import { OTP } from "../database/models/otpModel";

import Email from "../utils/nodemailer/email";
import { comparepassword } from "../utils/bcrypt/hashpassword";
import { IUser } from "../interfaces/user.interface";
import X from "../exception/exceptions";
import IOtp from "../interfaces/otp.interface";
import { Document } from "mongoose";
import { date } from "yup";

class AuthenticationServices {
  public User = User;
  private user_repo: UserRepo;

  constructor() {
    this.user_repo = new UserRepo();
  }

  public async Register(payload: Partial<IUser>): Promise<Boolean> {
    try {
      const user = await this.user_repo.createUser(payload);

      if (!user) {
        console.error(user);
        throw new X("An Error occured", 400);
      }

      const code = Math.round(Math.random() * 1000000);

      const hashed = crypto
        .createHash("sha256")
        .update(`${code}`)
        .digest("hex");

      const otp = new OTP({
        user: user._id,
        otp: hashed,
        purpose: "sign-up",
      });

      await otp.save();

      await new Email(
        `Your OTP code is ${code}`,
        "Email Verification",
        user.email
      ).sendEmail();

      return true;
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }

  public async verifyAccount(otp: any): Promise<Boolean> {
    try {
      const hashed = crypto.createHash("sha256").update(`${otp}`).digest("hex");

      const otpDoc: IOtp & Document = await OTP.findOne({ otp: hashed });
      if (!otpDoc) {
        throw new X("Account with this OTP does not exist", 404);
      }

      if (+new Date() - +otpDoc.createdAt > 600000) {
        throw new X("This token has expired", 400);
      }

      otpDoc.verified = true;
      await otpDoc.save();

      await User.findByIdAndUpdate(otpDoc.user, {
        isVerified: true,
      });

      return true;
    } catch (error) {
      throw error;
    }
  }

  public async resendOTP(email: string): Promise<void> {
    try {
      const code = Math.round(Math.random() * 1000000);

      const hashedotp = crypto
        .createHash("sha256")
        .update(`${code}`)
        .digest("hex");

      const user = await User.findOne({ email });
      if (!user) {
        throw new X("User not found", 404);
      }

      const otp = new OTP({
        otp: hashedotp,
        user: user._id,
        purpose: "sign-up",
      });

      await otp.save();

      await new Email(
        `Your OTP code is ${code}`,
        "Resend One Time Token",
        user.email
      ).sendEmail();

      return;
    } catch (error) {
      throw error;
    }
  }

  public async loginAUser(payload: {
    email?: string;
    username?: string;
    password: string;
  }): Promise<IUser> {
    try {
      const { email, username, password } = payload;
      if (!email || !username) throw new X("Field cannot be empty", 400);
      let user;
      if (email) user = await this.user_repo.findUserByEmail(email);
      if (username) user = await this.user_repo.findUserByUsername(username);

      if (!user)
        throw new X("User with this credential is not found, try again", 404);

      if (!(await comparepassword(password, user.password)))
        throw new X("Invalid password", 400);

      if (!user.isVerified) throw new X("User account is not verified", 401);

      return user as IUser;
    } catch (error) {
      return error;
    }
  }
}

export default AuthenticationServices;

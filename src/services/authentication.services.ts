import * as crypto from "crypto";
import UserRepo, { TUser } from "../modules/implementation/user.implementation";
import { User } from "../database/models/userModel";
import { OTP } from "../database/models/otpModel";

import Email from "../utils/nodemailer/email";
import { comparepassword } from "../utils/bcrypt/hashpassword";
import { IUser } from "../interfaces/user.interface";

import JWTFunctions from "../helper/jwt";
import IOtp from "../interfaces/otp.interface";
import { Document } from "mongoose";
import HTTPException from "../exception/exceptions";

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
        throw new HTTPException("An Error occured", 400);
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

  public async verifyAccount(otp: string): Promise<Partial<IUser>> {
    try {
      const hashed = crypto.createHash("sha256").update(`${otp}`).digest("hex");

      const otpDoc: IOtp & Document = await OTP.findOne({ otp: hashed });
      if (!otpDoc) {
        throw new HTTPException("Account with this OTP does not exist", 404);
      }
      console.log(otpDoc, new Date());
      if (new Date().getTime() - otpDoc.createdAt.getTime() > 600000) {
        throw new HTTPException("This token has expired", 400);
      }

      otpDoc.verified = true;
      await otpDoc.save();

      const user = await User.findByIdAndUpdate(otpDoc.user, {
        isVerified: true,
      });

      return { _id: user.id, fullname: user.fullname, username: user.username };
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
        throw new HTTPException("User not found", 404);
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
  }): Promise<{ user: IUser; token: string }> {
    try {
      const { email, username, password } = payload;

      let user;
      if (email) user = await this.user_repo.findUserByEmail(email);
      if (username) user = await this.user_repo.findUserByUsername(username);

      if (!user)
        throw new HTTPException(
          "User with this credential is not found, try again",
          404
        );

      if (!(await comparepassword(password, user.password)))
        throw new HTTPException("Invalid password", 400);

      if (!user.isVerified)
        throw new HTTPException("User account is not verified", 401);

      let userdata = {
        _id: user._id,
        fullname: user.fullname,
        photo: user.photo,
        email: user.email,
        username: user.username,
      };

      const token = await JWTFunctions.signToken(userdata);
      return { user, token };
    } catch (error) {
      throw error;
    }
  }

  public async forgotPassword(email: string): Promise<void> {
    try {
      const userexist = await this.user_repo.findUserByEmail(email);

      if (!userexist) {
        throw new HTTPException("User with this email does not exist", 404);
      }

      const resetToken = Math.round(Math.random() * 1000000);
      const hashToken = crypto
        .createHash("sha256")
        .update(`${resetToken}`)
        .digest("hex");

      const otp = new OTP({
        user: userexist._id,
        otp: hashToken,
        purpose: "reset-password",
        email: userexist.email,
      });

      await otp.save();
      userexist.isVerified = false;
      await userexist.save();

      await new Email(
        `Your Reset Password Token is ${resetToken}`,
        "Reset Password",
        userexist.email
      ).sendEmail();

      return;
    } catch (error) {
      throw error;
    }
  }

  public async resetPassword(id: string, password: string): Promise<void> {
    try {
      const user = await this.user_repo.findUserById(id);
      if (!user.isVerified) {
        throw new HTTPException("Your account is not verified.", 400);
      }
      user.password = password;
      await user.save();
      return;
    } catch (error) {
      throw error;
    }
  }
}

export default AuthenticationServices;

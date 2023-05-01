import * as crypto from "crypto";
import UserRepo from "../modules/implementation/user.implementation";
import BaseController from "../controller/BaseController";
import { User } from "../database/models/userModel";
import { OTP } from "../database/models/otpModel";

import Email from "../utils/nodemailer/email";
import { comparepassword } from "../utils/bcrypt/hashpassword";
import { IUser } from "../interfaces/user.interface";
import X from "../exception/exceptions";

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
      const otpcode = await crypto.randomBytes(13).toString("hex");

      const otp = new OTP({
        user: user._id,
        otp: otpcode,
        purpose: "sign-up",
      });
      console.log(otp);

      await new Email(
        `Your OTP code is ${otp}`,
        "Email Verification",
        user.email
      );

      return true;
    } catch (error: any) {
      console.error(error);
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

      return user as IUser;
    } catch (error) {
      return error;
    }
  }
}

export default AuthenticationServices;

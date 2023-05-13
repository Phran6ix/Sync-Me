import { User } from "../../database/models/userModel";
import { IUserRepo } from "../repository/user.repository";
import { IUser } from "../../interfaces/user.interface";

import HTTPException from "../../exception/exceptions";
import { Document, Model } from "mongoose";

export type TUser = IUser & Document;

export default class UserRepo implements IUserRepo<IUser> {
  private userModel;
  constructor() {
    this.userModel = User;
  }

  public async createUser(User: Partial<IUser>): Promise<TUser> {
    const user: TUser = await this.userModel.create(User);
    if (!user) {
      throw new HTTPException("User not created", 500);
    }

    return user;
  }

  public async findUserByEmail(email: string): Promise<TUser> {
    if (!email) {
      return null;
    }
    const user: TUser = await this.userModel
      .findOne({ email })
      .select("+password");
    if (!user) {
      return null;
    }
    return user;
  }

  public async findUserById(userId: string): Promise<TUser> {
    const user: TUser = await this.userModel.findById(userId);

    if (!user) {
      return null;
    }
    return user;
  }

  public async findUserByUsername(username: string): Promise<TUser> {
    const user: TUser = await this.userModel
      .findOne({ username })
      .select("+password");

    if (!user) {
      return null;
    }
    return user;
  }

  public async userExists(username?: string, email?: string): Promise<Boolean> {
    let user: IUser;
    if (email) {
      user = await this.findUserByEmail(email);
    }
    if (username) {
      user = await this.findUserByUsername(username);
    }
    if (!user) return false;

    return true;
  }

  public async updateUser(
    userId: string,
    User: Partial<IUser>
  ): Promise<Boolean> {
    console.log(userId);
    const user = await this.userModel.findByIdAndUpdate(userId, User);

    if (!user) return false;
    return true;
  }
}

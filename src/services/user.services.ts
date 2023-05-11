import HTTPException from "../exception/exceptions";
import { IUser } from "../interfaces/user.interface";
import UserRepo, { TUser } from "../modules/implementation/user.implementation";
import { IUserRepo } from "../modules/repository/user.repository";
import { hashpassword } from "../utils/bcrypt/hashpassword";

export default class UserService {
  private user_repo;
  constructor(user_repo: IUserRepo<IUser>) {
    this.user_repo = user_repo;
  }

  getUserProfile(user: TUser): TUser {
    return user;
  }

  async updateUserProfile(user: TUser, payload: Partial<IUser>): Promise<void> {
    try {
      const updateuser = await this.user_repo.updateUser(user._id, payload);
      if (!updateuser) throw new HTTPException("An Error occured", 400);
    } catch (error) {
      throw error;
    }
  }

  async updateUserPassword(user: TUser, password: string): Promise<void> {
    try {
      password = await hashpassword(password);
      const update_user = await this.updateUserProfile(user._id, {
        password,
      });
      return;
    } catch (error) {
      throw error;
    }
  }

  async updateUserProfilePicture(user: TUser, photo: string): Promise<void> {
    try {
      await this.updateUserProfile(user._id, { photo });
      return;
    } catch (error) {
      throw error;
    }
  }
}

//

// user_repo = new UserRepo();
// const user_service = new UserService(user_repo);

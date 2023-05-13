import HTTPException from "../exception/exceptions";
import { IUser } from "../interfaces/user.interface";
import UserRepo, { TUser } from "../modules/implementation/user.implementation";
import { IUserRepo } from "../modules/repository/user.repository";
import { hashpassword } from "../utils/bcrypt/hashpassword";
import { resetPasswordSchema } from "../validator/validator";

export default class UserService {
  private user_repo;
  constructor(user_repo: IUserRepo<TUser>) {
    this.user_repo = user_repo;
  }

  async getUserProfile(user: TUser): Promise<TUser> {
    return await this.user_repo.findUserById(user._id);
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
      const payload = await resetPasswordSchema.validate({ password });

      password = await hashpassword(payload.password);
      const update_user = await this.updateUserProfile(user, {
        password,
      });
      return;
    } catch (error) {
      throw error;
    }
  }

  async updateUserProfilePicture(user: TUser, photo: string): Promise<void> {
    try {
      await this.updateUserProfile(user, { photo });
      return;
    } catch (error) {
      throw error;
    }
  }
}

//

// user_repo = new UserRepo();
// const user_service = new UserService(user_repo);

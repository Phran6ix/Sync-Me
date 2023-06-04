import UserService from "../services/user.services";
import UserRepo from "../modules/implementation/user.implementation";
import { NextFunction, Request, Response, Router } from "express";
import BaseController from "./BaseController";
import { protect } from "../middleware/auth.middleware";

export default class UserController extends BaseController {
  public path: string = "/user";
  public router: Router = Router();

  user_service;
  constructor() {
    super();
    this.user_service = new UserService(new UserRepo());
    this.initializeRoute();
  }

  private initializeRoute() {
    this.router.get(`${this.path}/me`, protect, (...a) =>
      this.HTTPGetUserProfile(...a)
    );

    this.router.patch(`${this.path}/update-me`, protect, (...a) =>
      this.HTTPUpdateUserProfile(...a)
    );

    this.router.patch(`${this.path}/update-password`, protect, (...a) =>
      this.HTTPUpdateUserPassword(...a)
    );

    this.router.patch(`${this.path}/upload-photo`, protect, (...a) =>
      this.HTTPUploadProfilePhoto(...a)
    );
  }

  private async HTTPGetUserProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const user = await this.user_service.getUserProfile(req.user);
      return this.sendResponse(res, 200, user);
    } catch (error) {
      next(error);
    }
  }

  private async HTTPUpdateUserProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const user = await this.user_service.updateUserProfile(
        req.user,
        req.body
      );
      return this.sendResponse(res, 203, {
        message: "User profile has been updated",
      });
    } catch (error) {
      next(error);
    }
  }

  private async HTTPUpdateUserPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      await this.user_service.updateUserPassword(req.user, req.body.password);
      return this.sendResponse(res, 203, {
        message: "Password has been updated",
      });
    } catch (error) {
      next(error);
    }
  }

  private async HTTPUploadProfilePhoto(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      await this.user_service.updateUserProfilePicture(
        req.user,
        req.body.photo
      );
      return this.sendResponse(res, 203, {
        message: "Profile photo has been uploaded successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

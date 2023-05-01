import { Request, Response, Router } from "express";
import BaseController from "./BaseController";
import { signupSchema } from "../validator/validator";
import AuthenticationServices from "../services/authentication.services";
import { hashpassword } from "../utils/bcrypt/hashpassword";
import { NextFunction } from "express-serve-static-core";
import * as crypto from "crypto";
import Email from "../utils/nodemailer/email";

export default class AuthenticationController extends BaseController {
  public path = "/auth";
  public router = Router();
  private authService: AuthenticationServices;

  constructor() {
    super();
    this.initiateRoute();
    this.authService = new AuthenticationServices();
  }

  // IMPLEMENTING FULL OOP BY HAVING THE CONTROLLER AND ROUTES IN THE SAME CLASS
  public initiateRoute() {
    this.router.post(`${this.path}/sign-up`, (...fromexpress) =>
      this.signupuser(...fromexpress)
    );
    this.router.post(`${this.path}/login`, this.loginAUser);
  }

  // SIGNUP A USER
  async signupuser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const payload = await signupSchema.validate(req.body);
      let { password, ...data } = payload;

      password = await hashpassword(password);

      await this.authService.Register({ password, ...data });

      return this.sendResponse(res, "success", 201, {
        message: "User successfully registered",
      });
    } catch (error: any) {
      next(error);
    }
  }

  private async loginAUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    const { username, email, password } = req.body;

    const user = await this.authService.loginAUser({
      username,
      email,
      password,
    });

    req.session.user = user;

    return this.sendResponse(res, "success", 200, {
      user,
    });
  }
}

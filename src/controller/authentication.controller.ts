import { Request, Response, Router } from "express";
import BaseController from "./BaseController";
import { signupSchema } from "../validator/validator";
import AuthenticationServices from "../services/authentication.services";
import { hashpassword } from "../utils/bcrypt/hashpassword";
import { NextFunction } from "express-serve-static-core";

interface RequestQuery {
  otp: number;
}

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
      this.HTTPsignupuser(...fromexpress)
    );
    this.router.post(`${this.path}/login`, (...args) =>
      this.HTTPloginAUser(...args)
    );
    this.router.patch(`${this.path}/verify-account`, (...fromexpress) => {
      this.HTTPVerifyAccount(...fromexpress);
    });
    this.router.post(`${this.path}/resend-otp`, (...args) => {
      this.HTTPResentOTP(...args);
    });
  }

  // SIGNUP A USER
  private async HTTPsignupuser(
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

  private async HTTPVerifyAccount(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const otp = req.query.otp;

      await this.authService.verifyAccount(otp);

      return this.sendResponse(res, "success", 200, {
        message: "Account has verified",
      });
    } catch (error) {
      next(error);
    }
  }

  private async HTTPResentOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.body.email;
      await this.authService.resendOTP(email);
      return this.sendResponse(res, "success", 200, {
        message: "OTP has been sent to your email",
      });
    } catch (error) {
      next(error);
    }
  }

  private async HTTPloginAUser(
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

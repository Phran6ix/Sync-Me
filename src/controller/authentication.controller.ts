import { Request, Response, Router } from "express";
import BaseController from "./BaseController";
import {
  signupSchema,
  loginSchema,
  resetPasswordSchema,
} from "../validator/validator";
import AuthenticationServices from "../services/authentication.services";
import { hashpassword } from "../utils/bcrypt/hashpassword";
import { NextFunction } from "express-serve-static-core";

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
    this.router.get(`${this.path}/forgot-password`, (...args) =>
      this.HTTPForgotPassword(...args)
    );
    this.router.patch(`${this.path}/reset-password`, (...args) =>
      this.HTTPResetPassword(...args)
    );
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

      return this.sendResponse(res, 201, {
        message: "User successfully registered",
      });
    } catch (error) {
      next(error);
    }
  }

  private async HTTPVerifyAccount(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const otp = "" + req.query.otp;

      const response = await this.authService.verifyAccount(otp);

      return this.sendResponse(res, 200, {
        message: "Account has been verified",
        user: response,
      });
    } catch (error) {
      next(error);
    }
  }

  private async HTTPResentOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.body.email;
      await this.authService.resendOTP(email);
      return this.sendResponse(res, 200, {
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
    try {
      const payload = await loginSchema.validate(req.body);

      const { email, password, username } = payload;
      const user = await this.authService.loginAUser({
        email,
        username,
        password,
      });

      return this.sendResponse(res, 200, {
        message: "User signed inl",
        user,
      });
    } catch (error) {
      next(error);
    }
  }
  private async HTTPForgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const { email } = req.body;

      await this.authService.forgotPassword(email);
      return this.sendResponse(res, 200, {
        message: "OTP has been sent to your email",
      });
    } catch (error) {
      next(error);
    }
  }

  private async HTTPResetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      let { password } = await resetPasswordSchema.validate(req.body);
      let id = "" + req.query.userid;

      password = await hashpassword(password);

      await this.authService.resetPassword(id, password);
      return this.sendResponse(res, 200, {
        message: "Password reset successful",
      });
    } catch (error) {
      next(error);
    }
  }
}

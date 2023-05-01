import express, { Response, Request } from "express";

import session from "express-session";

import controllerInterface from "./interfaces/controller.interface";
import AuthenticationController from "./controller/authentication.controller";
import { redisStore } from "./config/conect.redis";
import handleGlobalError from "./handler/errorHandler";
import { IUser } from "./interfaces/user.interface";
import { TUser } from "./modules/implementation/user.implementation";

declare global {
  namespace Express {
    interface Request {
      user?: {
        fullName: string;
        photo?: string;
        email: string;
        username: string;
        groups: [string];
        password: string;
        isVerified: boolean;
      };
    }
  }
}

declare module "express-session" {
  interface SessionData {
    user: TUser;
  }
}

const app = express();
app.use(express.json());

app.use(
  session({
    store: redisStore,
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    cookie: { path: "/", httpOnly: true, secure: false, maxAge: null },
  })
);

function runEndpoint(controllers: controllerInterface[]) {
  controllers.forEach((contoller) => {
    app.use("/", contoller.router);
  });
}

runEndpoint([new AuthenticationController()]);
app.use(handleGlobalError);

export default app;

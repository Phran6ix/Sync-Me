import express, { NextFunction, Request, Response } from "express";

import session from "express-session";
import morgan from "morgan";

import controllerInterface from "./interfaces/controller.interface";
import AuthenticationController from "./controller/authentication.controller";
import GroupController from "./controller/group.controller";
import UserController from "./controller/user.controller";
import { redisStore } from "./config/conect.redis";
import handleGlobalError from "./handler/errorHandler";

import { TUser } from "./modules/implementation/user.implementation";

declare global {
  namespace Express {
    interface Request {
      user?: TUser;
    }
  }
}

declare module "express-session" {
  interface SessionData {
    user?: TUser;
  }
}

const app = express();
app.use(express.json());

app.use(morgan("dev"));

app.use(
  session({
    store: redisStore,
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: { path: "/", httpOnly: true, secure: false, maxAge: 6000000 },
  })
);

function runEndpoint(controllers: controllerInterface[]) {
  controllers.forEach((contoller) => {
    app.use("/", contoller.router);
  });
}

// app.use('*', (req: Request, res: Response, next: NextFunction) => {
//   res.status(404).send('This Route is not Found, Please check the url and try again')
// })

runEndpoint([
  new AuthenticationController(),
  new GroupController(),
  new UserController(),
]);
app.use(handleGlobalError);

export default app;

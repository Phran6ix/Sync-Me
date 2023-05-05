import express from "express";

import session from "express-session";
import morgan from "morgan";

import controllerInterface from "./interfaces/controller.interface";
import AuthenticationController from "./controller/authentication.controller";
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
    cookie: { path: "/", httpOnly: true, secure: false, maxAge: 600000 },
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

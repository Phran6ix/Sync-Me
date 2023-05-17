import { Request, Response, NextFunction } from "express";
import HTTPException from "../exception/exceptions";
import UserRepo from "../modules/implementation/user.implementation";
import { TUser } from "../modules/implementation/user.implementation";

const user_repo = new UserRepo();
function protect(req: Request, res: Response, next: NextFunction): void {
  if (!req.session || !req.session.user) {
    throw new HTTPException("You are not logged in", 403);
  }

  if (req.user.isModified()) {
    user_repo.findUserById(req.user._id).then((res) => {
      req.user = res;
    });
  } else {
    req.user = req.session.user;
  }
  next();
}

export { protect };

import { Request, Response, NextFunction } from "express";
import HTTPException from "../exception/exceptions";
import UserRepo from "../modules/implementation/user.implementation";
import { TUser } from "../modules/implementation/user.implementation";
import JWTFunctions from "../helper/jwt";

const user_repo = new UserRepo();
async function protect(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  let token;
  if (!!req.headers && !!req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }

  const user = await JWTFunctions.verifyJWT(token);

  const verifiedUser = await user_repo.findUserByEmail(user.email);
  req.user = verifiedUser;

  next();
}

export { protect };

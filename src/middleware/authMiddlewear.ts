import { Request, Response, NextFunction } from "express";
import HTTPException from "../exception/exceptions";

function protect(req: Request, res: Response, next: NextFunction): void {
  if (!req.session && !req.session.user) {
    throw new HTTPException("You are not logged in", 403);
  }
  req.user = req.session.user;
  next();
}

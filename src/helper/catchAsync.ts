import { Request, Response, NextFunction } from "express";

export default function catchAsync(fn: any) {
  return (req: Request, res: Response, next: Function) => {
    return fn(req, res, next).catch(next);
  };
}

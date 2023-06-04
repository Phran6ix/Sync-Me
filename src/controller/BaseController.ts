import { Request, Response, NextFunction } from "express";

type data = {
  status: "success" | "failed";
  code: number;
  data: object;
};

abstract class BaseController {
  req: Request;
  res: Response;
  next: NextFunction;

  constructor() {}
  //  public readonly S
  public sendResponse<T>(res: Response, code: number, data?: T) {
    return res.status(code).json({
      success: `${code}`.includes("2") ? true : false || true,
      data: data,
    });
  }
}

export default BaseController;

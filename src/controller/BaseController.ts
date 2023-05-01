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
  public sendResponse<T>(res: Response, status: string, code: number, data: T) {
    return res.status(code | 500).json({
      success: `${status}`.includes("success") ? true : false || true,
      data: data,
    });
  }
}

export default BaseController;

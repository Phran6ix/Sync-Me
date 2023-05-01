import X from "../exception/exceptions";
import response from "../helper/response";

import { NextFunction, Request, Response } from "express";

function handleDuplicateError(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  err.message = `${Object.keys(err.keyValue)[0]} already exists`;
  err.statusCode = 400;

  return response(res, err.statusCode, false, {
    message: err.message,
  });
}

function sendResponse(error: any, res: Response) {
  return response(res, error.statusCode, false, {
    success: false,
    message: error.message,
    error,
  });
}

function handleGlobalError(
  error: X | any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { ...err } = error;
  if (error.code === 11000) return handleDuplicateError(err, req, res, next);

  error.statusCode = error.statusCode || 500;
  error.message = error.message || "An Error Occured, reach out to the admin";

  return sendResponse(error, res);
}

export default handleGlobalError;

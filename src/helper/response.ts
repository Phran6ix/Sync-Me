import { Response } from "express";

export default function response(
  res: Response,
  statusCode: number,
  status: boolean,
  data?: object | null | string
) {
  return res.status(statusCode).json({
    success: status,
    data,
  });
}

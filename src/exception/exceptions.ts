class HTTPException extends Error {
  statusCode: number;
  isOperational: boolean;
  success: string;
  constructor(message: string, code: number) {
    super(message);
    this.statusCode = code;
    this.isOperational = true;
    this.success = `${this.statusCode}`.startsWith("4") ? "fail" : "error";
    Error.captureStackTrace(this, this.constructor);
  }
}

export default HTTPException;

import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app.error";
import { sendErrorResponse } from "../utils/response";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error("❌ Error:", err);

  let statusCode = 500;
  let message = "Internal Server Error";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = err.message;
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate field value";
  }

  return sendErrorResponse(res, message, statusCode);
};

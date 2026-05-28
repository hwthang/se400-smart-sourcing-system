import { Response } from "express";

type Meta = {
  page?: number;
  limit?: number;
  total?: number;
  [key: string]: any;
};

export const sendResponse = <T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendListResponse = <T>(
  res: Response,
  items: T[],
  meta: Meta,
  message = "Success",
  statusCode = 200,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data: {
      items,
      meta,
    },
  });
};

export const sendErrorResponse = (
  res: Response,
  message = "Error",
  statusCode = 400,
) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

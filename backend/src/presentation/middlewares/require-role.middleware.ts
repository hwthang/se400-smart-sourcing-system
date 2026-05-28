import { AuthRequest } from "./authenticate.middleware";
import { Response, NextFunction } from "express";
import { AppError } from "../errors/app.error";

export const requireRole = (role: string) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
      return next(new AppError("Forbidden", 403));
    }
    next();
  };
};

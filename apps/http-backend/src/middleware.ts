import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

export function middleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["authorization"] ?? "";
  try {
    const decoded = jwt.verify(token, JWT_SECRET!) as { userId: string };

    if (decoded) {
      req.userId = decoded.userId;
      next();
    }
  } catch (error) {
    res.status(403).json({
      message: "unauthorized",
    });
  }
}

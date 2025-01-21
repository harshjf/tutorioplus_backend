import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";


export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization; 
  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Not authorized!",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Invalid or expired token",
      });
    }
    req.user = decoded;
    next();
  });
};

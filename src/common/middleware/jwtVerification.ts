import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";


export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1]; 

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "No token provided",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Invalid or expired token",
      });
    }

    // Attach decoded user info to request object
    //req.user = decoded;
    next();
  });
};

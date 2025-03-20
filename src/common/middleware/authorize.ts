import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

/**
 * Middleware to check if the user has the required role(s) to access a route.
 * @param {string[]} allowedRoles - Roles that are allowed to access the route.
 */
export const authorize = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
   
    if (!req.user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Not authorized! Token verification required.",
      });
    }

    const userRole = req.user.role_name; 
   console.log("user role",userRole);
    if (!allowedRoles.includes(userRole)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Access denied! You do not have permission to perform this action.",
      });
    }

    next();
  };
};

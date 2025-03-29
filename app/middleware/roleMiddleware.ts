import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { user } from "../utils/types";

interface CustomRequest extends Request {
  user?: user | JwtPayload;
}

// Reusable middleware for checking roles
const checkRole = (requiredRole: string) => {
  return (req: CustomRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).send("Unauthorized: No token provided");
      return;
    }

    if (typeof req.user === "object" && "role" in req.user) {
      if (req.user.role === requiredRole) {
        return next(); // Role matches, proceed
      }
    }

    res.status(403).send("Forbidden: Insufficient permissions");
  };
};

export default checkRole;

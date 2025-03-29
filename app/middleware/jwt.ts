import { NextFunction, Request, Response } from "express";
import { JwtPayload, verify, sign } from "jsonwebtoken";
import { user } from "../utils/types";

export const generateToken = (user: user): string => {
  return sign({ ...user }, "secret" as string, {
    expiresIn: "90d",
  });
};

interface CustomRequest extends Request {
  user?: string | JwtPayload;
}

const verifyJWT = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers["authorization"];

  if (!token) {
    res.status(403).send("Token is missing!");
    return; // Ensure no further execution
  }

  try {
    const decoded = verify(token.split(" ")[1], "secret");
    console.log(decoded);

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send("Invalid Token!");
  }
};

export default verifyJWT;

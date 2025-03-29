import { Request, Response, NextFunction } from "express";
interface CustomRequest extends Request {
  user?: user | JwtPayload;
}

import bcrypt from "bcrypt";
import {
  fireDB,
  collection,
  doc,
  query,
  where,
  getDocs,
  setDoc,
} from "../../config/database";
import { user } from "../../utils/types";
import { JwtPayload } from "jsonwebtoken";

export const getStaff = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userQuery = query(
      collection(fireDB, "users"),
      where("role", "==", "staff")
    );
    const userSnapshot = await getDocs(userQuery);

    const allStaff = userSnapshot.docs.map((snapshot) => ({
      id: snapshot.id,
      ...snapshot.data(),
    }));

    res.status(200).json({ data: allStaff, success: true });
  } catch (error: any) {
    console.error("Error in fetching Staff:", error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message,
    });
  }
};

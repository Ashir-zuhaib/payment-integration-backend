import { Request, Response } from "express";
import {
  fireDB,
  doc,
  getDoc,
  setDoc,
  query,
  collection,
  where,
  getDocs,
  updateDoc,
} from "../../config/database";
import { config } from "dotenv";
import bcrypt from "bcrypt";

export const addStaff = async (req: Request, res: Response): Promise<void> => {
    try {

      const { firstName, lastName, email, password, role } = req.body;
  console.log(req.body);
  
      if (!email || !password || !role) {
        res.status(400).json({ message: "Email, password and role are required." });
        return;
      }
   if (role !=="IaDdaRr5FMKAMFxHW55l") {
        res.status(400).json({ message: "Only Staff Can add" });
        return;
      }
  
      const existingUserQuery = query(
        collection(fireDB, "users"),
        where("email", "==", email)
      );
      const userSnapshot = await getDocs(existingUserQuery);
  
      if (!userSnapshot.empty) {
        res.status(400).json({
          message: "An account with this email already exists.",
          success: false,
        });
        return 
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const userRef = doc(collection(fireDB, "users"));
  
      await setDoc(userRef, {
        firstName,
        lastName,
        email,
        role,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
      });
  
      res.status(201).json({ message: "Staff registered successfully.", success: true });
    } catch (error: any) {
      console.error("Register Error:", error);
      res.status(500).json({ message: "Server error", success: false });
    }
  };
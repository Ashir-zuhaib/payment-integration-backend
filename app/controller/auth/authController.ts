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
  deleteDoc,
} from "../../config/database";
import { config } from "dotenv";
import bcrypt from "bcrypt";
import { generateUserData } from "../../services/auth/generateUserData";
import { user } from "../../utils/types";

config();

export const registerSignUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
console.log(req.body);

    if (!email || !password || !role) {
      res.status(400).json({ message: "Email, password and role are required." });
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

    res.status(201).json({ message: "User registered successfully.", success: true });
  } catch (error: any) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const loginFunction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password ) {
      res.status(400).json({ message: "All fields are required", success: false });
      return;
    }

    const userQuery = query(collection(fireDB, "users"), where("email", "==", email));
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      res.status(401).json({ message: "Invalid credentials", success: false });
      return;
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();
    userData.profileId = userDoc.id;
  
    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Incorrect password", success: false });
      return;
    }

   

    const data = await generateUserData(userData as user);

    res.status(200).json({
      message: "Login successful",
      success: true,
      user: data,
    });
  } catch (error: any) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!userId || !req.body) {
      res.status(400).json({ message: "Invalid update request." });
      return;
    }

    const userRef = doc(fireDB, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    await updateDoc(userRef, req.body);

    res.status(200).json({
      message: "User updated successfully.",
      success: true,
    });
  } catch (error: any) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({ message: "User ID is required." });
      return;
    }

    const userRef = doc(fireDB, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    await deleteDoc(userRef);

    res.status(200).json({
      message: "User deleted successfully.",
      success: true,
    });
  } catch (error: any) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};


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
  getDoc,
} from "../../config/database";
import { user } from "../../utils/types";
import { JwtPayload } from "jsonwebtoken";
import axios from "axios";

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

export const getAllPaymentLink = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const paymentLinkRef = req.user.role === "admin"?
      collection(fireDB, "paymentLinks"):
      query(collection(fireDB, "paymentLinks"), where("profileId", "==", req.user.profileId));
    
    const paymentLinkSnapshot = await getDocs(paymentLinkRef);
    const paymentLinks:any = paymentLinkSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const linksWithTransactions = await Promise.all(
      paymentLinks.map(async (link) => {
        if (link?.paymentIntent) {
          try {
            const response = await axios.get(
              `${process.env.PAYEX_BASEURL}/api/v1/Transactions?payment_intent=${link.paymentIntent}`,
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                  'Authorization': `Bearer ${process.env.PAYEX_API_KEY}`,
                },
              }
            );
           const docData = await getDoc(doc(fireDB, "paymentLinks", link?.profileId))
            return {
              ...link,
              transactionDetails: response?.data?.result[0] || null,
              generatedProfileData: docData?.data() || null,
            };
          } catch (error) {
            console.error(`Error fetching transaction for intent ${link.paymentIntent}:`, error);
            return {
              ...link,
              transactionDetails: null,
              generatedData:null
            };
          }
        }

        return link;
      })
    );
    res.status(200).json({
      message: 'Payment links fetched successfully.',
      data: linksWithTransactions,
    });
  } catch (error) {
    console.error('Error fetching payment links:', error);
    res.status(500).json({
      message: 'Failed to fetch payment links.',
      error: error.message,
    });
  }
}
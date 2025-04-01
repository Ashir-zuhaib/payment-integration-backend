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
    // 1. Fetch all links based on role
    const baseQuery =
      req.user.role === 'admin'
        ? collection(fireDB, 'paymentLinks')
        : query(collection(fireDB, 'paymentLinks'), where('profileId', '==', req.user.profileId));

    const paymentLinkSnapshot = await getDocs(baseQuery);
    const paymentLinks = paymentLinkSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // 2. For each payment link, enrich with transaction + profile (optional)
    const linksWithTransactions = await Promise.all(
      paymentLinks.map(async (link:any) => {
        let transactionDetails = null;
        let generatedProfileData = null;

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
            transactionDetails = response?.data?.result?.[0] || null;
          } catch (err) {
            console.error(`Failed to fetch transaction for intent ${link.paymentIntent}`, err);
          }
        }

        // 3. Optional: Fetch profile data
        if (link?.profileId) {
          try {
            const docRef = doc(fireDB, 'users', link.profileId);
            const profileSnapshot = await getDoc(docRef);
            const profileDoc = profileSnapshot.exists()?profileSnapshot.data():null;
            console.log("Profile Document:", profileDoc);
            
            generatedProfileData = profileDoc
          } catch (err) {
            console.error(`Failed to fetch profile for ${link.profileId}`, err);
          }
        }

        return {
          ...link,
          transactionDetails,
          generatedProfileData,
        };
      })
    );

    res.status(200).json({
      message: 'Payment links fetched successfully.',
      data: linksWithTransactions,
    });
  } catch (error: any) {
    console.error('Error fetching payment links:', error);
    res.status(500).json({
      message: 'Failed to fetch payment links.',
      error: error.message,
    });
  }
};

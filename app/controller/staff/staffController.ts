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
  addDoc,
} from "../../config/database";
import { config } from "dotenv";
import bcrypt from "bcrypt";

import axios from 'axios';
import { user } from "../../utils/types";
interface CustomRequest extends Request {
  user: user}
export const addStaff = async (req: Request, res: Response): Promise<void> => {
    try {

      const { firstName, lastName, email, password, role } = req.body;
  console.log(req.body);
  
      if (!email || !password || !role) {
        res.status(400).json({ message: "Email, password and role are required." });
        return;
      }
   if (role !=="staff") {
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


export const generatePaymentLink = async (req: CustomRequest, res: Response): Promise<void> => {
  if (req.body.paymentMethod !== 'PayEx') {
    res.status(400).json({ message: 'Invalid payment type.' });
    return;
  }

  console.log('Incoming Request:', req.body);


  const payload = [
    {
      amount: Math.round(parseFloat(req.body.amount) * 100), // Convert to cents
      currency: req.body.currency || 'MYR',
      customer_name: req.body.fullName,
      email: req.body.email,
      payment_type: req.body.paymentType || 'card',
      contact_number: req.body.contactNumber,
      description: req.body.description,
      reference_number: req.body.refrenceNo,
      return_url: `${process.env.APP_URL}/dashboard/generate`,
      reject_url: `${process.env.APP_URL}/payment/failed`,
    },
  ];

  try {
    const response = await axios.post(
      `${process.env.PAYEX_BASEURL}/api/v1/PaymentIntents`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${process.env.PAYEX_API_KEY}`,
        },
      }
    );

    console.log('PayEx response:', response.data);
if(response.data?.message !== 'Success') {
      res.status(400).json({
        message: 'Error from PayEx: ' + response.data?.message,
        data: response.data,
      });
      return;
    }
    const paymentRef = collection(fireDB, "paymentLinks")
    await addDoc(paymentRef, {
      paymentLink: response.data?.result[0]?.url,
      paymentIntent: response.data?.result[0]?.key,
      amount: req.body.amount,
      currency: req.body.currency || 'MYR',
      fullName: req.body.fullName,
      description: req.body.description,
      refrenceNo: req.body.refrenceNo,
      email: req.body.email,
      paymentType: req.body.paymentType || 'card',
      contactNumber: req.body.contactNumber,
      profileId:req.user.profileId,
      createdAt: new Date().toISOString(),
    });
 
    res.status(200).json({
      message: 'Payment link generated successfully.',
      data:  response.data?.result[0]?.url,
    });
  } catch (error: any) {
    console.error('PayEx error:', error?.response?.data || error.message);
    res.status(error?.response?.status || 500).json({
      message: 'Failed to generate payment link.',
      error: error?.response?.data || error.message,
    });
  }
};

export const getPaymentTypes = (req:Request , res: Response) => {
  if(!req.query.paymentMethod) {
    res.status(400).json({ message: 'Payment method is required.' });
    return;
  }  
    const paymentMethod = req.query.paymentMethod
    if(paymentMethod == 'payex'){
       axios.get(`${process.env.PAYEX_BASEURL}/api/v1/Merchants/TransactionTypes`, {
        headers: {
          'Content-Type': 'application/json', 
          'Accept': 'application/json',
          'Authorization': `Bearer ${process.env.PAYEX_API_KEY}`,
        },  
      })
      .then(response => {
        res.status(200).json({
          message: 'Payment types fetched successfully.',
          data: response.data,
        });
      })
      .catch(error => { 
        console.error('Error fetching payment types:', error);
        res.status(500).json({
          message: 'Failed to fetch payment types.',
          error: error.message,
        });
      })
    }}


    export const getPaymentLink = async (req: CustomRequest, res: Response): Promise<void> => {
      try {
        const paymentLinkRef = query(
          collection(fireDB, "paymentLinks"),
          where("profileId", "==", req.user.profileId)
        );
        const paymentLinkSnapshot = await getDocs(paymentLinkRef);
    
        const paymentLinks: any[] = paymentLinkSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
    
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
    
                return {
                  ...link,
                  transactionDetails: response?.data?.result[0] || null,
                };
              } catch (error) {
                console.error(`Error fetching transaction for intent ${link.paymentIntent}:`, error);
                return {
                  ...link,
                  transactionDetails: null,
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
    };
    
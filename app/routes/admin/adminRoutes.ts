import verifyJWT from "../../middleware/jwt";
import {  getAllPaymentLink, getStaff } from "../../controller/admin/adminController";
import { Router } from "express";
import isAdmin from "../../middleware/isAddmin";

const adminRoute = Router();

// adminRoute.post("/admin/register-center", verifyJWT, isAdmin, addNewCenter);
// adminRoute.post("/admin/register-center", verifyJWT, isAdmin, addNewCenter);
adminRoute.get("/admin/getStaff", verifyJWT, isAdmin, getStaff);
adminRoute.get("/admin/getAllPaymentLink", verifyJWT, getAllPaymentLink);
adminRoute.post("/login");
adminRoute.get("/profile");

export default adminRoute;

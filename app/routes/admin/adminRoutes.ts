import verifyJWT from "../../middleware/jwt";
import { getDonors } from "../../controller/admin/adminController";
import { Router } from "express";
import isAdmin from "../../middleware/isAddmin";

const adminRoute = Router();

// adminRoute.post("/admin/register-center", verifyJWT, isAdmin, addNewCenter);
// adminRoute.post("/admin/register-center", verifyJWT, isAdmin, addNewCenter);
adminRoute.get("/admin/all-donors", verifyJWT, isAdmin, getDonors);
adminRoute.post("/login");
adminRoute.get("/profile");

export default adminRoute;

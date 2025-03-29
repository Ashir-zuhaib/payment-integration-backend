
import { Router } from "express";
import { addStaff, generatePaymentLink, getPaymentTypes } from "../../controller/staff/staffController";
import verifyJWT from "../../middleware/jwt";

const staffRoute = Router();

staffRoute.post("/add", addStaff);
staffRoute.post("/generateLink",verifyJWT, generatePaymentLink);
staffRoute.get("/getPaymentTypes", getPaymentTypes);
// staffRoute.post("/login", loginFunction);
export default staffRoute;

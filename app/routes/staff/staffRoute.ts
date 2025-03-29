
import { Router } from "express";
import { addStaff, generatePaymentLink, getPaymentTypes } from "../../controller/staff/staffController";

const staffRoute = Router();

staffRoute.post("/add", addStaff);
staffRoute.post("/generateLink", generatePaymentLink);
staffRoute.get("/getPaymentTypes", getPaymentTypes);
// staffRoute.post("/login", loginFunction);
export default staffRoute;

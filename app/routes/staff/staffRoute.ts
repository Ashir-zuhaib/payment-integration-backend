
import { Router } from "express";
import { addStaff } from "../../controller/staff/staffController";

const staffRoute = Router();

staffRoute.post("/add", addStaff);
// staffRoute.post("/login", loginFunction);
export default staffRoute;

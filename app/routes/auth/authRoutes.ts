import verifyJWT from "../../middleware/jwt";
import {
  loginFunction,
  registerSignUp,
  updateUser,
} from "../../controller/auth/authController";
import { Router } from "express";

const authRoute = Router();

authRoute.post("/signup", registerSignUp);
authRoute.post("/login", loginFunction);
authRoute.post("/update-user/:userId", verifyJWT, updateUser);
export default authRoute;

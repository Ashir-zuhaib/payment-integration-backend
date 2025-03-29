import { Router } from "express";
import adminRoute from "./admin/adminRoutes";
import authRoute from "./auth/authRoutes";
import staffRoute from "./staff/staffRoute";


const router = Router();

// Use authentication routes
router.use("/api", adminRoute);
router.use("/api/auth", authRoute);
router.use("/api/staff", staffRoute);


export default router;

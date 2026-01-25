import express from "express";
import { registerUser, loginUser, getMe, verifyOtp } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginUser);

// Protected route
router.get("/me", protect, getMe);

export default router;

import express from "express";
import { onboardUser } from "../controllers/onboardingController.js";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// only admins can onboard new users
router.post("/", authMiddleware, adminMiddleware, onboardUser);

export default router;

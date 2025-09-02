import express from "express";
import { onboardUser } from "../controllers/onboardingController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// only admins can onboard new users
router.post("/", protect, adminOnly, onboardUser);

export default router;

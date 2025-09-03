import express from "express";
import { startOnboarding, getOnboardingStatus } from "../controllers/onboardingController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// start onboarding (async background steps)
router.post("/", protect, adminOnly, startOnboarding);

// poll status
router.get("/:id", protect, adminOnly, getOnboardingStatus);

export default router;

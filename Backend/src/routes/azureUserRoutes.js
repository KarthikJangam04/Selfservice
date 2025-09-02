import express from "express";
import { createAzureUserAndAssignReader } from "../controllers/azureUserController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only admins can create Azure users
router.post("/onboard-user", protect, adminOnly, createAzureUserAndAssignReader);

export default router;


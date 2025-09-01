import express from "express";
import { signup, login } from "../controllers/authController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Signup
router.post("/signup", signup);

// Login
router.post("/login", login);

// Test protected route (any logged-in user)
router.get("/me", protect, (req, res) => {
  res.json({ message: "Welcome, authenticated user!", user: req.user });
});

// Test admin-only route
router.get("/admin-test", protect, adminOnly, (req, res) => {
  res.json({ message: "Welcome Admin! You have access 🚀" });
});

export default router;

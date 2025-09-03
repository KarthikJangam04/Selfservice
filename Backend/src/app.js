import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import onboardingRoutes from "./routes/onboardingRoutes.js";
import azureTestRoutes from "./routes/azureTestRoutes.js";
import azureUserRoutes from "./routes/azureUserRoutes.js";
import vpnRoutes from "./routes/vpnRoutes.js";
import vpnTestRoutes from "./routes/vpnTestRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/azure", azureTestRoutes);
app.use("/api/azure", azureUserRoutes);
app.use("/api/vpn", vpnRoutes);
app.use("/api/vpn", vpnTestRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running 🚀" });
});

export default app;

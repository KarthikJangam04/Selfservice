import express from "express";
import { runSSHCommand } from "../utils/sshClient.js";
import { generateVPNConfig } from "../controllers/vpnController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";


const router = express.Router();

router.get("/test", async (req, res) => {
  try {
    const result = await runSSHCommand({ command: "echo Hello from OpenVPN VM" });
    res.json({ message: "SSH Test Successful ✅", output: result });
  } catch (error) {
    res.status(500).json({ message: "SSH Test Failed ❌", error: error.message });
  }
});

router.post("/generate", protect, adminOnly, generateVPNConfig);


export default router;

// routes/vpnTestRoutes.js
import express from "express";
import { runSSHCommand } from "../utils/sshClient.js";

const router = express.Router();

router.get("/test-script", async (req, res) => {
  try {
    // Use sudo to run the script with a dummy username
    const output = await runSSHCommand({
      command: `sudo /root/client-configs/create_vpn_user.sh testscriptuser`,
    });

    res.json({
      message: "✅ Script executed via Node (with sudo)",
      output,
    });
  } catch (err) {
    console.error("Script execution failed:", err.message);
    res.status(500).json({
      message: "❌ Script execution failed",
      error: err.message,
    });
  }
});

export default router;

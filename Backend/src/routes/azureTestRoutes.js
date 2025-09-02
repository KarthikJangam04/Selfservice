import express from "express";
import axios from "axios";

const router = express.Router();

// Test Microsoft Graph auth
router.get("/test-graph", async (req, res) => {
  try {
    // 1. Request an access token
    const tokenResponse = await axios.post(
      `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`,
      new URLSearchParams({
        client_id: process.env.AZURE_CLIENT_ID,
        client_secret: process.env.AZURE_CLIENT_SECRET,
        scope: "https://graph.microsoft.com/.default",
        grant_type: "client_credentials",
      })
    );

    const accessToken = tokenResponse.data.access_token;

    // 2. Call Graph API
    const graphResponse = await axios.get("https://graph.microsoft.com/v1.0/users", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    res.json({
      message: "Graph API call successful ✅",
      users: graphResponse.data.value,
    });
  } catch (error) {
    console.error("Graph API test failed:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

export default router;

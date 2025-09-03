import { runSSHCommand, downloadFile } from "../utils/sshClient.js";
import { uploadToBlob } from "../utils/azureBlob.js";
import path from "path";
import fs from "fs";
import os from "os";

export const generateVPNConfig = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  // ✅ Extract username from email (before @)
  const username = email.split("@")[0];

  try {
    // 1. Run script on VPN server
    await runSSHCommand({
      command: `sudo /root/client-configs/create_vpn_user.sh ${username}`,
    });

    // 2. Path to generated .ovpn file in openvpn’s home dir
    const remotePath = `/home/openvpn/vpn-files/${username}.ovpn`;
    const localPath = path.join(os.tmpdir(), `${username}.ovpn`);

    // 3. Download from VM to backend
    await downloadFile({ remotePath, localPath });

    // 4. Upload to Azure Blob
    const blobName = `vpn-configs/${username}.ovpn`;
    await uploadToBlob(localPath, blobName);

    // 5. Clean up local temp file
    try {
      fs.unlinkSync(localPath);
      console.log(`🧹 Cleaned up local temp file: ${localPath}`);
    } catch (cleanupErr) {
      console.warn(`⚠️ Could not delete temp file: ${localPath}`, cleanupErr.message);
    }

    // 6. Respond to client
    res.json({
      message: "✅ VPN config created and uploaded",
      blobName,
      downloadUrl: `https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/${process.env.AZURE_BLOB_CONTAINER}/${blobName}`,
    });
  } catch (err) {
    console.error("VPN config generation failed:", err.message);
    res.status(500).json({
      message: "VPN config generation failed",
      error: err.message,
    });
  }
};

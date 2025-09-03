// src/utils/azureBlobTest.js
import { BlobServiceClient } from "@azure/storage-blob";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.AZURE_BLOB_CONTAINER;

// ✅ Correct relative path (file is inside Backend/src/)
const localFilePath = path.resolve("src/OpenVpn_Setup.pdf");

export const uploadPDF = async () => {
  try {
    if (!connectionString) {
      throw new Error("AZURE_STORAGE_CONNECTION_STRING is missing");
    }

    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Create container if not exists
    await containerClient.createIfNotExists();

    // Blob name = file name
    const blobName = path.basename(localFilePath); // "OpenVpn_Setup.pdf"
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Upload
    await blockBlobClient.uploadFile(localFilePath);

    console.log(`✅ Uploaded file: ${blobName} to container: ${containerName}`);
  } catch (err) {
    console.error("❌ Upload failed:", err.message);
  }
};

uploadPDF();

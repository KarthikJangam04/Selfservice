import { BlobServiceClient } from "@azure/storage-blob";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.AZURE_BLOB_CONTAINER;

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
const containerClient = blobServiceClient.getContainerClient(containerName);

// Ensure container exists
await containerClient.createIfNotExists();


//Upload file to Azure Blob
 
export const uploadToBlob = async (localFilePath, blobName) => {
  try {
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadFile(localFilePath);
    console.log(`✅ Uploaded: ${blobName}`);
    return blobName;
  } catch (err) {
    console.error("❌ Upload failed:", err.message);
    throw err;
  }
};

export const downloadFromBlob = async (blobName, downloadPath) => {
  try {
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.downloadToFile(downloadPath);
    console.log(`📥 Downloaded: ${blobName} to ${downloadPath}`);
    return downloadPath;
  } catch (err) {
    console.error("❌ Download failed:", err.message);
    throw err;
  }
};

import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

// Load env variables
dotenv.config();

// Connect DB
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

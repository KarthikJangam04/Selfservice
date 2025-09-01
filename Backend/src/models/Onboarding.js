import mongoose from "mongoose";

const stepSchema = new mongoose.Schema({
  action: { type: String, required: true }, // e.g. "Create Azure AD user"
  status: { type: String, enum: ["pending", "success", "error"], default: "pending" },
  timestamp: { type: Date, default: Date.now },
});

const onboardingSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  team: { type: String, required: true },
  steps: [stepSchema],
  status: { type: String, enum: ["pending", "in-progress", "success", "error"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Onboarding", onboardingSchema);

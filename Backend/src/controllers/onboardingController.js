import Onboarding from "../models/Onboarding.js";
import axios from "axios";

// Start onboarding
export const startOnboarding = async (req, res) => {
  const { firstName, lastName, email, team } = req.body;

  try {
    const onboarding = new Onboarding({
      firstName,
      lastName,
      email,
      team,
      status: "in-progress",
      steps: [
        { action: "Create Azure AD user", status: "pending" },
        { action: "Grant OpenVPN access", status: "pending" },
        { action: "Invite to GitHub team", status: "pending" },
      ],
    });

    await onboarding.save();

    // ✅ Respond with full object so frontend gets initial status & steps
    res.status(201).json({
      _id: onboarding._id,
      status: onboarding.status,
      steps: onboarding.steps,
      message: "Onboarding started",
    });

    // Run async steps
    runOnboardingSteps(onboarding._id, { firstName, lastName, email }, req.headers.authorization);
  } catch (err) {
    console.error("Onboarding start error:", err);
    res.status(500).json({ message: "Failed to start onboarding", error: err.message });
  }
};

// Background runner
const runOnboardingSteps = async (id, userData, authHeader) => {
  const onboarding = await Onboarding.findById(id);
  if (!onboarding) return;

  // Step 1: Azure
  try {
    await axios.post(
      "http://localhost:5000/api/azure/onboard-user",
      { firstName: userData.firstName, lastName: userData.lastName, email: userData.email },
      { headers: { Authorization: authHeader } }
    );
    onboarding.steps[0].status = "success";
  } catch (err) {
    onboarding.steps[0].status = "error";
    onboarding.status = "error";
    await onboarding.save();
    return;
  }
  await onboarding.save();

  // Step 2: VPN
  try {
    const vpnRes = await axios.post(
      "http://localhost:5000/api/vpn/generate",
      { email: userData.email },
      { headers: { Authorization: authHeader } }
    );

    onboarding.steps[1].status = "success";
    onboarding.steps[1].downloadUrl = vpnRes.data.downloadUrl;
  } catch (err) {
    onboarding.steps[1].status = "error";
    onboarding.status = "error";
    await onboarding.save();
    return;
  }
  await onboarding.save();

  // Step 3: GitHub (mock for now)
  try {
    onboarding.steps[2].status = "success";
  } catch {
    onboarding.steps[2].status = "error";
  }

  onboarding.status = onboarding.steps.every((s) => s.status === "success")
    ? "success"
    : "error";

  await onboarding.save();
};

// Polling endpoint
export const getOnboardingStatus = async (req, res) => {
  try {
    const onboarding = await Onboarding.findById(req.params.id);
    if (!onboarding) return res.status(404).json({ message: "Onboarding not found" });

    res.json({
      status: onboarding.status,
      steps: onboarding.steps,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch onboarding status", error: err.message });
  }
};

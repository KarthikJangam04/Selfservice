import Onboarding from "../models/Onboarding.js";

// helper function to simulate async step
const simulateStep = async (action, delay = 1000, fail = false) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (fail) {
        reject(`${action} failed`);
      } else {
        resolve(`${action} completed`);
      }
    }, delay);
  });
};

export const onboardUser = async (req, res) => {
  const { firstName, lastName, email, team } = req.body;

  try {
    // Create onboarding entry
    const onboarding = new Onboarding({
      firstName,
      lastName,
      email,
      team,
      status: "in-progress",
      steps: [
        { action: "Create Azure AD user" },
        { action: "Grant OpenVPN access" },
        { action: "Invite to GitHub team" },
      ],
    });

    await onboarding.save();

    const logs = [];

    try {
      const azureResult = await simulateStep("Azure AD user created", 1000);
      onboarding.steps[0].status = "success";
      logs.push(`✅ ${azureResult}`);
    } catch (err) {
      onboarding.steps[0].status = "error";
      logs.push(`❌ ${err}`);
    }

    try {
      const vpnResult = await simulateStep("OpenVPN access granted", 1000);
      onboarding.steps[1].status = "success";
      logs.push(`✅ ${vpnResult}`);
    } catch (err) {
      onboarding.steps[1].status = "error";
      logs.push(`❌ ${err}`);
    }

    try {
      const githubResult = await simulateStep("GitHub invite sent", 1000);
      onboarding.steps[2].status = "success";
      logs.push(`✅ ${githubResult}`);
    } catch (err) {
      onboarding.steps[2].status = "error";
      logs.push(`❌ ${err}`);
    }

    onboarding.status = onboarding.steps.every((s) => s.status === "success")
      ? "success"
      : "error";

    await onboarding.save();

    res.status(201).json({
      message: "Onboarding process completed",
      status: onboarding.status,
      logs,
    });
  } catch (error) {
    console.error("Onboarding error:", error);
    res.status(500).json({ message: "Onboarding failed", error: error.message });
  }
};

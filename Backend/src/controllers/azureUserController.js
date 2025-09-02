import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export const createAzureUserAndAssignReader = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const localPart = email.split("@")[0];
    const entraDomain = process.env.AZURE_ENTRA_DOMAIN;
    const userPrincipalName = `${localPart}@${entraDomain}`;

    // 1. Get Graph API token
    const graphTokenResponse = await axios.post(
      `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`,
      new URLSearchParams({
        client_id: process.env.AZURE_CLIENT_ID,
        client_secret: process.env.AZURE_CLIENT_SECRET,
        scope: "https://graph.microsoft.com/.default",
        grant_type: "client_credentials",
      })
    );
    const graphToken = graphTokenResponse.data.access_token;

    // 2. Create Entra ID user
    const userResponse = await axios.post(
      "https://graph.microsoft.com/v1.0/users",
      {
        accountEnabled: true,
        displayName: `${firstName} ${lastName}`,
        mailNickname: localPart,
        userPrincipalName,
        passwordProfile: {
          forceChangePasswordNextSignIn: true,
          password: password || "Default@12345",
        },
      },
      { headers: { Authorization: `Bearer ${graphToken}` } }
    );

    const userId = userResponse.data.id;

    // 3. Get Azure Management token
    const mgmtTokenResponse = await axios.post(
      `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`,
      new URLSearchParams({
        client_id: process.env.AZURE_CLIENT_ID,
        client_secret: process.env.AZURE_CLIENT_SECRET,
        scope: "https://management.azure.com/.default",
        grant_type: "client_credentials",
      })
    );
    const mgmtToken = mgmtTokenResponse.data.access_token;

    // 4. Assign Reader Role at subscription level
    const roleAssignmentId = uuidv4();
    const subscriptionId = process.env.AZURE_SUBSCRIPTION_ID;

    const roleResponse = await axios.put(
      `https://management.azure.com/subscriptions/${subscriptionId}/providers/Microsoft.Authorization/roleAssignments/${roleAssignmentId}?api-version=2020-04-01-preview`,
      {
        properties: {
          roleDefinitionId: `/subscriptions/${subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/acdd72a7-3385-48ef-bd42-f606fba81ae7`, // Reader Role
          principalId: userId,
        },
      },
      { headers: { Authorization: `Bearer ${mgmtToken}` } }
    );

    res.json({
      message: "✅ User created and assigned Reader role",
      user: userResponse.data,
      roleAssignment: roleResponse.data,
    });
  } catch (error) {
    console.error("Azure onboarding error:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
};

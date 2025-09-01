import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Start onboarding
export const onboardUserAsync = createAsyncThunk(
  "admin/onboardUser",
  async ({ firstName, lastName, email, team }, { getState }) => {
    const token = getState().login.user?.token; // get JWT from login state

    const response = await fetch("http://localhost:5000/api/admin/onboard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ firstName, lastName, email, team }),
    });

    if (!response.ok) throw new Error("Failed to start onboarding");

    return await response.json(); // returns { message, logId }
  }
);

// Fetch log by ID
export const fetchOnboardingLogAsync = createAsyncThunk(
  "admin/fetchOnboardingLog",
  async (logId, { getState }) => {
    const token = getState().login.user?.token;

    const response = await fetch(`http://localhost:5000/api/admin/onboard/${logId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to fetch log");

    return await response.json();
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    status: "idle",
    logId: null,
    logs: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Onboard user
      .addCase(onboardUserAsync.pending, (state) => {
        state.status = "in-progress";
        state.logs = [];
        state.logId = null;
      })
      .addCase(onboardUserAsync.fulfilled, (state, action) => {
        state.status = "in-progress";
        state.logId = action.payload.logId;
      })
      .addCase(onboardUserAsync.rejected, (state) => {
        state.status = "error";
      })

      // Fetch logs
      .addCase(fetchOnboardingLogAsync.fulfilled, (state, action) => {
        state.logs = action.payload.steps || [];
        state.status = action.payload.status;
      });
  },
});

export default adminSlice.reducer;

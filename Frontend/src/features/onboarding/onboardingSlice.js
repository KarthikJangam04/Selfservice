import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async action (later will call backend API)
export const onboardUserAsync = createAsyncThunk(
  "admin/onboardUser",
  async (email) => {
    // Mock API call for now
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return { email, status: "success" };
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    status: "idle", // idle | in-progress | success | error
    logs: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(onboardUserAsync.pending, (state) => {
        state.status = "in-progress";
      })
      .addCase(onboardUserAsync.fulfilled, (state, action) => {
        state.status = "success";
        state.logs.push(`✅ User onboarded: ${action.payload.email}`);
      })
      .addCase(onboardUserAsync.rejected, (state) => {
        state.status = "error";
        state.logs.push("❌ Onboarding failed.");
      });
  },
});

export default adminSlice.reducer;

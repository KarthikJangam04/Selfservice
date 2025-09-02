import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Start onboarding
export const onboardUserAsync = createAsyncThunk(
  "onboarding/onboardUser",
  async ({ firstName, lastName, email, team }, { getState, rejectWithValue }) => {
    try {
      const token = getState().login.token; // ✅ fixed (not user?.token)

      const response = await fetch("http://localhost:5000/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ send correct token
        },
        body: JSON.stringify({ firstName, lastName, email, team }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to start onboarding");
      }

      return await response.json(); // { message, status, logs }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState: {
    status: "idle",
    logs: [],
    error: null,
  },
  reducers: {
    resetOnboarding: (state) => {
      state.status = "idle";
      state.logs = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(onboardUserAsync.pending, (state) => {
        state.status = "in-progress";
        state.logs = [];
        state.error = null;
      })
      .addCase(onboardUserAsync.fulfilled, (state, action) => {
        state.status = action.payload.status;
        state.logs = action.payload.logs;
      })
      .addCase(onboardUserAsync.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
      });
  },
});

export const { resetOnboarding } = onboardingSlice.actions;
export default onboardingSlice.reducer;

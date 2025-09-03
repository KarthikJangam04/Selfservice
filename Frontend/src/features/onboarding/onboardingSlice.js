import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Start onboarding
export const onboardUserAsync = createAsyncThunk(
  "onboarding/onboardUser",
  async ({ firstName, lastName, email, team }, { getState, rejectWithValue }) => {
    try {
      const token = getState().login.token;

      const response = await fetch("http://localhost:5000/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ firstName, lastName, email, team }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to start onboarding");
      }

      return await response.json(); // ✅ now backend returns { _id, status, steps }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Poll onboarding status
export const fetchOnboardingStatusAsync = createAsyncThunk(
  "onboarding/fetchStatus",
  async (onboardingId, { getState, rejectWithValue }) => {
    try {
      const token = getState().login.token;

      const response = await fetch(
        `http://localhost:5000/api/onboarding/${onboardingId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to fetch onboarding status");
      }

      return await response.json(); // { status, steps }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState: {
    status: "idle",
    steps: [],
    onboardingId: null,
    error: null,
  },
  reducers: {
    resetOnboarding: (state) => {
      state.status = "idle";
      state.steps = [];
      state.onboardingId = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(onboardUserAsync.pending, (state) => {
        state.status = "in-progress";
        state.steps = [];
        state.onboardingId = null;
        state.error = null;
      })
      .addCase(onboardUserAsync.fulfilled, (state, action) => {
        state.status = action.payload.status || "in-progress";
        state.steps = action.payload.steps || [];
        state.onboardingId = action.payload._id || null;
      })
      .addCase(onboardUserAsync.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
      })
      .addCase(fetchOnboardingStatusAsync.fulfilled, (state, action) => {
        state.status = action.payload.status;
        state.steps = action.payload.steps || [];
      })
      .addCase(fetchOnboardingStatusAsync.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
      });
  },
});

export const { resetOnboarding } = onboardingSlice.actions;
export default onboardingSlice.reducer;

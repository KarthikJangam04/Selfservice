import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stats: {},
  loading: false,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setStats: (state, action) => {
      state.stats = action.payload;
    },
  },
});

export const { setStats } = dashboardSlice.actions;
export default dashboardSlice.reducer;

import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../features/login/loginSlice";
import adminReducer from "../features/onboarding/onboardingSlice";

export const store = configureStore({
  reducer: {
    login: loginReducer,
    admin: adminReducer,
  },
});
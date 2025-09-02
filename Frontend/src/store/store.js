import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../features/login/loginSlice";
import onboardingReducer from "../features/onboarding/onboardingSlice";


export const store = configureStore({
  reducer: {
    login: loginReducer,
    onboarding: onboardingReducer,
  },
});
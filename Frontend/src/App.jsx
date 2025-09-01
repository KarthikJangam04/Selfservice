import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/LoginPage"
import DashboardPage from "./pages/DashboardPage";
import PageNotFound from "./pages/PageNotFound";
import OnboardingPage from "./pages/OnboardingPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
        <LoginPage />
    ),
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/onboarding",
    element: <OnboardingPage />,
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
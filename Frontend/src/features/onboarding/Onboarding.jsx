import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  onboardUserAsync,
  resetOnboarding,
  fetchOnboardingStatusAsync,
} from "./onboardingSlice";
import Navbar from "../../components/Navbar";
import { Loader2, CheckCircle, XCircle } from "lucide-react"; // ✅ professional icons

export default function Onboarding() {
  const dispatch = useDispatch();
  const { status, steps, error, onboardingId } = useSelector(
    (state) => state.onboarding
  );

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [team, setTeam] = useState("Select");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && team !== "Select") {
      dispatch(onboardUserAsync({ firstName, lastName, email, team }));
    }
  };

  const handleReset = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setTeam("Select");
    dispatch(resetOnboarding());
  };

  // Poll for onboarding progress
  useEffect(() => {
    let interval;
    if (onboardingId && status === "in-progress") {
      interval = setInterval(() => {
        dispatch(fetchOnboardingStatusAsync(onboardingId));
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [dispatch, onboardingId, status]);

  const getStepUI = (step, i) => {
    const isPending = step.status === "pending";
    const isSuccess = step.status === "success";
    const isError = step.status === "error";

    return (
      <div
        key={i}
        className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col space-y-2"
      >
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">{step.action}</span>
          {isPending && <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />}
          {isSuccess && <CheckCircle className="h-5 w-5 text-emerald-400" />}
          {isError && <XCircle className="h-5 w-5 text-red-400" />}
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-700 rounded overflow-hidden">
          <div
            className={`h-2 transition-all duration-500 ${
              isPending
                ? "bg-blue-500 animate-pulse w-1/2"
                : isSuccess
                ? "bg-emerald-500 w-full"
                : isError
                ? "bg-red-500 w-full"
                : "w-0"
            }`}
          ></div>
        </div>

        {/* VPN Download link */}
        {step.action.includes("VPN") &&
          step.status === "success" &&
          step.downloadUrl && (
            <a
              href={step.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 text-xs underline"
            >
              Download VPN config
            </a>
          )}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-200">
      <Navbar />

      <main className="flex-1 px-6 py-12 sm:py-16 lg:px-8 mt-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            User Onboarding
          </h2>
          <p className="mt-2 text-lg text-gray-400">
            Quickly onboard a new joiner with one click.
          </p>
        </div>

        {/* Form */}
        {(status === "idle" || status === "error") && (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-16 max-w-xl space-y-6"
          >
            {/* Inputs */}
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-white">
                  First name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-2 block w-full rounded-md bg-white/5 px-3 py-2 text-white border border-gray-700 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white">
                  Last name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-2 block w-full rounded-md bg-white/5 px-3 py-2 text-white border border-gray-700 focus:border-indigo-500"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-white">
                  Company Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="newuser@tatvacare.in"
                  className="mt-2 block w-full rounded-md bg-white/5 px-3 py-2 text-white border border-gray-700 focus:border-indigo-500"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-white">
                  Team
                </label>
                <select
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  className="mt-2 block w-full rounded-md bg-white/5 px-3 py-2 text-white border border-gray-700 focus:border-indigo-500"
                >
                  <option value="Select">Select</option>
                  <option>Practice</option>
                  <option>Goodflip</option>
                  <option>Evalus</option>
                  <option>Zyvelor</option>
                  <option>Pillup</option>
                  <option>Pedia</option>
                </select>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <div className="mt-10">
              <button
                type="submit"
                disabled={status === "in-progress"}
                className="block w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                {status === "in-progress" ? "Onboarding..." : "Onboard User"}
              </button>
            </div>
          </form>
        )}

        {/* Step cards */}
        {Array.isArray(steps) && steps.length > 0 && (
          <div className="mx-auto mt-8 max-w-2xl space-y-4">
            {steps.map((step, i) => getStepUI(step, i))}
          </div>
        )}

        {Array.isArray(steps) && steps.length > 0 && status !== "in-progress" && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-sm text-white"
            >
              Start New Onboarding
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

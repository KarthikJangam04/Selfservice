import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onboardUserAsync, resetOnboarding } from "./onboardingSlice";
import Navbar from "../../components/Navbar";

export default function Onboarding() {
  const dispatch = useDispatch();
  const { status, logs, error } = useSelector((state) => state.onboarding);

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
                  placeholder="newuser@company.com"
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

        {/* Logs */}
        <div className="mx-auto mt-8 max-w-xl">
          {logs.length > 0 && (
            <div className="bg-gray-800 rounded-md p-3 text-sm space-y-2">
              {logs.map((log, i) => (
                <p
                  key={i}
                  className={
                    log.includes("✅")
                      ? "text-green-400"
                      : log.includes("❌")
                      ? "text-red-400"
                      : "text-yellow-400"
                  }
                >
                  {log}
                </p>
              ))}
            </div>
          )}
          {logs.length > 0 && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-sm text-white"
              >
                Start New Onboarding
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

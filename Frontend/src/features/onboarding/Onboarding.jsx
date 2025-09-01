import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onboardUserAsync } from "./onboardingSlice";
import Navbar from "../../components/Navbar";

export default function Onboarding() {
  const dispatch = useDispatch();
  const { status, logs } = useSelector((state) => state.admin);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [team, setTeam] = useState("Dev");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      dispatch(onboardUserAsync({ firstName, lastName, email, team }));
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-200">
      {/* Navbar at top */}
      <Navbar />

      {/* Page content */}
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
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-16 max-w-xl space-y-6"
        >
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            {/* First Name */}
            <div>
              <label
                htmlFor="first-name"
                className="block text-sm font-semibold text-white"
              >
                First name
              </label>
              <input
                id="first-name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-2 block w-full rounded-md bg-white/5 px-3 py-2 text-white outline-none placeholder:text-gray-500 border border-gray-700 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <label
                htmlFor="last-name"
                className="block text-sm font-semibold text-white"
              >
                Last name
              </label>
              <input
                id="last-name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-2 block w-full rounded-md bg-white/5 px-3 py-2 text-white outline-none placeholder:text-gray-500 border border-gray-700 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            {/* Email */}
            <div className="sm:col-span-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-white"
              >
                Company Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="newuser@company.com"
                className="mt-2 block w-full rounded-md bg-white/5 px-3 py-2 text-white outline-none placeholder:text-gray-500 border border-gray-700 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            {/* Team */}
            <div className="sm:col-span-2">
              <label
                htmlFor="team"
                className="block text-sm font-semibold text-white"
              >
                Team
              </label>
              <select
                id="team"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                className="mt-2 block w-full rounded-md bg-white/5 px-3 py-2 text-white outline-none border border-gray-700 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option>Select</option>
                <option>Practice</option>
                <option>Goodflip</option>
                <option>Evalus</option>
                <option>Zyvelor</option>
                <option>Pillup</option>
                <option>Pedia</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-10">
            <button
              type="submit"
              disabled={status === "in-progress"}
              className="block w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 disabled:opacity-50"
            >
              {status === "in-progress" ? "Onboarding..." : "Onboard User"}
            </button>
          </div>
        </form>

        {/* Status + Logs */}
        <div className="mx-auto mt-8 max-w-xl">
          {status === "success" && (
            <p className="text-green-400">✅ User onboarded successfully!</p>
          )}
          {status === "error" && (
            <p className="text-red-400">❌ Failed to onboard user.</p>
          )}
          {logs.length > 0 && (
            <div className="mt-4 bg-gray-800 rounded-md p-3 text-sm text-gray-300 space-y-1">
              {logs.map((log, i) => (
                <p key={i}>{log}</p>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

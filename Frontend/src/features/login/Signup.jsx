import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [status, setStatus]       = useState("idle");
  const [error, setError]         = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      if (!response.ok) {
        throw new Error("Signup failed");
      }

      await response.json();
      setStatus("succeeded");
      navigate("/login"); // redirect after signup
    } catch (err) {
      setError(err.message);
      setStatus("failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900">
      <div className="w-full h-full bg-gray-800 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo + Title */}
          <div className="text-center">
            <img
              alt="Your Company"
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
              className="mx-auto h-12 w-auto"
            />
            <h2 className="mt-6 text-2xl font-bold tracking-tight text-white">
              Create your account
            </h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* First Name */}
            <div>
              <label className="text-sm font-medium text-gray-200">
                First Name
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-2 block w-full rounded-md bg-gray-700 px-3 py-2 text-white placeholder-gray-400 outline-none ring-1 ring-gray-600 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="text-sm font-medium text-gray-200">
                Last Name
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-2 block w-full rounded-md bg-gray-700 px-3 py-2 text-white placeholder-gray-400 outline-none ring-1 ring-gray-600 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-200">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 block w-full rounded-md bg-gray-700 px-3 py-2 text-white placeholder-gray-400 outline-none ring-1 ring-gray-600 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-200">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 block w-full rounded-md bg-gray-700 px-3 py-2 text-white placeholder-gray-400 outline-none ring-1 ring-gray-600 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full flex justify-center rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {status === "loading" ? "Signing up..." : "Sign up"}
            </button>
          </form>

          {/* Link to Login */}
          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/")}
              className="font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

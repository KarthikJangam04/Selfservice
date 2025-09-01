import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "./loginSlice";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // For now, mock login (later integrate backend / Azure AD)
    if (email && password) {
      dispatch(
        loginSuccess({
          name: "XYZ", // replace with backend data later
          email: email,
        })
      );
      navigate("/dashboard"); // redirect to dashboard
    }
  };

  return (
    // fixed inset-0 ensures the component fills the entire viewport (overrides body margins)
    <div className="fixed inset-0 bg-gray-900">
      {/* full-screen inner background */}
      <div className="w-full h-full bg-gray-800 flex items-center justify-center p-8">
        {/* content container kept narrow for readability but placed on a full-page background */}
        <div className="w-full max-w-md">
          {/* Logo + Title */}
          <div className="text-center">
            <img
              alt="Your Company"
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
              className="mx-auto h-12 w-auto"
            />
            <h2 className="mt-6 text-2xl font-bold tracking-tight text-white">
              Sign in to your account
            </h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              {/* make email label aligned left like password: use flex with a placeholder on the right */}
              <div className="flex items-center justify-between">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-200"
                >
                  Email address
                </label>
                {/* invisible placeholder to keep the same spacing as the password row */}
                <span className="text-sm text-transparent">Placeholder</span>
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 block w-full rounded-md bg-gray-700 px-3 py-2 text-white placeholder-gray-400 outline-none ring-1 ring-gray-600 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-200"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-sm font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 block w-full rounded-md bg-gray-700 px-3 py-2 text-white placeholder-gray-400 outline-none ring-1 ring-gray-600 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
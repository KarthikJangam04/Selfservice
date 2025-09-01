import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function Dashboard() {
  const user = useSelector((state) => state.login.user);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-200 w-full overflow-x-hidden">
      <Navbar />
      {/* add top padding to avoid overlap with fixed navbar (h-16) */}
      <main className="flex-1 pt-20 p-6 space-y-6">
        <h1 className="text-3xl font-bold text-white mb-6">
          Welcome, {user?.name || "Guest"} 👋
        </h1>

        {/* Onboarding Box */}
        <div className="w-full rounded-lg bg-gray-800 p-8 shadow-lg flex items-center justify-between border border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-white">
              New Onboarding
            </h2>
            <p className="mt-2 text-gray-400 text-sm">
              Quickly onboard a new joiner with one click.
            </p>
          </div>
          <button
            onClick={() => navigate("/onboarding")}
            className="ml-4 rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Proceed
          </button>
        </div>

        {/* Deploy Container Service Box */}
        <div className="w-full rounded-lg bg-gray-800 p-8 shadow-lg flex items-center justify-between border border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Deploy Container Service
            </h2>
            <p className="mt-2 text-gray-400 text-sm">
              Create a new Azure Container App service for your project.
            </p>
          </div>
          <button
            onClick={() => navigate("/deploy")}
            className="ml-4 rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Proceed
          </button>
        </div>
      </main>
    </div>
  );
}

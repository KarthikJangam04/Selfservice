import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const user = useSelector((state) => state.login.user);

  if (!user) {
    // not logged in → send to login
    return <Navigate to="/login" replace />;
  }

  return children;
}

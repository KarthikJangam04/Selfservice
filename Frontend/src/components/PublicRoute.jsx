import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const user = useSelector((state) => state.login.user);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ role, children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (role && user.role !== role) {
    const fallback =
      user.role === "admin"
        ? "/admin"
        : user.role === "dokter"
          ? "/doctor"
          : "/patient";

    return <Navigate to={fallback} replace />;
  }

  return children;
}

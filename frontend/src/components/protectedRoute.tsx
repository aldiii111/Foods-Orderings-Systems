import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";

export function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: ("customer" | "staff")[];
}) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(role as "customer" | "staff")) {
    return <Navigate to="/choose-role" />;
  }

  return children;
}
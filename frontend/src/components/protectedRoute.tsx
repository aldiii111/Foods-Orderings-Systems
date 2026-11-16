import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";

export function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: ("customer" | "staff" | "admin")[];
}) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const normalizedRole = role?.toLowerCase();
  const isAllowed = allowedRoles.some((r) => {
    const roleLower = r.toLowerCase();
    if (roleLower === normalizedRole) return true;
    if (roleLower === "staff" && (normalizedRole === "admin" || normalizedRole === "super_admin")) return true;
    return false;
  });

  if (!isAllowed) {
    return <Navigate to="/choose-role" />;
  }

  return children;
}
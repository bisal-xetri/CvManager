import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/store";

export function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { user } = useAppSelector((state) => state.auth);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

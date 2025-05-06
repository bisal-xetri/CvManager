import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";

interface AuthLoaderProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const AuthLoader: React.FC<AuthLoaderProps> = ({
  children,
  requireAuth = true,
}) => {
  const navigate = useNavigate();
  const { loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !isAuthenticated) {
        navigate("/login");
      } else if (!requireAuth && isAuthenticated) {
        navigate("/dashboard");
      }
    }
  }, [loading, isAuthenticated, navigate, requireAuth]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col space-y-4 w-[300px]">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-5/6" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

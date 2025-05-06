import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      setIsLoading(false);

      if (!token && window.location.pathname !== "/login") {
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

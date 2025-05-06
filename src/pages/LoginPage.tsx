// src/pages/LoginPage.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import LoginForm from "@/components/auth/LoginForm";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md p-8">
        <LoginForm />
      </Card>
    </div>
  );
}

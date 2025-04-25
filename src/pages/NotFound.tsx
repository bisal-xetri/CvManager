import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { Footer } from "@/components/layout/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div>
      <nav className="bg-white shadow-sm border-b">
        <div className="hrm-container py-4 pl-10 pr-10">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-hrm-purple">
                CV Nexus
              </span>
              <span className="ml-1 text-sm text-gray-600">HR Hub</span>
            </Link>
            <Link to="/login">
              <Button className="w-full bg-purple-500 hover:bg-purple-700">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          <h1 className="text-6xl font-bold text-hrm-purple">404</h1>
          <p className="text-xl text-gray-700 mt-4 mb-8">
            Oops! The page you're looking for doesn't exist.
          </p>
          <Link to="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;

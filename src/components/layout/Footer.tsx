import { Link } from "react-router-dom";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t mt-auto">
      <div className="hrm-container py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="ml-10  mb-4 md:mb-0">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-hrm-purple">
                CV Nexus
              </span>
              <span className="ml-1 text-sm text-gray-600">HR Hub</span>
            </Link>
          </div>
          <div className="text-gray-500 text-sm mr-10">
            &copy; {currentYear} CV Nexus HR Hub. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

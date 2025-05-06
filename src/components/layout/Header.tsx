import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/store";
import { fetchCandidates } from "@/store/slices/candidatesSlice";
import { signOut } from "@/store/slices/authSlice";
import { Search, Menu, X, User, LogOut, Settings } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const { user } = useAppSelector((state) => state.auth);
  const { candidates } = useAppSelector((state) => state.candidates);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCandidates());
  }, [dispatch]);

  const handleSignOut = () => {
    dispatch(signOut());
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const searchGlobally = (query: string) => {
    if (!query.trim()) return [];
    const searchTerm = query.trim().toLowerCase();
    return candidates.filter(
      (candidate) =>
        candidate.name.toLowerCase().includes(searchTerm) ||
        candidate.email.toLowerCase().includes(searchTerm) ||
        candidate.technology.toLowerCase().includes(searchTerm) ||
        candidate.level.toLowerCase().includes(searchTerm)
    );
  };

  const matchingCandidates = searchGlobally(searchTerm);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    if (matchingCandidates.length > 0) {
      navigate(`/candidates/${matchingCandidates[0].id}`);
      setSearchTerm("");
      setShowDropdown(false);
    } else {
      alert("No candidate found.");
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-hrm-purple">
                CV Nexus
              </span>
              <span className="ml-1 text-sm text-gray-600">HR Hub</span>
            </Link>
          </div>

          {/* Center: Search */}
          <div className="hidden md:flex flex-grow justify-center relative">
            <form className="relative w-full max-w-md" onSubmit={handleSubmit}>
              <Input
                type="search"
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className="pl-10"
              />
              <button
                type="submit"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>

            {/* Search results dropdown */}
            {showDropdown && searchTerm && matchingCandidates.length > 0 && (
              <div className="absolute mt-10 w-full max-w-md bg-white border rounded shadow z-50">
                {matchingCandidates.map((candidate) => (
                  <Link
                    key={candidate.id}
                    to={`/candidates/${candidate.id}`}
                    className="block p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSearchTerm("");
                      setShowDropdown(false);
                    }}
                  >
                    <div className="font-medium">{candidate.name}</div>
                    <div className="text-sm text-gray-500">
                      {candidate.technology} • {candidate.level}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* No Results */}
            {showDropdown && searchTerm && matchingCandidates.length === 0 && (
              <div className="absolute mt-10 w-full max-w-md bg-white border rounded shadow z-50 p-2 text-center text-gray-500">
                No candidates found.
              </div>
            )}
          </div>

          {/* Right: User Menu */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search */}
            <form className="w-full md:hidden" onSubmit={handleSubmit}>
              <Input
                type="search"
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true);
                }}
                className="pl-10"
              />
            </form>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <span className="relative bg-gray-600 h-8 w-8 rounded-full cursor-pointer">
                  <Avatar className="h-8 w-8">
                    {user?.photoURL ? (
                      <AvatarImage
                        src={user.photoURL || "https://i.pravatar.cc/300"}
                        alt={user.displayName || ""}
                      />
                    ) : (
                      <AvatarFallback className="bg-primary/10">
                        {user?.displayName?.charAt(0) ||
                          user?.email?.charAt(0) ||
                          "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.displayName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-500"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu toggle */}
            <span className="md:hidden" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden py-3 px-4 border-t border-gray-200 bg-gray-50">
          <nav className="flex flex-col space-y-2">
            <Link
              to="/dashboard"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/candidates"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Candidates
            </Link>
            <Link
              to="/assessments"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Assessments
            </Link>
            <Link
              to="/interviews"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Interviews
            </Link>
            <Link
              to="/offers"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Offers
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

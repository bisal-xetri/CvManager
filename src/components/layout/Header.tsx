import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/store";
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleSignOut = () => {
    dispatch(signOut());
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and main navigation */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-hrm-purple">
                CV Nexus
              </span>
              <span className="ml-1 text-sm text-gray-600">HR Hub</span>
            </Link>

            {/* Desktop navigation */}
            <nav className="hidden md:ml-8 md:flex md:space-x-8">
              <Link
                to="/dashboard"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
              >
                Dashboard
              </Link>
              <Link
                to="/candidates"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
              >
                Candidates
              </Link>
              <Link
                to="/assessments"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
              >
                Assessments
              </Link>
              <Link
                to="/interviews"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
              >
                Interviews
              </Link>
              <Link
                to="/offers"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
              >
                Offers
              </Link>
            </nav>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              {isSearchOpen ? (
                <div className="absolute right-0 top-0 w-64 flex">
                  <Input
                    type="search"
                    placeholder="Search candidates..."
                    className="w-full"
                    autoFocus
                  />
                  <span onClick={toggleSearch} className="ml-2 cursor-pointer">
                    <X className="h-4 w-4" />
                  </span>
                </div>
              ) : (
                <span
                  onClick={toggleSearch}
                  className="hidden md:flex cursor-pointer"
                >
                  <Search className="h-5 w-5" />
                </span>
              )}
            </div>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <span className="relative bg-gray-600 h-8 w-8 rounded-full cursor-pointer">
                  <Avatar className="h-8 w-8">
                    {user?.photoURL ? (
                      <AvatarImage
                        src={
                          user.photoURL ||
                          "https://static.vecteezy.com/system/resources/previews/026/619/142/original/default-avatar-profile-icon-of-social-media-user-photo-image-vector.jpg"
                        }
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
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
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

      {/* Mobile menu */}
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
            <div className="relative w-full py-2">
              <Input
                type="search"
                placeholder="Search candidates..."
                className="w-full"
              />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

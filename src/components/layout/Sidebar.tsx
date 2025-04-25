import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  CalendarDays,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Candidates", href: "/candidates", icon: Users },
    { name: "Assessments", href: "/assessments", icon: ClipboardCheck },
    { name: "Interviews", href: "/interviews", icon: CalendarDays },
    { name: "Offers", href: "/offers", icon: FileText },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300 hidden md:flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {navigation.map((item) => {
            const isActive =
              location.pathname === item.href ||
              location.pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
                )}
              >
                <item.icon
                  className={cn(
                    "flex-shrink-0 h-5 w-5 mr-3",
                    collapsed && "mr-0 mx-auto"
                  )}
                />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <Button
          size="sm"
          onClick={toggleSidebar}
          className="w-full justify-center"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5 mr-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

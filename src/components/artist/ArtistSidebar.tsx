import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarCheck,
  Clock,
  MessageSquare,
  Star,
  DollarSign,
  UserCircle,
} from "lucide-react";

const sidebarLinks = [
  { name: "Dashboard", path: "/artist-dashboard", icon: LayoutDashboard },
  { name: "My Bookings", path: "/artist-dashboard/bookings", icon: CalendarCheck },
  { name: "Availability", path: "/artist-dashboard/availability", icon: Clock },
  { name: "Messages", path: "/artist-dashboard/messages", icon: MessageSquare },
  { name: "Reviews", path: "/artist-dashboard/reviews", icon: Star },
  { name: "Earnings", path: "/artist-dashboard/earnings", icon: DollarSign },
  { name: "Profile", path: "/artist-dashboard/profile", icon: UserCircle },
];

export function ArtistSidebar() {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-sidebar border-r border-sidebar-border min-h-screen">
      <div className="p-6 border-b border-sidebar-border">
        <h2 className="font-display text-xl font-semibold text-gradient-rose">
          Artist Portal
        </h2>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {sidebarLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.name}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

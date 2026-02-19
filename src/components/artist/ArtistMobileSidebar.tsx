import { NavLink, useLocation } from "react-router-dom";
import { X, LayoutDashboard, CalendarCheck, Clock, MessageSquare, Star, DollarSign, UserCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const sidebarLinks = [
  { name: "Dashboard", path: "/artist-dashboard", icon: LayoutDashboard },
  { name: "My Bookings", path: "/artist-dashboard/bookings", icon: CalendarCheck },
  { name: "Availability", path: "/artist-dashboard/availability", icon: Clock },
  { name: "Messages", path: "/artist-dashboard/messages", icon: MessageSquare },
  { name: "Reviews", path: "/artist-dashboard/reviews", icon: Star },
  { name: "Earnings", path: "/artist-dashboard/earnings", icon: DollarSign },
  { name: "Profile", path: "/artist-dashboard/profile", icon: UserCircle },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ArtistMobileSidebar({ open, onClose }: Props) {
  const location = useLocation();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border z-50 lg:hidden flex flex-col"
          >
            <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-gradient-rose">Artist Portal</h2>
              <button onClick={onClose} className="text-sidebar-foreground"><X className="h-5 w-5" /></button>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              {sidebarLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={onClose}
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
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

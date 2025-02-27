
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { 
  Home, 
  Users, 
  Calendar, 
  Menu, 
  X, 
  LogOut,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserRole } from "@/lib/types";
import BadgeIcon from "./BadgeIcon";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: UserRole;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children,
  role = "admin" 
}) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const adminLinks = [
    { 
      path: "/admin", 
      label: "Home", 
      icon: <Home className="h-5 w-5" /> 
    },
    { 
      path: "/admin/teachers", 
      label: "Teachers", 
      icon: <Users className="h-5 w-5" /> 
    },
    { 
      path: "/admin/schedules", 
      label: "Schedules", 
      icon: <Calendar className="h-5 w-5" /> 
    }
  ];

  const teacherLinks = [
    { 
      path: "/teacher", 
      label: "Home", 
      icon: <Home className="h-5 w-5" /> 
    },
    { 
      path: "/teacher/students", 
      label: "Students", 
      icon: <Users className="h-5 w-5" /> 
    },
    { 
      path: "/teacher/schedules", 
      label: "Schedules", 
      icon: <Calendar className="h-5 w-5" /> 
    }
  ];

  const studentLinks = [
    { 
      path: "/student", 
      label: "Home", 
      icon: <Home className="h-5 w-5" /> 
    },
    { 
      path: "/student/classes", 
      label: "Classes", 
      icon: <Calendar className="h-5 w-5" /> 
    },
    { 
      path: "/student/profile", 
      label: "Profile", 
      icon: <User className="h-5 w-5" /> 
    }
  ];

  const navigationLinks = {
    admin: adminLinks,
    teacher: teacherLinks,
    student: studentLinks
  }[role];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between px-4 sm:px-6 h-16">
          <div className="flex items-center gap-2">
            <button 
              className="md:hidden p-2 rounded-md hover:bg-slate-100 transition-colors"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-slate-700" />
              ) : (
                <Menu className="h-5 w-5 text-slate-700" />
              )}
            </button>
            <span className="text-xl font-semibold text-slate-900">
              Fitness<span className="text-primary">Hub</span>
            </span>
          </div>
          
          <Link to="/login" className="flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Link>
        </div>
      </header>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200"
          >
            <nav className="px-4 py-3">
              <ul className="space-y-1">
                {navigationLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
                        location.pathname === link.path
                          ? "bg-primary text-white"
                          : "text-slate-700 hover:bg-slate-100"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex-1 flex">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:block w-64 border-r border-slate-200 bg-white">
          <nav className="h-full py-6 px-3">
            <ul className="space-y-1">
              {navigationLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
                      location.pathname === link.path
                        ? "bg-primary text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    )}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 sm:p-6">
          <div className="mx-auto max-w-7xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
      
      {/* Bottom Tab Navigation (mobile) */}
      <nav className="md:hidden bg-white border-t border-slate-200 fixed bottom-0 left-0 right-0 z-10">
        <ul className="flex justify-around px-4 py-2">
          {navigationLinks.map((link) => (
            <li key={link.path}>
              <Link to={link.path} className="block text-center">
                <BadgeIcon
                  icon={link.icon} 
                  label={link.label}
                  color={location.pathname === link.path ? "bg-primary" : "bg-slate-200"}
                  className="p-1"
                />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Padding to account for bottom navigation on mobile */}
      <div className="md:hidden h-24" />
    </div>
  );
};

export default DashboardLayout;

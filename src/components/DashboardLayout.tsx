import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Dumbbell, 
  Menu, 
  X,
  LayoutDashboard,
  Users,
  CalendarDays,
  CreditCard,
  Settings,
  Bell,
  UserCircle2,
  LogOut
} from 'lucide-react'; 
import UserMenu from './UserMenu';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import NotificationsMenu from './NotificationsMenu';
import SettingsDialog from './SettingsDialog';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: 'admin' | 'teacher' | 'student';
}

const DASHBOARD_NAV_ITEMS: Record<string, { name: string; href: string; icon: React.ForwardRefExoticComponent<Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
    ref?: React.Ref<SVGSVGElement> | undefined;
}>; }[]> = {
  admin: [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Teachers', href: '/admin/teachers', icon: Users },
    { name: 'Students', href: '/admin/students', icon: Users },
    { name: 'Schedules', href: '/admin/schedules', icon: CalendarDays },
    { name: 'Payments', href: '/admin/payments', icon: CreditCard },
  ],
  teacher: [
    { name: 'Dashboard', href: '/teacher', icon: LayoutDashboard },
    { name: 'Classes', href: '/teacher/classes', icon: CalendarDays },
    { name: 'Profile', href: '/teacher/profile', icon: UserCircle2 },
  ],
  student: [
    { name: 'Dashboard', href: '/student', icon: LayoutDashboard },
    { name: 'Classes', href: '/student/classes', icon: CalendarDays },
    { name: 'Payments', href: '/student/payments', icon: CreditCard },
    { name: 'Profile', href: '/student/profile', icon: UserCircle2 },
  ],
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, role }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <NavLink 
                to="/" 
                className="flex items-center text-slate-900 font-semibold"
              >
                <Dumbbell className="h-6 w-6 mr-2 text-primary" />
                <span>FitnessHub</span>
              </NavLink>
              
              <nav className="hidden md:flex ml-10 space-x-8">
                {DASHBOARD_NAV_ITEMS[role].map(item => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    className={({ isActive }) => 
                      `${
                        isActive 
                          ? 'text-primary border-b-2 border-primary' 
                          : 'text-slate-600 hover:text-slate-900'
                      } inline-flex items-center px-1 pt-1 text-sm font-medium`
                    }
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <SettingsDialog />
                <NotificationsMenu role={role} />
              </div>
              
              <UserMenu />
              
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden bg-white p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {DASHBOARD_NAV_ITEMS[role].map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) => 
                    `${
                      isActive 
                        ? 'bg-slate-50 border-l-4 border-primary text-primary' 
                        : 'border-l-4 border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800'
                    } block pl-3 pr-4 py-2 text-base font-medium`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </div>
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </header>
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      
      <footer className="bg-white border-t border-slate-200 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-slate-500">
            &copy; {new Date().getFullYear()} FitnessHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;

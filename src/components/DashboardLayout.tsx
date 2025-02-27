
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { 
  Home, 
  Users, 
  Calendar, 
  Menu, 
  X, 
  LogOut,
  User,
  Bell,
  Settings,
  Search,
  Sun,
  Moon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserRole } from "@/lib/types";
import BadgeIcon from "./BadgeIcon";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: UserRole;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children,
  role = "admin" 
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile, signOut, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Se estiver carregando, mostrar indicador
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Se não estiver autenticado, redirecionar para login
  if (!userProfile) {
    navigate('/login');
    return null;
  }

  // Verificar se o papel do usuário corresponde ao papel esperado
  if (userProfile.role !== role) {
    // Redireciona para o dashboard correto baseado no papel do usuário
    const dashboardPaths: Record<UserRole, string> = {
      admin: "/admin",
      teacher: "/teacher",
      student: "/student"
    };
    navigate(dashboardPaths[userProfile.role as UserRole]);
    return null;
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Aplicar classe dark ao HTML
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const adminLinks = [
    { 
      path: "/admin", 
      label: "Dashboard", 
      icon: <Home className="h-5 w-5" /> 
    },
    { 
      path: "/admin/teachers", 
      label: "Professores", 
      icon: <Users className="h-5 w-5" /> 
    },
    { 
      path: "/admin/schedules", 
      label: "Horários", 
      icon: <Calendar className="h-5 w-5" /> 
    },
    { 
      path: "/admin/students", 
      label: "Alunos", 
      icon: <Users className="h-5 w-5" /> 
    }
  ];

  const teacherLinks = [
    { 
      path: "/teacher", 
      label: "Dashboard", 
      icon: <Home className="h-5 w-5" /> 
    },
    { 
      path: "/teacher/students", 
      label: "Alunos", 
      icon: <Users className="h-5 w-5" /> 
    },
    { 
      path: "/teacher/schedules", 
      label: "Meus Horários", 
      icon: <Calendar className="h-5 w-5" /> 
    }
  ];

  const studentLinks = [
    { 
      path: "/student", 
      label: "Dashboard", 
      icon: <Home className="h-5 w-5" /> 
    },
    { 
      path: "/student/classes", 
      label: "Aulas", 
      icon: <Calendar className="h-5 w-5" /> 
    },
    { 
      path: "/student/profile", 
      label: "Perfil", 
      icon: <User className="h-5 w-5" /> 
    }
  ];

  const navigationLinks = {
    admin: adminLinks,
    teacher: teacherLinks,
    student: studentLinks
  }[role] || [];

  return (
    <div className={cn(
      "min-h-screen flex flex-col bg-slate-50 text-slate-900",
      isDarkMode && "dark bg-slate-900 text-slate-50"
    )}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center justify-between px-4 sm:px-6 h-16">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-slate-700 dark:text-slate-300" />
              ) : (
                <Menu className="h-5 w-5 text-slate-700 dark:text-slate-300" />
              )}
            </button>
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              Fitness<span className="text-primary">Hub</span>
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <Bell className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
              </button>
            </div>
            
            <button 
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              onClick={toggleDarkMode}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-slate-300" />
              ) : (
                <Moon className="h-5 w-5 text-slate-700" />
              )}
            </button>
            
            <div className="hidden sm:flex items-center gap-2">
              {userProfile && (
                <div className="flex items-center">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userProfile.avatar_url} alt={userProfile.name} />
                    <AvatarFallback>{userProfile.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="ml-2 text-sm font-medium hidden md:block dark:text-slate-300">
                    {userProfile.name}
                  </span>
                </div>
              )}
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-slate-700 dark:text-slate-300 hover:text-primary"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700"
          >
            <nav className="px-4 py-3">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                  />
                </div>
              </div>
              <ul className="space-y-1">
                {navigationLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium",
                        location.pathname === link.path
                          ? "bg-primary text-white"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              
              {userProfile && (
                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3 px-3 py-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={userProfile.avatar_url} alt={userProfile.name} />
                      <AvatarFallback>{userProfile.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{userProfile.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{userProfile.email}</p>
                    </div>
                  </div>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex-1 flex">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:block w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 shrink-0">
          <div className="h-16 border-b border-slate-200 dark:border-slate-700 px-6 flex items-center">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
              />
            </div>
          </div>
          
          <nav className="p-4">
            <div className="mb-6">
              <p className="px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Menu Principal
              </p>
              <ul className="space-y-1">
                {navigationLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium",
                        location.pathname === link.path
                          ? "bg-primary text-white"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      )}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <p className="px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Configurações
              </p>
              <ul className="space-y-1">
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <Settings className="h-5 w-5" />
                    Configurações
                  </a>
                </li>
              </ul>
            </div>
            
            {userProfile && (
              <div className="absolute bottom-0 left-0 w-full p-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={userProfile.avatar_url} alt={userProfile.name} />
                    <AvatarFallback>{userProfile.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{userProfile.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{userProfile.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <LogOut className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  </button>
                </div>
              </div>
            )}
          </nav>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-slate-900 p-4 sm:p-6">
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
      <nav className="md:hidden bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 fixed bottom-0 left-0 right-0 z-10 shadow-lg">
        <ul className="flex justify-around px-2 py-1">
          {navigationLinks.map((link) => (
            <li key={link.path}>
              <Link to={link.path}>
                <BadgeIcon
                  icon={link.icon} 
                  label={link.label}
                  color={location.pathname === link.path ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"}
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

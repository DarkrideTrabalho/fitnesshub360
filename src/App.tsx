
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import TeachersPage from "./pages/admin/Teachers";
import SchedulesPage from "./pages/admin/Schedules";
import NotFound from "./pages/NotFound";

// Inicializa o cliente de consultas
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Componente para verificar autenticação
const PrivateRoute = ({ children, role }: { children: React.ReactNode, role: string }) => {
  // Verificar se o usuário está autenticado
  const userJson = localStorage.getItem('currentUser');
  
  if (!userJson) {
    // Não está autenticado, redireciona para login
    return <Navigate to="/login" replace />;
  }
  
  // Está autenticado, verifica o papel (role)
  try {
    const user = JSON.parse(userJson);
    if (user.role !== role) {
      // Redireciona para o dashboard correto baseado no papel
      const dashboardPaths: Record<string, string> = {
        admin: "/admin",
        teacher: "/teacher",
        student: "/student"
      };
      return <Navigate to={dashboardPaths[user.role] || "/"} replace />;
    }
    
    // Papel correto, renderiza o componente filho
    return <>{children}</>;
  } catch (error) {
    console.error("Erro ao verificar autenticação:", error);
    // Em caso de erro, redireciona para login
    return <Navigate to="/login" replace />;
  }
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          } />
          <Route path="/admin/teachers" element={
            <PrivateRoute role="admin">
              <TeachersPage />
            </PrivateRoute>
          } />
          <Route path="/admin/schedules" element={
            <PrivateRoute role="admin">
              <SchedulesPage />
            </PrivateRoute>
          } />
          
          {/* Teacher Routes */}
          <Route path="/teacher" element={
            <PrivateRoute role="teacher">
              <div>Teacher Dashboard (Em breve)</div>
            </PrivateRoute>
          } />
          
          {/* Student Routes */}
          <Route path="/student" element={
            <PrivateRoute role="student">
              <div>Student Dashboard (Em breve)</div>
            </PrivateRoute>
          } />
          
          {/* Catch-all Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

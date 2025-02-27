
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            
            {/* Admin Routes */}
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/admin/teachers" element={<TeachersPage />} />
            <Route path="/admin/schedules" element={<SchedulesPage />} />
            
            {/* Teacher Routes */}
            <Route path="/teacher/*" element={<div>Teacher Dashboard (Em breve)</div>} />
            
            {/* Student Routes */}
            <Route path="/student/*" element={<div>Student Dashboard (Em breve)</div>} />
            
            {/* Catch-all Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

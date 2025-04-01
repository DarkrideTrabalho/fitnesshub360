
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import TeachersPage from "./pages/admin/Teachers";
import SchedulesPage from "./pages/admin/Schedules";
import StudentsPage from "./pages/admin/Students";
import NotFound from "./pages/NotFound";

const App = () => (
  <BrowserRouter>
    <TooltipProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/teachers" element={<TeachersPage />} />
        <Route path="/admin/students" element={<StudentsPage />} />
        <Route path="/admin/schedules" element={<SchedulesPage />} />
        
        {/* Teacher Routes */}
        <Route path="/teacher/*" element={<div>Teacher Dashboard (Em breve)</div>} />
        
        {/* Student Routes */}
        <Route path="/student/*" element={<div>Student Dashboard (Em breve)</div>} />
        
        {/* Catch-all Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </BrowserRouter>
);

export default App;

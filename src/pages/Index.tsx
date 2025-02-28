
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { userProfile, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (userProfile) {
        // Redirecionar com base no papel do usuário
        switch (userProfile.role) {
          case "admin":
            navigate("/admin");
            break;
          case "teacher":
            navigate("/teacher");
            break;
          case "student":
            navigate("/student");
            break;
          default:
            navigate("/login");
        }
      }
    }
  }, [userProfile, isLoading, navigate]);

  const handleGetStarted = () => {
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl font-bold text-slate-900">
              Fitness<span className="text-primary">Hub</span>
            </span>
          </div>
          <nav>
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate("/login")}
            >
              Entrar
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 max-w-3xl"
          >
            Gerencie sua academia de forma simples e eficiente
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-xl text-slate-600 max-w-2xl"
          >
            Plataforma completa para administradores, professores e alunos, tudo em um só lugar.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10"
          >
            <Button size="lg" onClick={handleGetStarted}>
              Começar agora
            </Button>
          </motion.div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} FitnessHub. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default Index;

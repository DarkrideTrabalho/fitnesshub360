
import React from "react";
import { motion } from "framer-motion";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children,
  title,
  subtitle
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8">
      <div className="absolute top-0 left-0 w-full h-64 bg-primary/10 rounded-b-[40%] -z-10"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-slate-900">
            Fitness<span className="text-primary">Hub</span>
          </h1>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="text-center mb-8">
              <motion.h2 
                className="text-2xl font-semibold text-slate-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {title}
              </motion.h2>
              
              {subtitle && (
                <motion.p 
                  className="mt-2 text-sm text-slate-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {subtitle}
                </motion.p>
              )}
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {children}
            </motion.div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <motion.p 
            className="text-xs text-slate-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            © 2023 FitnessHub. Todos os direitos reservados.
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;

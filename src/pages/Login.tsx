
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Eye, 
  EyeOff,
  User,
  Key,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";
import AuthLayout from "@/components/AuthLayout";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { authenticate } from "@/lib/db";

const Login = () => {
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      // Pequeno atraso para simular comunicação com o servidor
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const result = authenticate(email, password);
      
      if (result.success && result.user) {
        toast.success("Login realizado com sucesso!");
        
        // Salva o usuário atual no localStorage para permanecer logado
        localStorage.setItem('currentUser', JSON.stringify(result.user));
        
        // Redireciona com base no papel do usuário
        switch (result.user.role) {
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
            navigate("/");
        }
      } else {
        setError(result.message || "Credenciais inválidas");
        uiToast({
          title: "Falha no login",
          description: result.message || "Email ou senha inválidos",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      setError("Ocorreu um erro ao tentar fazer login");
      uiToast({
        title: "Erro",
        description: "Ocorreu um erro ao tentar fazer login",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <AuthLayout 
      title="Bem-vindo"
      subtitle="Entre em sua conta para continuar"
    >
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-50 border border-red-100 rounded-md text-sm text-red-600 flex items-start gap-2"
        >
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}
      
      <form onSubmit={handleLogin} className="space-y-5">
        <div className="space-y-4">
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                id="email"
                type="email"
                placeholder="usuario@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(
                  "pl-10 rounded-xl h-12 bg-slate-50 border-slate-200 focus-visible:ring-primary",
                  error && "border-red-300 focus-visible:ring-red-400"
                )}
                required
              />
            </div>
          </div>
          
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn(
                  "pl-10 rounded-xl h-12 bg-slate-50 border-slate-200 focus-visible:ring-primary",
                  error && "border-red-300 focus-visible:ring-red-400"
                )}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>
          
          <div className="text-right">
            <a 
              href="#" 
              className="text-sm text-primary hover:underline"
              onClick={(e) => e.preventDefault()}
            >
              Esqueceu a senha?
            </a>
          </div>
          
          <Button 
            type="submit" 
            className="w-full rounded-xl h-12 text-base font-medium bg-primary hover:bg-primary/90 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Para fins de demonstração, use qualquer um destes emails com a senha "password":
        </p>
        <div className="mt-2 space-y-1 text-xs text-gray-500">
          <p>admin@fitnesshub.com (Admin)</p>
          <p>john@fitnesshub.com (Professor)</p>
          <p>mike@example.com (Aluno)</p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;

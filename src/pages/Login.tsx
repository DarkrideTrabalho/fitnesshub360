
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Eye, 
  EyeOff,
  User,
  Key,
  AlertCircle,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";
import AuthLayout from "@/components/AuthLayout";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const { signIn, userProfile, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState("admin@fitnesshub.com");  // Pré-preenchido para facilitar
  const [password, setPassword] = useState("password");  // Pré-preenchido para facilitar
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [envError, setEnvError] = useState(false);
  
  // Verifica se as variáveis de ambiente estão definidas
  useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      setEnvError(true);
      setError("Configuração do Supabase incompleta. Verifique as variáveis de ambiente no arquivo .env.local");
      console.error("Variáveis de ambiente não configuradas:", {
        VITE_SUPABASE_URL: supabaseUrl ? "Definido" : "Não definido",
        VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? "Definido" : "Não definido"
      });
    } else {
      setEnvError(false);
      console.log("Variáveis de ambiente configuradas corretamente");
    }
  }, []);
  
  // Redireciona se já estiver autenticado
  useEffect(() => {
    console.log("Login: Estado do userProfile:", userProfile);
    if (userProfile) {
      console.log("Login: Redirecionando usuário autenticado");
      // Redireciona com base no papel do usuário
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
          navigate("/");
      }
    }
  }, [userProfile, navigate]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (envError) {
      uiToast({
        title: "Configuração incompleta",
        description: "Configure as variáveis de ambiente antes de tentar fazer login",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      console.log("Login: Tentando fazer login com:", email);
      await signIn(email, password);
      console.log("Login: Chamada de signIn concluída com sucesso");
      toast.success("Login realizado com sucesso!");
      // O redirecionamento será feito pelo useEffect acima
    } catch (err: any) {
      console.error("Login: Erro ao fazer login:", err);
      setError(err.message || "Credenciais inválidas");
      uiToast({
        title: "Falha no login",
        description: err.message || "Email ou senha inválidos",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (authLoading) {
    return (
      <AuthLayout 
        title="Autenticando"
        subtitle="Aguarde um momento..."
      >
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AuthLayout>
    );
  }

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
      
      {envError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-amber-50 border border-amber-100 rounded-md text-sm text-amber-600"
        >
          <div className="flex items-start gap-2 mb-2">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span className="font-medium">Configure seu arquivo .env.local</span>
          </div>
          <p className="text-xs pl-6">
            Crie um arquivo <code className="bg-amber-100 px-1 rounded">.env.local</code> na raiz do projeto com:
          </p>
          <pre className="bg-amber-100/50 p-2 rounded mt-2 text-xs overflow-auto">
            VITE_SUPABASE_URL=sua_url_do_supabase<br/>
            VITE_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
          </pre>
          <p className="text-xs mt-2 pl-6">
            Encontre esses valores no painel do Supabase em "Project Settings" &gt; "API"
          </p>
        </motion.div>
      )}
      
      <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-md text-sm">
        <div className="flex items-start gap-2 mb-2">
          <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span className="font-medium">Configure seu banco de dados Supabase</span>
        </div>
        <p className="text-xs">
          Você precisa executar os scripts SQL para criar tabelas e usuários de teste:
        </p>
        <ol className="list-decimal text-xs ml-6 mt-1 space-y-1">
          <li>Vá para o painel do Supabase > Editor SQL</li>
          <li>Execute primeiro o script <code className="bg-blue-100 px-1 rounded">supabase/init_tables.sql</code></li>
          <li>Em seguida, execute <code className="bg-blue-100 px-1 rounded">supabase/seed_data.sql</code></li>
        </ol>
        <p className="text-xs mt-2">
          Ou crie um usuário manualmente no painel Supabase > Authentication > Users
        </p>
      </div>
      
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
            disabled={isLoading || envError}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Para fins de demonstração, use uma das contas criadas no Supabase:
        </p>
        <div className="flex flex-col gap-1 mt-1">
          <p className="text-xs text-gray-500">
            <strong>Admin:</strong> admin@fitnesshub.com / password
          </p>
          <p className="text-xs text-gray-500">
            <strong>Professor:</strong> john@fitnesshub.com / password
          </p>
          <p className="text-xs text-gray-500">
            <strong>Aluno:</strong> mike@example.com / password
          </p>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
        <p className="text-xs text-blue-600">
          <strong>Nota Importante:</strong> Certifique-se de ter executado os scripts SQL para criar as tabelas e inserir os dados no Supabase, conforme descrito no arquivo README.md da pasta supabase.
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;


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
import { MOCK_USERS } from "@/lib/types";
import AuthLayout from "@/components/AuthLayout";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const Login = () => {
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    // Simulate login process
    setTimeout(() => {
      const user = MOCK_USERS.find(user => user.email === email);
      
      if (user && password === "password") { // Simple password check for demo
        toast.success("Login successful!");
        
        // Redirect based on user role
        switch (user.role) {
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
        setError("Invalid email or password");
        uiToast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive"
        });
      }
      
      setIsLoading(false);
    }, 1000);
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <AuthLayout 
      title="Welcome Back"
      subtitle="Sign in to access your account"
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
      
      <form onSubmit={handleLogin}>
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
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(
                  "pl-10",
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
              Password
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
                  "pl-10",
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
              Forgot password?
            </a>
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          For demo purposes, use any of these email accounts with password "password":
        </p>
        <div className="mt-2 space-y-1 text-xs text-gray-500">
          <p>admin@fitnesshub.com (Admin)</p>
          <p>john@fitnesshub.com (Teacher)</p>
          <p>mike@example.com (Student)</p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;

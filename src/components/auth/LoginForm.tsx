import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, testSupabaseConnection } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

interface LoginFormProps {
  isDbReady: boolean;
}

export const LoginForm = ({ isDbReady }: LoginFormProps) => {
  const { signIn, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@fitnesshub.com');
  const [password, setPassword] = useState('123456');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [debugMode, setDebugMode] = useState(true); // Enable debug mode by default
  const [connectionStatus, setConnectionStatus] = useState<string>('Checking connection...');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        console.log('Testing Supabase connection...');
        const isConnected = await testSupabaseConnection();
        setConnectionStatus(isConnected 
          ? 'Connected to Supabase ✅' 
          : 'Failed to connect to Supabase ❌');
        
        if (isConnected) {
          try {
            const { error } = await supabase.auth.signInWithPassword({
              email: 'admin@fitnesshub.com',
              password: 'wrongpassword'
            });
            
            if (error && error.message.includes('Invalid login credentials')) {
              console.log('Admin user exists in auth system');
              setConnectionStatus(prev => prev + ' | Admin user exists ✅');
            } else {
              console.log('Admin user might not exist', error?.message);
              setConnectionStatus(prev => prev + ' | Admin user not found ❌');
            }
          } catch (e) {
            console.error('Error checking admin user:', e);
          }
        }
      } catch (error) {
        console.error('Error testing connection:', error);
        setConnectionStatus('Error testing connection ❌');
      }
    };
    
    checkConnection();
  }, []);

  const handleBypassLogin = () => {
    localStorage.setItem('devModeActive', 'true');
    toast.success('Login de desenvolvimento ativado!');
    console.log('Usando login de desenvolvimento (bypass)');
    navigate('/admin');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoading(true);
    
    try {
      if (!isDbReady) {
        throw new Error('Database is not ready. Please check the configuration.');
      }
      
      const isConnected = await testSupabaseConnection();
      if (!isConnected) {
        throw new Error('Cannot connect to the database. Please check your internet connection and settings.');
      }
      
      console.log('Login: Attempting to login with:', email);
      
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();
      
      console.log(`Attempting login with email: "${trimmedEmail}" and password length: ${trimmedPassword.length}`);
      
      await signIn(trimmedEmail, trimmedPassword);
      toast.success('Login successful!');
    } catch (error: any) {
      console.error('Login: Error during login:', error);
      setLoginError(error.message);
      
      if (error.message.includes('Invalid login credentials')) {
        toast.error('Invalid credentials', {
          description: 'Please check your email and password. Default admin: admin@fitnesshub.com, password: 123456'
        });
      } else if (error.message.includes('Email not confirmed')) {
        toast.error('Email not confirmed', {
          description: 'Please contact an administrator to confirm your email.'
        });
      } else {
        toast.error('Login error', {
          description: error.message
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
  };

  return (
    <form onSubmit={handleLogin}>
      {loginError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Login Error</AlertTitle>
          <AlertDescription>{loginError}</AlertDescription>
        </Alert>
      )}
      
      {debugMode && (
        <Alert className="mb-4 bg-slate-100">
          <AlertTitle className="text-xs font-mono">Debug Information</AlertTitle>
          <AlertDescription className="text-xs font-mono">
            <p>Connection: {connectionStatus}</p>
            <p>Database ready: {isDbReady ? 'Yes ✅' : 'No ❌'}</p>
            <p>Auth loading: {authLoading ? 'Yes' : 'No'}</p>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pr-10"
            />
            <button 
              type="button"
              className="absolute inset-y-0 right-0 flex items-center px-3"
              onClick={toggleShowPassword}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-500" />
              ) : (
                <Eye className="h-4 w-4 text-gray-500" />
              )}
            </button>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading || authLoading || !isDbReady}
        >
          {isLoading || authLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : 'Sign in'}
        </Button>

        <Button 
          type="button" 
          variant="outline"
          className="w-full mt-2"
          onClick={handleBypassLogin}
        >
          Entrar em Modo Desenvolvimento (Bypass Login)
        </Button>
        
        <div className="mt-4">
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            className="w-full text-xs"
            onClick={toggleDebugMode}
          >
            {debugMode ? 'Disable Debug Mode' : 'Enable Debug Mode'}
          </Button>
        </div>
      </div>
    </form>
  );
};


import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, testSupabaseConnection } from '@/lib/supabase';

interface LoginFormProps {
  isDbReady: boolean;
}

export const LoginForm = ({ isDbReady }: LoginFormProps) => {
  const { signIn, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState('admin@fitnesshub.com');
  const [password, setPassword] = useState('password');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [debugMode, setDebugMode] = useState(true); // Enable debug mode by default
  const [connectionStatus, setConnectionStatus] = useState<string>('Checking connection...');

  useEffect(() => {
    // Test the connection when component mounts
    const checkConnection = async () => {
      try {
        console.log('Testing Supabase connection...');
        const isConnected = await testSupabaseConnection();
        setConnectionStatus(isConnected 
          ? 'Connected to Supabase ✅' 
          : 'Failed to connect to Supabase ❌');
        
        if (isConnected) {
          // Check if user exists
          try {
            const { error } = await supabase.auth.signInWithPassword({
              email: 'admin@fitnesshub.com',
              password: 'wrongpassword'
            });
            
            // If we get specific error, user exists
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoading(true);
    
    try {
      // Check database status
      if (!isDbReady) {
        throw new Error('Database is not ready. Please check the configuration.');
      }
      
      // Test connection before login
      const isConnected = await testSupabaseConnection();
      if (!isConnected) {
        throw new Error('Cannot connect to the database. Please check your internet connection and settings.');
      }
      
      console.log('Login: Attempting to login with:', email);
      
      if (debugMode) {
        // Get session first
        const { data: sessionData } = await supabase.auth.getSession();
        console.log('Current session before login:', sessionData);
        
        // Try to get user info
        try {
          const { data: userData, error: userError } = await supabase.auth.getUser();
          console.log('Current user before login:', userData, userError);
        } catch (err) {
          console.log('Error getting user:', err);
        }
      }
      
      // Force trim the email and password
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
          description: 'Please check your email and password. Default admin: admin@fitnesshub.com, password: password'
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

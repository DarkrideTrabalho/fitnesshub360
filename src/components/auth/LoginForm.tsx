
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoading(true);
    
    try {
      // Check database status
      if (!isDbReady) {
        throw new Error('Database is not ready. Please check the configuration.');
      }
      
      console.log('Login: Attempting to login with:', email);
      console.log('Login attempt with password length:', password.length);
      console.log('Login attempt with actual password:', password); // For debugging, remove in production
      
      await signIn(email, password);
      toast.success('Login successful!');
    } catch (error: any) {
      console.log('Login: Error during login:', error);
      setLoginError(error.message);
      
      if (error.message.includes('Invalid login credentials')) {
        toast.error('Invalid credentials', {
          description: 'Please check your email and password. Default admin: admin@fitnesshub.com, password: password'
        });
      } else if (error.message.includes('Email not confirmed')) {
        toast.error('Email not confirmed', {
          description: 'The database has been updated to confirm all email addresses.'
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

  return (
    <form onSubmit={handleLogin}>
      {loginError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Login Error</AlertTitle>
          <AlertDescription>{loginError}</AlertDescription>
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
      </div>
    </form>
  );
};

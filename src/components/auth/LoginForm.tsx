
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
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
      // Log without revealing password value but show its length for debugging
      console.log('Login attempt with password length:', password.length);
      
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
          description: 'Run the SQL script again to confirm email addresses.'
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
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
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

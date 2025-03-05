
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { AlertCircle, Info, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { checkDatabaseTables, checkUsersExist, checkEnvironmentVariables } from '@/lib/databaseUtils';
import { testSupabaseConnection } from '@/lib/supabase';

type DatabaseStatus = 'checking' | 'ok' | 'error' | 'missing_tables' | 'empty_tables' | 'no_users' | 'some_empty_tables';

const Login = () => {
  const { signIn, userProfile, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@fitnesshub.com');
  const [password, setPassword] = useState('password');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [databaseStatus, setDatabaseStatus] = useState<DatabaseStatus>('checking');
  const [statusMessage, setStatusMessage] = useState<string>('Checking database status...');
  
  useEffect(() => {
    console.log('Login: userProfile state:', userProfile);
    if (userProfile) {
      const role = userProfile.role;
      console.log('Login: Redirecting to role page:', role);
      navigate(`/${role}`);
    }
  }, [userProfile, navigate]);
  
  useEffect(() => {
    const checkSetup = async () => {
      // Check environment variables
      const envStatus = checkEnvironmentVariables();
      if (envStatus.status !== 'ok') {
        setDatabaseStatus('error');
        setStatusMessage(envStatus.message);
        return;
      }
      
      // Test connection to Supabase
      const isConnected = await testSupabaseConnection();
      if (!isConnected) {
        setDatabaseStatus('error');
        setStatusMessage('Could not connect to Supabase. Check your internet connection and settings.');
        return;
      }
      
      // Check database tables
      const tablesResult = await checkDatabaseTables();
      if (tablesResult.status !== 'ok') {
        setDatabaseStatus(tablesResult.status as DatabaseStatus);
        setStatusMessage(tablesResult.message);
        
        // If tables exist but are empty, check for users
        if (tablesResult.status === 'empty_tables' || tablesResult.status === 'some_empty_tables') {
          const usersResult = await checkUsersExist();
          if (usersResult.status !== 'ok') {
            setDatabaseStatus('no_users');
            setStatusMessage(usersResult.message);
          }
        }
        return;
      }
      
      // If we got here, everything is ok
      setDatabaseStatus('ok');
      setStatusMessage('Database verified successfully');
    };
    
    checkSetup();
  }, []);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoading(true);
    
    try {
      // Check database status
      if (databaseStatus !== 'ok') {
        throw new Error(`Database is not ready: ${statusMessage}`);
      }
      
      console.log('Login: Attempting to login with:', email);
      await signIn(email, password);
      toast.success('Login successful!');
    } catch (error: any) {
      console.log('Login: Error during login:', error);
      setLoginError(error.message);
      
      if (error.message.includes('Invalid login credentials')) {
        toast.error('Invalid credentials', {
          description: 'Please check your email and password. If this is your first time, make sure the SQL script has been run.'
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
  
  const renderDatabaseStatus = () => {
    if (databaseStatus === 'checking') {
      return (
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertTitle>Checking configuration</AlertTitle>
          <AlertDescription>
            Verifying database status...
          </AlertDescription>
        </Alert>
      );
    }
    
    if (databaseStatus !== 'ok') {
      return (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Configuration issues</AlertTitle>
          <AlertDescription>
            {statusMessage}
            <div className="mt-2">
              <strong>Instructions:</strong>
              <ol className="list-decimal pl-5 mt-1">
                <li>Open the Supabase SQL editor</li>
                <li>Run the <code>init_tables.sql</code> script to create tables</li>
                <li>Run the <code>seed_data.sql</code> script to create test users</li>
                <li>Try logging in again with admin@fitnesshub.com / password</li>
              </ol>
            </div>
          </AlertDescription>
        </Alert>
      );
    }
    
    return null;
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">FitnessHub 360</CardTitle>
          <CardDescription>
            Sign in with your credentials to access the system
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {renderDatabaseStatus()}
          
          {loginError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Login Error</AlertTitle>
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleLogin}>
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
                disabled={isLoading || authLoading || databaseStatus !== 'ok'}
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
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-gray-500 text-center w-full">
            For testing, use:
            <div className="font-mono bg-gray-100 p-2 rounded mt-1 text-xs">
              admin@fitnesshub.com / password
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;


import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { DatabaseStatusAlert } from '@/components/auth/DatabaseStatusAlert';
import { LoginForm } from '@/components/auth/LoginForm';
import { TestCredentialsFooter } from '@/components/auth/TestCredentialsFooter';
import { checkDatabaseSetup, DatabaseStatus } from '@/services/databaseService';

const Login = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
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
    const initializeDatabase = async () => {
      const result = await checkDatabaseSetup();
      setDatabaseStatus(result.status);
      setStatusMessage(result.message);
    };
    
    initializeDatabase();
  }, []);
  
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
          <DatabaseStatusAlert status={databaseStatus} message={statusMessage} />
          <LoginForm isDbReady={databaseStatus === 'ok'} />
        </CardContent>
        
        <TestCredentialsFooter />
      </Card>
    </div>
  );
};

export default Login;


import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { checkDatabaseTables, checkUsersExist, checkEnvironmentVariables } from '@/lib/databaseUtils';
import { testSupabaseConnection } from '@/lib/supabase';

type DatabaseStatus = 'checking' | 'ok' | 'error' | 'missing_tables' | 'empty_tables' | 'no_users' | 'some_empty_tables';

const Login = () => {
  const { signIn, userProfile } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@fitnesshub.com');
  const [password, setPassword] = useState('password');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [databaseStatus, setDatabaseStatus] = useState<DatabaseStatus>('checking');
  const [statusMessage, setStatusMessage] = useState<string>('Verificando status do banco de dados...');
  
  useEffect(() => {
    console.log('Login: Estado do userProfile:', userProfile);
    if (userProfile) {
      const role = userProfile.role;
      navigate(`/${role}`);
    }
  }, [userProfile, navigate]);
  
  useEffect(() => {
    const checkSetup = async () => {
      // Verificar as variáveis de ambiente
      const envStatus = checkEnvironmentVariables();
      if (envStatus.status !== 'ok') {
        setDatabaseStatus('error');
        setStatusMessage(envStatus.message);
        return;
      }
      
      // Testar conexão com o Supabase
      const isConnected = await testSupabaseConnection();
      if (!isConnected) {
        setDatabaseStatus('error');
        setStatusMessage('Não foi possível conectar ao Supabase. Verifique sua conexão com a internet e as configurações.');
        return;
      }
      
      // Verificar tabelas do banco de dados
      const tablesResult = await checkDatabaseTables();
      if (tablesResult.status !== 'ok') {
        setDatabaseStatus(tablesResult.status as DatabaseStatus);
        setStatusMessage(tablesResult.message);
        
        // Se as tabelas existem, mas estão vazias, verificar usuários
        if (tablesResult.status === 'empty_tables' || tablesResult.status === 'some_empty_tables') {
          const usersResult = await checkUsersExist();
          if (usersResult.status !== 'ok') {
            setDatabaseStatus('no_users');
            setStatusMessage(usersResult.message);
          }
        }
        return;
      }
      
      // Se chegou até aqui, tudo está ok
      setDatabaseStatus('ok');
      setStatusMessage('Banco de dados verificado com sucesso');
    };
    
    checkSetup();
  }, []);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoading(true);
    
    try {
      // Verificar status do banco de dados
      if (databaseStatus !== 'ok') {
        throw new Error(`Banco de dados não está pronto: ${statusMessage}`);
      }
      
      console.log('Login: Tentando fazer login com:', email);
      await signIn(email, password);
    } catch (error: any) {
      console.log('Login: Erro ao fazer login:', error);
      setLoginError(error.message);
      
      if (error.message.includes('Invalid login credentials')) {
        toast.error('Credenciais inválidas', {
          description: 'Verifique se o email e senha estão corretos e se o script SQL foi executado.'
        });
      } else if (error.message.includes('Email not confirmed')) {
        toast.error('Email não confirmado', {
          description: 'Execute o script SQL novamente para confirmar os emails.'
        });
      } else {
        toast.error('Erro ao fazer login', {
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
          <AlertTitle>Verificando configuração</AlertTitle>
          <AlertDescription>
            Verificando status do banco de dados...
          </AlertDescription>
        </Alert>
      );
    }
    
    if (databaseStatus !== 'ok') {
      return (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Problemas na configuração</AlertTitle>
          <AlertDescription>
            {statusMessage}
            <div className="mt-2">
              <strong>Instruções:</strong>
              <ol className="list-decimal pl-5 mt-1">
                <li>Abra o editor SQL do Supabase</li>
                <li>Execute o script <code>init_tables.sql</code> para criar as tabelas</li>
                <li>Execute o script <code>seed_data.sql</code> para criar os usuários de teste</li>
                <li>Tente fazer login novamente com admin@fitnesshub.com / password</li>
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
            Entre com suas credenciais para acessar o sistema
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {renderDatabaseStatus()}
          
          {loginError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro de Login</AlertTitle>
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
                  placeholder="nome@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
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
                disabled={isLoading || databaseStatus !== 'ok'}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </div>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-gray-500 text-center w-full">
            Para teste, use:
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

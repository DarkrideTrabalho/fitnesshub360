
import { AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type DatabaseStatus = 'checking' | 'ok' | 'error' | 'missing_tables' | 'empty_tables' | 'no_users' | 'some_empty_tables';

interface DatabaseStatusAlertProps {
  status: DatabaseStatus;
  message: string;
}

export const DatabaseStatusAlert = ({ status, message }: DatabaseStatusAlertProps) => {
  if (status === 'checking') {
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
  
  if (status !== 'ok') {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Configuration issues</AlertTitle>
        <AlertDescription>
          {message}
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


import { checkDatabaseTables, checkUsersExist, checkEnvironmentVariables } from '@/lib/databaseUtils';
import { supabase, testSupabaseConnection } from '@/lib/supabase';

export type DatabaseStatus = 'checking' | 'ok' | 'error' | 'missing_tables' | 'empty_tables' | 'no_users' | 'some_empty_tables';

export interface DatabaseStatusResult {
  status: DatabaseStatus;
  message: string;
}

export const checkDatabaseSetup = async (): Promise<DatabaseStatusResult> => {
  // Check if we can connect to Supabase
  const isConnected = await testSupabaseConnection();
  if (!isConnected) {
    console.error('Could not connect to Supabase');
    return {
      status: 'error' as DatabaseStatus,
      message: 'Could not connect to Supabase. Check your internet connection and settings.'
    };
  }

  // Check environment variables
  const envStatus = checkEnvironmentVariables();
  if (envStatus.status !== 'ok') {
    console.error('Environment variable issues:', envStatus.message);
    return {
      status: 'error' as DatabaseStatus,
      message: envStatus.message
    };
  }
  
  // Try to directly check if users exist in auth.users (if we have permission)
  try {
    console.log('Checking if admin user exists...');
    
    // Try to sign in with the admin user with a wrong password
    // If we get "Invalid login credentials", it means the user exists
    const { error } = await supabase.auth.signInWithPassword({
      email: 'admin@fitnesshub.com',
      password: 'wrong-password-just-checking'
    });
    
    if (error) {
      console.log('Error checking admin user:', error.message);
      
      if (error.message.includes('Invalid login credentials')) {
        console.log('Admin user exists, skipping other checks');
        return {
          status: 'ok' as DatabaseStatus,
          message: 'Database verified successfully'
        };
      }
    }
  } catch (e) {
    console.error('Error checking admin user:', e);
  }
  
  // Check database tables
  console.log('Checking database tables...');
  const tablesResult = await checkDatabaseTables();
  if (tablesResult.status !== 'ok') {
    console.log('Table check failed:', tablesResult.status, tablesResult.message);
    
    const result: DatabaseStatusResult = {
      status: tablesResult.status as DatabaseStatus,
      message: tablesResult.message
    };
    
    // If tables exist but are empty, check for users
    if (tablesResult.status === 'empty_tables' || tablesResult.status === 'some_empty_tables') {
      console.log('Checking if users exist...');
      const usersResult = await checkUsersExist();
      if (usersResult.status !== 'ok') {
        console.log('No users found:', usersResult.message);
        return {
          status: 'no_users' as DatabaseStatus,
          message: 'Nenhum usuário encontrado. Execute o script SQL de seed_data.sql para criar usuários de teste.'
        };
      }
    }
    
    return result;
  }
  
  // If we got here, everything is ok
  console.log('Database verification successful');
  return {
    status: 'ok' as DatabaseStatus,
    message: 'Database verified successfully'
  };
};

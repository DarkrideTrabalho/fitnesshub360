
import { checkDatabaseTables, checkUsersExist, checkEnvironmentVariables } from '@/lib/databaseUtils';
import { testSupabaseConnection } from '@/lib/supabase';

export type DatabaseStatus = 'checking' | 'ok' | 'error' | 'missing_tables' | 'empty_tables' | 'no_users' | 'some_empty_tables';

export interface DatabaseStatusResult {
  status: DatabaseStatus;
  message: string;
}

export const checkDatabaseSetup = async (): Promise<DatabaseStatusResult> => {
  // Check environment variables
  const envStatus = checkEnvironmentVariables();
  if (envStatus.status !== 'ok') {
    return {
      status: 'error' as DatabaseStatus,
      message: envStatus.message
    };
  }
  
  // Test connection to Supabase
  const isConnected = await testSupabaseConnection();
  if (!isConnected) {
    return {
      status: 'error' as DatabaseStatus,
      message: 'Could not connect to Supabase. Check your internet connection and settings.'
    };
  }
  
  // Check database tables
  const tablesResult = await checkDatabaseTables();
  if (tablesResult.status !== 'ok') {
    const result: DatabaseStatusResult = {
      status: tablesResult.status as DatabaseStatus,
      message: tablesResult.message
    };
    
    // If tables exist but are empty, check for users
    if (tablesResult.status === 'empty_tables' || tablesResult.status === 'some_empty_tables') {
      const usersResult = await checkUsersExist();
      if (usersResult.status !== 'ok') {
        return {
          status: 'no_users' as DatabaseStatus,
          message: usersResult.message
        };
      }
    }
    
    return result;
  }
  
  // If we got here, everything is ok
  return {
    status: 'ok' as DatabaseStatus,
    message: 'Database verified successfully'
  };
};

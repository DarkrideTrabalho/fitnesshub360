
import { supabase } from './supabase';

// Função para verificar o status das tabelas do banco de dados
export const checkDatabaseTables = async () => {
  try {
    console.log('Verificando tabelas do banco de dados...');
    
    // Lista de tabelas que devem existir
    const requiredTables = [
      'admin_profiles',
      'teacher_profiles',
      'student_profiles',
      'classes',
      'enrollments',
      'vacations'
    ] as const;
    
    const results = await Promise.all(
      requiredTables.map(async (table) => {
        const { data, error } = await supabase.from(table).select('id').limit(1);
        
        return {
          table,
          exists: !error,
          hasData: data && data.length > 0,
          error: error ? error.message : null
        };
      })
    );
    
    const missingTables = results.filter(result => !result.exists);
    const emptyTables = results.filter(result => result.exists && !result.hasData);
    
    if (missingTables.length > 0) {
      console.error('Tabelas faltantes:', missingTables.map(t => t.table).join(', '));
      return {
        status: 'missing_tables',
        message: `Faltam tabelas: ${missingTables.map(t => t.table).join(', ')}`,
        details: missingTables
      };
    }
    
    if (emptyTables.length === results.length) {
      console.warn('Todas as tabelas existem, mas estão vazias:', emptyTables.map(t => t.table).join(', '));
      return {
        status: 'empty_tables',
        message: 'Todas as tabelas estão vazias. Execute o script SQL de seed_data.sql.',
        details: emptyTables
      };
    }
    
    if (emptyTables.length > 0) {
      console.warn('Algumas tabelas estão vazias:', emptyTables.map(t => t.table).join(', '));
      return {
        status: 'some_empty_tables',
        message: `Algumas tabelas estão vazias: ${emptyTables.map(t => t.table).join(', ')}`,
        details: emptyTables
      };
    }
    
    console.log('Todas as tabelas existem e contêm dados.');
    return {
      status: 'ok',
      message: 'Banco de dados verificado com sucesso.',
      details: results
    };
  } catch (error: any) {
    console.error('Erro ao verificar tabelas do banco de dados:', error);
    return {
      status: 'error',
      message: 'Erro ao verificar o banco de dados.',
      details: error
    };
  }
};

// Função para verificar se existem usuários no banco de dados
export const checkUsersExist = async () => {
  try {
    // Verificamos se existem perfis de usuários nas tabelas de perfis
    const tables = ['admin_profiles', 'teacher_profiles', 'student_profiles'] as const;
    
    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('id').limit(5);
      
      if (!error && data && data.length > 0) {
        console.log(`Usuários encontrados em ${table}:`, data.length);
        return {
          status: 'ok',
          message: `Usuários encontrados em ${table}`,
          details: data
        };
      }
    }
    
    console.warn('Nenhum usuário encontrado em nenhuma tabela de perfis.');
    return {
      status: 'no_users',
      message: 'Nenhum usuário encontrado. Execute o script SQL de seed_data.sql para criar usuários de teste.',
      details: null
    };
  } catch (error: any) {
    console.error('Erro ao verificar existência de usuários:', error);
    return {
      status: 'error',
      message: 'Erro ao verificar a existência de usuários.',
      details: error
    };
  }
};

// Função para verificar as variáveis de ambiente
export const checkEnvironmentVariables = () => {
  // Using direct values instead of environment variables
  const supabaseUrl = 'https://bvkjuqizqetxbgojvtnk.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2a2p1cWl6cWV0eGJnb2p2dG5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMjA3MjksImV4cCI6MjA1NjU5NjcyOX0.gVLSgClCuapCFSp4x4xQDtZdwBfKDkPGWF026aJ6MgI';
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Variáveis de ambiente do Supabase não configuradas corretamente');
    return {
      status: 'missing_env_vars',
      message: 'Variáveis de ambiente do Supabase não configuradas corretamente',
      details: {
        VITE_SUPABASE_URL: !!supabaseUrl,
        VITE_SUPABASE_ANON_KEY: !!supabaseAnonKey
      }
    };
  }
  
  console.log('Variáveis de ambiente configuradas corretamente');
  return {
    status: 'ok',
    message: 'Variáveis de ambiente configuradas corretamente',
    details: {
      VITE_SUPABASE_URL: !!supabaseUrl,
      VITE_SUPABASE_ANON_KEY: !!supabaseAnonKey
    }
  };
};

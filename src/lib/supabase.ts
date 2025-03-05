import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Use the values from the connected Supabase project
const supabaseUrl = 'https://bvkjuqizqetxbgojvtnk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2a2p1cWl6cWV0eGJnb2p2dG5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMjA3MjksImV4cCI6MjA1NjU5NjcyOX0.gVLSgClCuapCFSp4x4xQDtZdwBfKDkPGWF026aJ6MgI';

// Exibe informações detalhadas sobre a configuração para depuração
console.log('====== CONFIGURAÇÃO SUPABASE ======');
console.log('URL do Supabase:', supabaseUrl);
console.log('Chave Anon do Supabase:', supabaseAnonKey ? 'DEFINIDA (ocultada por segurança)' : 'NÃO DEFINIDA');
console.log('===================================');

// Cria o cliente Supabase
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Função para testar a conexão com o Supabase
export const testSupabaseConnection = async () => {
  try {
    console.log('Testando conexão com o Supabase...');
    const { data, error } = await supabase.from('admin_profiles').select('id').limit(1);
    
    if (error) {
      console.error('Erro ao testar conexão com o Supabase:', error);
      return false;
    }
    
    console.log('Conexão com o Supabase bem-sucedida:', data);
    return true;
  } catch (error) {
    console.error('Exceção ao testar conexão com o Supabase:', error);
    return false;
  }
};

// Helpers para autenticação
export const signIn = async (email: string, password: string) => {
  console.log('Tentando fazer login com:', email);
  
  try {
    // Verifique a conexão com o Supabase primeiro
    const isConnected = await testSupabaseConnection();
    if (!isConnected) {
      throw new Error('Não foi possível conectar ao Supabase. Verifique sua conexão com a internet e as configurações do Supabase.');
    }
    
    console.log('Usando Supabase Auth para login com:', email);
    
    // Tenta fazer login diretamente com Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('Erro no login:', error);
      
      if (error.message.includes('Invalid login credentials')) {
        console.error('ERRO: Credenciais de login inválidas.');
        console.error('Certifique-se de que o SQL de criação de usuários foi executado no Supabase.');
        console.error('NOTA: A senha correta é "password", não "password123"');
        throw new Error('Credenciais inválidas. Verifique se o email e senha estão corretos e se o script SQL foi executado no Supabase.');
      } else if (error.message.includes('Email not confirmed')) {
        // Para resolver o problema de "Email not confirmed"
        console.error('ERRO: Email não confirmado. Vamos tentar confirmar automaticamente.');
        
        try {
          // No ambiente de desenvolvimento, podemos tentar confirmar o email diretamente
          // Isso NÃO funciona em produção, apenas para fins de desenvolvimento
          if (email.includes('@fitnesshub.com') || email.includes('@example.com')) {
            console.log('Tentando confirmar email automaticamente para desenvolvimento...');
            
            // Remover a tentativa de usar a função admin que não está disponível
            console.error('Erro ao confirmar email: função administrativa não disponível');
            throw new Error('Email não confirmado. Execute o script SQL novamente para garantir que os emails estejam confirmados.');
          } else {
            throw new Error('Email não confirmado. Verifique sua caixa de entrada para o link de confirmação.');
          }
        } catch (confirmError) {
          console.error('Erro ao tentar confirmar email automaticamente:', confirmError);
          throw new Error('Email não confirmado. Execute o script SQL novamente para garantir que os emails estejam confirmados.');
        }
      } else {
        throw error;
      }
    }
    
    console.log('Login bem-sucedido:', data);
    return data;
  } catch (error) {
    console.error('Exceção durante o login:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Erro durante logout:', error);
      throw error;
    }
    console.log('Logout realizado com sucesso');
  } catch (error) {
    console.error('Exceção durante logout:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    console.log('Obtendo sessão atual...');
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log('Nenhuma sessão encontrada');
      return null;
    }
    
    console.log('Sessão encontrada, obtendo usuário...');
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Erro ao obter usuário:', error);
      throw error;
    }
    
    console.log('Usuário encontrado:', data.user);
    return data.user;
  } catch (error) {
    console.error('Exceção ao obter usuário atual:', error);
    throw error;
  }
};

// Função para obter o perfil completo do usuário
export const getUserProfile = async (userId: string) => {
  console.log('Buscando perfil para o usuário:', userId);
  
  try {
    // Primeiro tenta buscar como admin
    const { data: adminData, error: adminError } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (adminError && adminError.code !== 'PGRST116') {
      console.error('Erro ao buscar perfil de admin:', adminError);
    }
      
    if (adminData) {
      console.log('Perfil de admin encontrado:', adminData);
      return { ...adminData, role: 'admin' };
    }
    
    // Tenta buscar como professor
    const { data: teacherData, error: teacherError } = await supabase
      .from('teacher_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (teacherError && teacherError.code !== 'PGRST116') {
      console.error('Erro ao buscar perfil de professor:', teacherError);
    }
      
    if (teacherData) {
      console.log('Perfil de professor encontrado:', teacherData);
      return { ...teacherData, role: 'teacher' };
    }
    
    // Tenta buscar como aluno
    const { data: studentData, error: studentError } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (studentError && studentError.code !== 'PGRST116') {
      console.error('Erro ao buscar perfil de aluno:', studentError);
    }
      
    if (studentData) {
      console.log('Perfil de aluno encontrado:', studentData);
      return { ...studentData, role: 'student' };
    }
    
    // Se não encontrar em nenhuma tabela
    console.log('Nenhum perfil encontrado para o usuário:', userId);
    return null;
  } catch (error) {
    console.error('Exceção ao buscar perfil de usuário:', error);
    return null;
  }
};

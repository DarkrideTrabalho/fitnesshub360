
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Obtém as variáveis de ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || `https://ndagmedfmfqwvkahdlhf.supabase.co`;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kYWdtZWRmbWZxd3ZrYWhkbGhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2ODY0MTcsImV4cCI6MjA1NjI2MjQxN30.RJb-4o2h91uTQ166vi4nNDFXiIWqr6xSCz4fC3OS2yk`;

// Exibe informações detalhadas sobre a configuração para depuração
console.log('====== CONFIGURAÇÃO SUPABASE ======');
console.log('URL do Supabase:', supabaseUrl);
console.log('Chave Anon do Supabase:', supabaseAnonKey ? 'DEFINIDA (ocultada por segurança)' : 'NÃO DEFINIDA');
console.log('===================================');

// Verifica se as variáveis de ambiente estão definidas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('ERRO: As variáveis de ambiente do Supabase não estão configuradas corretamente.');
  console.error('Certifique-se de ter um arquivo .env.local ou .env na raiz do projeto com:');
  console.error('VITE_SUPABASE_URL=sua_url_do_supabase');
  console.error('VITE_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase');
}

// Cria o cliente Supabase
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helpers para autenticação
export const signIn = async (email: string, password: string) => {
  console.log('Tentando fazer login com:', email);
  
  try {
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
        console.error('NOTA: A senha correta é "password", não "password123"');
        throw new Error('Credenciais inválidas. Verifique se o email e senha estão corretos. A senha é "password".');
      } else if (error.message.includes('Email not confirmed')) {
        // Para resolver o problema de "Email not confirmed"
        console.error('ERRO: Email não confirmado. Vamos tentar confirmar automaticamente.');
        
        try {
          // No ambiente de desenvolvimento, podemos tentar confirmar o email diretamente
          // Isso NÃO funciona em produção, apenas para fins de desenvolvimento
          if (email.includes('@fitnesshub.com') || email.includes('@example.com')) {
            // Usar API do Supabase Admin para confirmar email (apenas em desenvolvimento)
            await fetch(`${supabaseUrl}/auth/v1/user/admin/confirm`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supabaseAnonKey}`,
                'apikey': supabaseAnonKey
              },
              body: JSON.stringify({ email })
            });
            
            // Tentar login novamente após confirmar o email
            console.log('Tentando login novamente após confirmação automática de email');
            const { data: newData, error: newError } = await supabase.auth.signInWithPassword({
              email,
              password
            });
            
            if (newError) {
              throw newError;
            }
            
            console.log('Login bem-sucedido após confirmação automática:', newData);
            return newData;
          } else {
            throw new Error('Email não confirmado. Verifique sua caixa de entrada para o link de confirmação.');
          }
        } catch (confirmError) {
          console.error('Erro ao tentar confirmar email automaticamente:', confirmError);
          throw new Error('Email não confirmado. Verifique sua caixa de entrada ou entre em contato com o administrador.');
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

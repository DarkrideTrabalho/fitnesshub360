
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Obtém as variáveis de ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Exibe informações detalhadas sobre a configuração para depuração
console.log('====== CONFIGURAÇÃO SUPABASE ======');
console.log('URL do Supabase:', supabaseUrl || 'NÃO DEFINIDO');
console.log('Chave Anon do Supabase:', supabaseAnonKey ? 'DEFINIDA (ocultada por segurança)' : 'NÃO DEFINIDA');
console.log('===================================');

// Verifica se as variáveis de ambiente estão definidas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('ERRO: As variáveis de ambiente do Supabase não estão configuradas corretamente.');
  console.error('Certifique-se de ter um arquivo .env.local ou .env na raiz do projeto com:');
  console.error('VITE_SUPABASE_URL=sua_url_do_supabase');
  console.error('VITE_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase');
}

// Cria o cliente Supabase - IMPORTANTE: não use fallbacks como "placeholder-url"
// pois isso causa erros internos no Supabase
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : (() => {
      console.error('Cliente Supabase não inicializado devido a configurações ausentes');
      // Retorna um objeto mock para evitar erros de runtime quando não há variáveis de ambiente
      return {
        auth: {
          signInWithPassword: async () => ({ data: null, error: new Error('Supabase não configurado') }),
          signOut: async () => ({ error: null }),
          getSession: async () => ({ data: { session: null }, error: null }),
          getUser: async () => ({ data: { user: null }, error: null }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        },
        from: () => ({
          select: () => ({
            eq: () => ({
              single: async () => ({ data: null, error: null }),
            }),
          }),
        }),
      } as any;
    })();

// Helpers para autenticação
export const signIn = async (email: string, password: string) => {
  console.log('Tentando fazer login com:', email);
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('As variáveis de ambiente do Supabase não estão configuradas. Verifique seu arquivo .env.local');
  }
  
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
        console.error('ERRO: Credenciais de login inválidas. Verifique se você executou os scripts SQL para criar os usuários de teste.');
        throw new Error('Credenciais inválidas. Verifique se o email e senha estão corretos.');
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

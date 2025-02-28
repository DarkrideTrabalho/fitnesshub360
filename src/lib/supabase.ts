
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
  
  // Usa a senha correta conforme o seed_data.sql
  const correctPassword = 'password'; // no script SQL, as senhas estão definidas como 'password'
  
  // Se estamos em modo de desenvolvimento e o email corresponde a um usuário de teste,
  // podemos verificar se a senha está correta manualmente
  if (
    process.env.NODE_ENV !== 'production' &&
    (email === 'admin@fitnesshub.com' || 
     email === 'john@fitnesshub.com' || 
     email === 'sarah@fitnesshub.com' ||
     email === 'carlos@fitnesshub.com' ||
     email === 'mike@example.com' ||
     email === 'lisa@example.com' ||
     email === 'alex@example.com' ||
     email === 'emma@example.com')
  ) {
    console.log('Usuário de teste detectado');
    
    if (password !== correctPassword) {
      console.error('Senha incorreta para usuário de teste');
      throw new Error('Senha incorreta. A senha correta para os usuários de teste é: password');
    }
  }
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('Erro no login:', error);
      
      // Mensagens mais detalhadas de erro
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Credenciais inválidas. Verifique se o email e senha estão corretos.');
      } else if (error.message.includes('Email not confirmed')) {
        throw new Error('Email não confirmado. Verifique sua caixa de entrada.');
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


import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Obtém as variáveis de ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verifica se as variáveis de ambiente estão definidas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('As variáveis de ambiente do Supabase não estão configuradas corretamente.');
  console.log('VITE_SUPABASE_URL:', supabaseUrl ? 'Definido' : 'Não definido');
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Definido' : 'Não definido');
}

// Cria o cliente Supabase
export const supabase = createClient<Database>(
  supabaseUrl || '',  // Fallback para string vazia para evitar erros
  supabaseAnonKey || ''
);

// Helpers para autenticação
export const signIn = async (email: string, password: string) => {
  console.log('Tentando fazer login com:', email);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    console.error('Erro no login:', error);
    throw error;
  }
  console.log('Login bem-sucedido:', data);
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  
  return data.user;
};

// Função para obter o perfil completo do usuário
export const getUserProfile = async (userId: string) => {
  console.log('Buscando perfil para o usuário:', userId);
  
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
};

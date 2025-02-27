
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('As variáveis de ambiente do Supabase não estão configuradas corretamente.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helpers para autenticação
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
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
  // Primeiro tenta buscar como admin
  const { data: adminData } = await supabase
    .from('admin_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
    
  if (adminData) return { ...adminData, role: 'admin' };
  
  // Tenta buscar como professor
  const { data: teacherData } = await supabase
    .from('teacher_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
    
  if (teacherData) return { ...teacherData, role: 'teacher' };
  
  // Tenta buscar como aluno
  const { data: studentData } = await supabase
    .from('student_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
    
  if (studentData) return { ...studentData, role: 'student' };
  
  // Se não encontrar em nenhuma tabela
  return null;
};


import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, getUserProfile } from '@/lib/supabase';
import { UserRole } from '@/lib/types';
import { toast } from 'sonner';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userProfile: any | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Inicializando');
    
    // Verifica se as variáveis de ambiente estão configuradas
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('AuthProvider: Variáveis de ambiente do Supabase não configuradas');
      toast.error('Configuração do Supabase não encontrada');
      setIsLoading(false);
      return;
    }

    // Obtém a sessão atual e configura um listener para mudanças
    const initializeAuth = async () => {
      try {
        console.log('AuthProvider: Obtendo sessão inicial');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('AuthProvider: Sessão inicial:', session ? 'Encontrada' : 'Não encontrada');
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('AuthProvider: Usuário encontrado na sessão, buscando perfil');
          await fetchUserProfile(session.user.id);
        } else {
          console.log('AuthProvider: Nenhum usuário na sessão');
          setUserProfile(null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('AuthProvider: Erro ao inicializar autenticação:', error);
        setIsLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('AuthProvider: Mudança de estado de autenticação:', _event);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log('AuthProvider: Usuário atualizado, buscando perfil');
        fetchUserProfile(session.user.id);
      } else {
        console.log('AuthProvider: Usuário desconectado');
        setUserProfile(null);
        setIsLoading(false);
      }
    });

    return () => {
      console.log('AuthProvider: Limpando assinatura');
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('AuthProvider: Buscando perfil para userId:', userId);
      setIsLoading(true);
      const profile = await getUserProfile(userId);
      console.log('AuthProvider: Perfil recuperado:', profile);
      setUserProfile(profile);
    } catch (error) {
      console.error('AuthProvider: Erro ao buscar perfil do usuário:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('AuthProvider: Tentando login com:', email);
      
      // Verifica se as variáveis de ambiente estão configuradas
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Variáveis de ambiente do Supabase não configuradas. Verifique o arquivo .env.local');
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        console.error('AuthProvider: Erro ao fazer login:', error);
        throw error;
      }
      
      console.log('AuthProvider: Login bem-sucedido:', data);
      // O listener de autenticação vai lidar com a atualização do estado
    } catch (error: any) {
      console.error('AuthProvider: Exceção ao fazer login:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('AuthProvider: Tentando fazer logout');
      await supabase.auth.signOut();
      console.log('AuthProvider: Logout bem-sucedido');
      // O listener de autenticação vai lidar com a atualização do estado
    } catch (error) {
      console.error('AuthProvider: Erro ao fazer logout:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        userProfile,
        isLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

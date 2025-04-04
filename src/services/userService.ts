import { supabase } from '@/integrations/supabase/client';

// Function to check if a user with specified email exists
export const checkUserExists = async (email: string) => {
  try {
    // Try to sign in with an invalid password, which will tell us if the user exists
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: 'invalid-test-password'
    });
    
    // If we get a specific error message, the user exists
    const userExists = error?.message.includes('Invalid login credentials');
    
    console.log(`User check for ${email}: ${userExists ? 'Exists' : 'Does not exist'}`);
    return userExists;
  } catch (error) {
    console.error('Error checking if user exists:', error);
    return false;
  }
};

// Function to get the user profile
export const getUserProfile = async (userId: string) => {
  console.log('Getting profile for user:', userId);
  
  try {
    // First try to get as admin
    const { data: adminData, error: adminError } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (adminError && adminError.code !== 'PGRST116') {
      console.error('Error getting admin profile:', adminError);
    }
      
    if (adminData) {
      console.log('Admin profile found:', adminData);
      return { ...adminData, role: 'admin' };
    }
    
    // Try to get as teacher
    const { data: teacherData, error: teacherError } = await supabase
      .from('teacher_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (teacherError && teacherError.code !== 'PGRST116') {
      console.error('Error getting teacher profile:', teacherError);
    }
      
    if (teacherData) {
      console.log('Teacher profile found:', teacherData);
      return { ...teacherData, role: 'teacher' };
    }
    
    // Try to get as student
    const { data: studentData, error: studentError } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (studentError && studentError.code !== 'PGRST116') {
      console.error('Error getting student profile:', studentError);
    }
      
    if (studentData) {
      console.log('Student profile found:', studentData);
      return { ...studentData, role: 'student' };
    }
    
    // If no profile found
    console.log('No profile found for user:', userId);
    return null;
  } catch (error) {
    console.error('Exception getting user profile:', error);
    return null;
  }
};

// Function to create a new user profile
export const createUserProfile = async (userData: any, role: 'admin' | 'teacher' | 'student') => {
  try {
    const { userId, email, name, ...otherData } = userData;
    
    const profileData = {
      user_id: userId,
      email,
      name,
      ...otherData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    let result;
    
    switch (role) {
      case 'admin':
        result = await supabase.from('admin_profiles').insert(profileData);
        break;
      case 'teacher':
        result = await supabase.from('teacher_profiles').insert(profileData);
        break;
      case 'student':
        // Add membership_status if it's not already included
        if (!profileData.membership_status && role === 'student') {
          profileData.membership_status = 'active';
        }
        result = await supabase.from('student_profiles').insert(profileData);
        break;
    }
    
    if (result?.error) {
      throw result.error;
    }
    
    return { success: true, profile: profileData };
  } catch (error) {
    console.error(`Error creating ${role} profile:`, error);
    return { success: false, error };
  }
};

// Function to update a user profile
export const updateUserProfile = async (profileId: string, userData: any, role: 'admin' | 'teacher' | 'student') => {
  try {
    const { ...updateData } = userData;
    
    const profileData = {
      ...updateData,
      updated_at: new Date().toISOString()
    };
    
    let result;
    
    switch (role) {
      case 'admin':
        result = await supabase.from('admin_profiles').update(profileData).eq('id', profileId);
        break;
      case 'teacher':
        result = await supabase.from('teacher_profiles').update(profileData).eq('id', profileId);
        break;
      case 'student':
        result = await supabase.from('student_profiles').update(profileData).eq('id', profileId);
        break;
    }
    
    if (result?.error) {
      throw result.error;
    }
    
    return { success: true, profile: profileData };
  } catch (error) {
    console.error(`Error updating ${role} profile:`, error);
    return { success: false, error };
  }
};

// Function to create a teacher profile using the database function
export const createTeacherProfile = async (name: string, email: string, phoneNumber: string, address: string, taxNumber: string, age: number, userId: string) => {
  try {
    // First, create a user in auth.users
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: 'temporary-password', // This should be changed by the user
      email_confirm: true
    });
    
    if (authError) {
      console.error('Error creating teacher user:', authError);
      throw authError;
    }
    
    // Then use the database function to create the teacher profile
    const { data, error } = await supabase.rpc('create_teacher_profile', {
      p_name: name,
      p_email: email,
      p_user_id: authData.user.id
    });
    
    if (error) {
      console.error('Error creating teacher profile:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Exception creating teacher profile:', error);
    throw error;
  }
};

// Função específica para atualizar um perfil de professor
export const updateTeacherProfile = async (id: string, data: { name: string; email: string; phoneNumber: string; address: string; taxNumber: string; age: number; }) => {
  try {
    // Você pode chamar a função updateUserProfile existente
    const result = await updateUserProfile(id, data, 'teacher');
    return result;
  } catch (error) {
    console.error('Error updating teacher profile:', error);
    throw error;
  }
};

// Function to delete a teacher profile using the database function
export const deleteTeacherProfile = async (teacherId: string) => {
  try {
    const { data, error } = await supabase.rpc('delete_teacher_profile', {
      p_teacher_id: teacherId
    });
    
    if (error) {
      console.error('Error deleting teacher profile:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Exception deleting teacher profile:', error);
    throw error;
  }
};

// Function to fetch all teacher profiles using the database function
export const fetchTeacherProfiles = async () => {
  try {
    const { data, error } = await supabase.rpc('fetch_teacher_profiles');
    
    if (error) {
      console.error('Error fetching teacher profiles:', error);
      throw error;
    }
    
    // Transform the data to match the Teacher interface
    const teachers = data.map((teacher: any) => ({
      id: teacher.id,
      name: teacher.name,
      email: teacher.email,
      role: 'teacher',
      createdAt: new Date(teacher.created_at),
      specialties: teacher.specialties || '',
      onVacation: teacher.on_vacation || false,
      avatarUrl: teacher.avatar_url || 'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(teacher.name || 'TP'),
      userId: teacher.user_id,
      taxNumber: teacher.tax_number || '',
      phoneNumber: teacher.phone_number || '',
      address: teacher.address || '',
      age: teacher.age || 0
    }));
    
    return teachers;
  } catch (error) {
    console.error('Exception fetching teacher profiles:', error);
    throw error;
  }
};

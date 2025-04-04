
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { TeacherFormData } from '@/components/TeacherFormDialog';

// Function to get all teacher profiles 
export const getAllTeachers = async () => {
  try {
    const { data, error } = await supabase
      .from('teacher_profiles')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching teachers:', error);
      return { success: false, error };
    }

    const formattedTeachers = data.map(teacher => ({
      id: teacher.id,
      name: teacher.name || '',
      email: teacher.email || '',
      phoneNumber: teacher.phone_number || '',
      address: teacher.address || '',
      taxNumber: teacher.tax_number || '',
      age: teacher.age || 0,
      specialties: Array.isArray(teacher.specialties) 
        ? teacher.specialties.join(', ') 
        : (teacher.specialties || ''),
      onVacation: teacher.on_vacation || false,
      userId: teacher.user_id,
      avatarUrl: teacher.avatar_url
    }));

    return { success: true, teachers: formattedTeachers };
  } catch (error) {
    console.error('Exception fetching teachers:', error);
    return { success: false, error };
  }
};

// Function to get teachers currently on vacation
export const getTeachersOnVacation = async () => {
  try {
    const { data, error } = await supabase
      .from('teacher_profiles')
      .select('*')
      .eq('on_vacation', true);

    if (error) {
      console.error('Error fetching teachers on vacation:', error);
      return { success: false, error };
    }

    const formattedTeachers = data.map(teacher => ({
      id: teacher.id,
      name: teacher.name || '',
      email: teacher.email || '',
      phoneNumber: teacher.phone_number || '',
      address: teacher.address || '',
      taxNumber: teacher.tax_number || '',
      age: teacher.age || 0,
      specialties: Array.isArray(teacher.specialties) 
        ? teacher.specialties.join(', ') 
        : (teacher.specialties || ''),
      onVacation: teacher.on_vacation || false,
      userId: teacher.user_id,
      avatarUrl: teacher.avatar_url
    }));

    return { success: true, teachers: formattedTeachers, count: formattedTeachers.length };
  } catch (error) {
    console.error('Exception fetching teachers on vacation:', error);
    return { success: false, error };
  }
};

// Function to create a new teacher
export const createTeacher = async (teacherData: TeacherFormData) => {
  try {
    // Convert specialties string to array if needed
    const specialtiesArray = teacherData.specialties
      ? teacherData.specialties.split(',').map(item => item.trim()).filter(item => item)
      : [];

    const { data, error } = await supabase
      .from('teacher_profiles')
      .insert({
        name: teacherData.name,
        email: teacherData.email,
        phone_number: teacherData.phoneNumber,
        address: teacherData.address,
        tax_number: teacherData.taxNumber,
        age: teacherData.age,
        specialties: specialtiesArray,
        avatar_url: teacherData.avatarUrl,
        user_id: crypto.randomUUID() // Generate a UUID since we're not creating an auth user
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating teacher:', error);
      toast.error('Failed to create teacher');
      return { success: false, error };
    }

    toast.success('Teacher created successfully');
    return { success: true, teacher: data };
  } catch (error) {
    console.error('Exception creating teacher:', error);
    toast.error('An error occurred while creating teacher');
    return { success: false, error };
  }
};

// Function to update a teacher
export const updateTeacher = async (teacherId: string, teacherData: TeacherFormData) => {
  try {
    // Convert specialties string to array if needed
    const specialtiesArray = teacherData.specialties
      ? teacherData.specialties.split(',').map(item => item.trim()).filter(item => item)
      : [];

    const { data, error } = await supabase
      .from('teacher_profiles')
      .update({
        name: teacherData.name,
        email: teacherData.email,
        phone_number: teacherData.phoneNumber,
        address: teacherData.address,
        tax_number: teacherData.taxNumber,
        age: teacherData.age,
        specialties: specialtiesArray,
        avatar_url: teacherData.avatarUrl
      })
      .eq('id', teacherId)
      .select()
      .single();

    if (error) {
      console.error('Error updating teacher:', error);
      toast.error('Failed to update teacher');
      return { success: false, error };
    }

    toast.success('Teacher updated successfully');
    return { success: true, teacher: data };
  } catch (error) {
    console.error('Exception updating teacher:', error);
    toast.error('An error occurred while updating teacher');
    return { success: false, error };
  }
};

// Function to delete a teacher
export const deleteTeacher = async (teacherId: string) => {
  try {
    const { error } = await supabase
      .from('teacher_profiles')
      .delete()
      .eq('id', teacherId);

    if (error) {
      console.error('Error deleting teacher:', error);
      toast.error('Failed to delete teacher');
      return { success: false, error };
    }

    toast.success('Teacher deleted successfully');
    return { success: true };
  } catch (error) {
    console.error('Exception deleting teacher:', error);
    toast.error('An error occurred while deleting teacher');
    return { success: false, error };
  }
};

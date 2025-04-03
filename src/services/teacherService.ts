
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

    return { success: true, teachers: data };
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

    return { success: true, teachers: data, count: data.length };
  } catch (error) {
    console.error('Exception fetching teachers on vacation:', error);
    return { success: false, error };
  }
};

// Function to create a new teacher
export const createTeacher = async (teacherData) => {
  try {
    const { data, error } = await supabase
      .from('teacher_profiles')
      .insert(teacherData)
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
export const updateTeacher = async (teacherId, teacherData) => {
  try {
    const { data, error } = await supabase
      .from('teacher_profiles')
      .update(teacherData)
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
export const deleteTeacher = async (teacherId) => {
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

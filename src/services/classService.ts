
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define interfaces to prevent excessive type instantiation
export interface ClassData {
  id?: string;
  name: string;
  description?: string;
  teacher_id?: string;
  date: string;
  start_time: string;
  end_time: string;
  max_capacity?: number;
  enrolled_count?: number;
  category?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Function to create a new class
export const createClass = async (classData: ClassData) => {
  try {
    const { data, error } = await supabase
      .from('classes')
      .insert(classData)
      .select()
      .single();

    if (error) {
      console.error('Error creating class:', error);
      toast.error('Failed to create class');
      return { success: false, error };
    }

    toast.success('Class created successfully');
    return { success: true, class: data };
  } catch (error) {
    console.error('Exception creating class:', error);
    toast.error('An error occurred while creating class');
    return { success: false, error };
  }
};

// Function to get all classes
export const getAllClasses = async () => {
  try {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching classes:', error);
      return { success: false, error };
    }

    return { success: true, classes: data };
  } catch (error) {
    console.error('Exception fetching classes:', error);
    return { success: false, error };
  }
};

// Function to get classes for today
export const getClassesForToday = async () => {
  try {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('date', today)
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching today\'s classes:', error);
      return { success: false, error };
    }

    return { success: true, classes: data };
  } catch (error) {
    console.error('Exception fetching today\'s classes:', error);
    return { success: false, error };
  }
};

// Function to get the total count of classes
export const getClassesCount = async () => {
  try {
    const { count, error } = await supabase
      .from('classes')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error counting classes:', error);
      return { success: false, error };
    }

    return { success: true, count };
  } catch (error) {
    console.error('Exception counting classes:', error);
    return { success: false, error };
  }
};

// Function to get a class by ID
export const getClassById = async (classId: string) => {
  try {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('id', classId)
      .single();

    if (error) {
      console.error('Error fetching class:', error);
      return { success: false, error };
    }

    return { success: true, class: data };
  } catch (error) {
    console.error('Exception fetching class:', error);
    return { success: false, error };
  }
};

// Function to update a class
export const updateClass = async (classId: string, classData: Partial<ClassData>) => {
  try {
    const { data, error } = await supabase
      .from('classes')
      .update(classData)
      .eq('id', classId)
      .select()
      .single();

    if (error) {
      console.error('Error updating class:', error);
      toast.error('Failed to update class');
      return { success: false, error };
    }

    toast.success('Class updated successfully');
    return { success: true, class: data };
  } catch (error) {
    console.error('Exception updating class:', error);
    toast.error('An error occurred while updating class');
    return { success: false, error };
  }
};

// Function to delete a class
export const deleteClass = async (classId: string) => {
  try {
    const { error } = await supabase
      .from('classes')
      .delete()
      .eq('id', classId);

    if (error) {
      console.error('Error deleting class:', error);
      toast.error('Failed to delete class');
      return { success: false, error };
    }

    toast.success('Class deleted successfully');
    return { success: true };
  } catch (error) {
    console.error('Exception deleting class:', error);
    toast.error('An error occurred while deleting class');
    return { success: false, error };
  }
};

// Function to get classes for a teacher
export const getTeacherClasses = async (teacherId: string) => {
  try {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('teacher_id', teacherId)
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching teacher classes:', error);
      return { success: false, error };
    }

    return { success: true, classes: data };
  } catch (error) {
    console.error('Exception fetching teacher classes:', error);
    return { success: false, error };
  }
};

// Function to check if a student is enrolled in a class
export const isStudentEnrolled = async (studentId: string, classId: string) => {
  try {
    const { data, error } = await supabase
      .from('enrollments')
      .select('*')
      .eq('student_id', studentId)
      .eq('class_id', classId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows returned" error
      console.error('Error checking enrollment:', error);
      return { success: false, error };
    }

    return { success: true, enrolled: !!data };
  } catch (error) {
    console.error('Exception checking enrollment:', error);
    return { success: false, error };
  }
};

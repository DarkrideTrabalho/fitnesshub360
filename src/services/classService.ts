
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define interface for class data to avoid type errors
interface ClassData {
  id?: string;
  teacher_id?: string;
  name: string;
  description?: string;
  category?: string;
  date: string;
  start_time: string;
  end_time: string;
  max_capacity?: number;
  enrolled_count?: number;
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
    toast.error('An error occurred while creating the class');
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
    toast.error('An error occurred while updating the class');
    return { success: false, error };
  }
};

// Function to delete a class
export const deleteClass = async (classId: string) => {
  try {
    // First, delete all enrollments for this class
    const { error: enrollmentError } = await supabase
      .from('enrollments')
      .delete()
      .eq('class_id', classId);

    if (enrollmentError) {
      console.error('Error deleting class enrollments:', enrollmentError);
      toast.error('Failed to delete class enrollments');
      return { success: false, error: enrollmentError };
    }

    // Then delete the class
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
    toast.error('An error occurred while deleting the class');
    return { success: false, error };
  }
};

// Interface for filters to ensure type safety
interface ClassFilters {
  [key: string]: any;
}

// Function to get classes
export const getClasses = async (filters: ClassFilters = {}) => {
  try {
    let query = supabase.from('classes').select('*, teacher_profiles(name, id, avatar_url)');
    
    // Apply filters if any
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query = query.eq(key, value);
        }
      });
    }
    
    const { data, error } = await query.order('date', { ascending: true });

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

// Function to enroll a student in a class
export const enrollStudentInClass = async (classId: string, studentId: string) => {
  try {
    // Check if student is already enrolled
    const { data: existingEnrollment, error: checkError } = await supabase
      .from('enrollments')
      .select('id')
      .eq('class_id', classId)
      .eq('student_id', studentId)
      .maybeSingle();  // Using maybeSingle instead of single to avoid errors

    if (checkError) {
      console.error('Error checking existing enrollment:', checkError);
      toast.error('Failed to check enrollment status');
      return { success: false, error: checkError };
    }

    if (existingEnrollment) {
      toast.info('Student is already enrolled in this class');
      return { success: false, alreadyEnrolled: true };
    }

    // Enroll the student
    const { data, error } = await supabase
      .from('enrollments')
      .insert({
        class_id: classId,
        student_id: studentId,
        enrolled_at: new Date().toISOString(),
        attended: false
      })
      .select()
      .single();

    if (error) {
      console.error('Error enrolling student:', error);
      toast.error('Failed to enroll student');
      return { success: false, error };
    }

    toast.success('Student enrolled successfully');
    return { success: true, enrollment: data };
  } catch (error) {
    console.error('Exception enrolling student:', error);
    toast.error('An error occurred while enrolling the student');
    return { success: false, error };
  }
};

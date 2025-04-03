
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Function to get all student profiles
export const getAllStudents = async () => {
  try {
    const { data, error } = await supabase
      .from('student_profiles')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching students:', error);
      return { success: false, error };
    }

    return { success: true, students: data };
  } catch (error) {
    console.error('Exception fetching students:', error);
    return { success: false, error };
  }
};

// Function to get the total number of students
export const getStudentsCount = async () => {
  try {
    const { count, error } = await supabase
      .from('student_profiles')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error counting students:', error);
      return { success: false, error };
    }

    return { success: true, count };
  } catch (error) {
    console.error('Exception counting students:', error);
    return { success: false, error };
  }
};

// Function to get students with overdue payments
export const getOverduePayments = async () => {
  try {
    const { data, error } = await supabase
      .from('student_payments')
      .select('*, student_profiles(name, email, id)')
      .eq('status', 'overdue');

    if (error) {
      console.error('Error fetching overdue payments:', error);
      return { success: false, error };
    }

    return { success: true, payments: data };
  } catch (error) {
    console.error('Exception fetching overdue payments:', error);
    return { success: false, error };
  }
};

// Function to get the count of overdue payments
export const getOverduePaymentsCount = async () => {
  try {
    const { count, error } = await supabase
      .from('student_payments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'overdue');

    if (error) {
      console.error('Error counting overdue payments:', error);
      return { success: false, error };
    }

    return { success: true, count };
  } catch (error) {
    console.error('Exception counting overdue payments:', error);
    return { success: false, error };
  }
};

// Function to create a new student
export const createStudent = async (studentData) => {
  try {
    const { data, error } = await supabase
      .from('student_profiles')
      .insert(studentData)
      .select()
      .single();

    if (error) {
      console.error('Error creating student:', error);
      toast.error('Failed to create student');
      return { success: false, error };
    }

    toast.success('Student created successfully');
    return { success: true, student: data };
  } catch (error) {
    console.error('Exception creating student:', error);
    toast.error('An error occurred while creating student');
    return { success: false, error };
  }
};

// Function to update a student
export const updateStudent = async (studentId, studentData) => {
  try {
    const { data, error } = await supabase
      .from('student_profiles')
      .update(studentData)
      .eq('id', studentId)
      .select()
      .single();

    if (error) {
      console.error('Error updating student:', error);
      toast.error('Failed to update student');
      return { success: false, error };
    }

    toast.success('Student updated successfully');
    return { success: true, student: data };
  } catch (error) {
    console.error('Exception updating student:', error);
    toast.error('An error occurred while updating student');
    return { success: false, error };
  }
};

// Function to delete a student
export const deleteStudent = async (studentId) => {
  try {
    const { error } = await supabase
      .from('student_profiles')
      .delete()
      .eq('id', studentId);

    if (error) {
      console.error('Error deleting student:', error);
      toast.error('Failed to delete student');
      return { success: false, error };
    }

    toast.success('Student deleted successfully');
    return { success: true };
  } catch (error) {
    console.error('Exception deleting student:', error);
    toast.error('An error occurred while deleting student');
    return { success: false, error };
  }
};

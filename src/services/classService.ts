
import { supabase } from '@/integrations/supabase/client';
import { FitnessClass, convertDbClassToFitnessClass } from '@/lib/types/classes';
import { toast } from 'sonner';

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

    const formattedClasses = data.map(cls => convertDbClassToFitnessClass(cls));

    return { success: true, classes: formattedClasses };
  } catch (error) {
    console.error('Exception fetching classes:', error);
    return { success: false, error };
  }
};

// Function to get upcoming classes (today and future)
export const getUpcomingClasses = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .gte('date', today.toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching upcoming classes:', error);
      return { success: false, error };
    }

    const formattedClasses = data.map(cls => convertDbClassToFitnessClass(cls));

    return { success: true, classes: formattedClasses };
  } catch (error) {
    console.error('Exception fetching upcoming classes:', error);
    return { success: false, error };
  }
};

// Function to get upcoming classes for today
export const getUpcomingClassesToday = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('date', today)
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching today\'s classes:', error);
      return { success: false, error };
    }

    const formattedClasses = data.map(cls => convertDbClassToFitnessClass(cls));

    return { success: true, classes: formattedClasses };
  } catch (error) {
    console.error('Exception fetching today\'s classes:', error);
    return { success: false, error };
  }
};

// Function to get a specific class by ID
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

    const formattedClass = convertDbClassToFitnessClass(data);

    return { success: true, class: formattedClass };
  } catch (error) {
    console.error('Exception fetching class:', error);
    return { success: false, error };
  }
};

// Function to create a class
export const createClass = async (classData: Omit<FitnessClass, 'id' | 'enrolledCount'>) => {
  try {
    const { data, error } = await supabase
      .from('classes')
      .insert({
        name: classData.name,
        description: classData.description,
        category: classData.category,
        teacher_id: classData.teacherId,
        date: classData.date.toISOString().split('T')[0],
        start_time: classData.startTime,
        end_time: classData.endTime,
        max_capacity: classData.maxCapacity,
        image_url: classData.imageUrl,
        location: classData.location
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating class:', error);
      toast.error('Failed to create class');
      return { success: false, error };
    }

    toast.success('Class created successfully');
    return { success: true, class: convertDbClassToFitnessClass(data) };
  } catch (error) {
    console.error('Exception creating class:', error);
    toast.error('An error occurred while creating class');
    return { success: false, error };
  }
};

// Function to update a class
export const updateClass = async (classId: string, classData: Partial<FitnessClass>) => {
  try {
    const updateData: any = {};
    
    if (classData.name) updateData.name = classData.name;
    if (classData.description !== undefined) updateData.description = classData.description;
    if (classData.category) updateData.category = classData.category;
    if (classData.teacherId) updateData.teacher_id = classData.teacherId;
    if (classData.date) updateData.date = classData.date.toISOString().split('T')[0];
    if (classData.startTime) updateData.start_time = classData.startTime;
    if (classData.endTime) updateData.end_time = classData.endTime;
    if (classData.maxCapacity) updateData.max_capacity = classData.maxCapacity;
    if (classData.imageUrl !== undefined) updateData.image_url = classData.imageUrl;
    if (classData.location !== undefined) updateData.location = classData.location;

    const { data, error } = await supabase
      .from('classes')
      .update(updateData)
      .eq('id', classId)
      .select()
      .single();

    if (error) {
      console.error('Error updating class:', error);
      toast.error('Failed to update class');
      return { success: false, error };
    }

    toast.success('Class updated successfully');
    return { success: true, class: convertDbClassToFitnessClass(data) };
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

// Function to get classes by teacher ID
export const getClassesByTeacherId = async (teacherId: string) => {
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

    const formattedClasses = data.map(cls => convertDbClassToFitnessClass(cls));

    return { success: true, classes: formattedClasses };
  } catch (error) {
    console.error('Exception fetching teacher classes:', error);
    return { success: false, error };
  }
};

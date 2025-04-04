
import { supabase } from '@/integrations/supabase/client';
import { Vacation } from '@/lib/types';
import { toast } from 'sonner';

// Function to get all vacations
export const getAllVacations = async () => {
  try {
    const { data, error } = await supabase
      .from('vacations')
      .select('*')
      .order('start_date', { ascending: false });

    if (error) {
      console.error('Error fetching vacations:', error);
      return { success: false, error };
    }

    const formattedVacations = data.map(vacation => ({
      id: vacation.id,
      teacherId: vacation.user_id || '',
      userId: vacation.user_id || '',
      teacherName: vacation.teacher_name || '',
      startDate: new Date(vacation.start_date),
      endDate: new Date(vacation.end_date),
      reason: vacation.reason,
      status: vacation.status,
      approved: vacation.status === 'approved'
    }));

    return { success: true, vacations: formattedVacations };
  } catch (error) {
    console.error('Exception fetching vacations:', error);
    return { success: false, error };
  }
};

// Function to get pending vacations
export const getPendingVacations = async () => {
  try {
    const { data, error } = await supabase
      .from('vacations')
      .select('*')
      .eq('status', 'pending')
      .order('start_date', { ascending: true });

    if (error) {
      console.error('Error fetching pending vacations:', error);
      return { success: false, error };
    }

    const formattedVacations = data.map(vacation => ({
      id: vacation.id,
      teacherId: vacation.user_id || '',
      userId: vacation.user_id || '',
      teacherName: vacation.teacher_name || '',
      startDate: new Date(vacation.start_date),
      endDate: new Date(vacation.end_date),
      reason: vacation.reason,
      status: vacation.status,
      approved: vacation.status === 'approved'
    }));

    return { success: true, vacations: formattedVacations };
  } catch (error) {
    console.error('Exception fetching pending vacations:', error);
    return { success: false, error };
  }
};

// Function to get vacations by teacher ID
export const getVacationsByTeacherId = async (teacherId: string) => {
  try {
    const { data, error } = await supabase
      .from('vacations')
      .select('*')
      .eq('user_id', teacherId)
      .order('start_date', { ascending: false });

    if (error) {
      console.error('Error fetching teacher vacations:', error);
      return { success: false, error };
    }

    const formattedVacations = data.map(vacation => ({
      id: vacation.id,
      teacherId: vacation.user_id || '',
      userId: vacation.user_id || '',
      teacherName: vacation.teacher_name || '',
      startDate: new Date(vacation.start_date),
      endDate: new Date(vacation.end_date),
      reason: vacation.reason,
      status: vacation.status,
      approved: vacation.status === 'approved'
    }));

    return { success: true, vacations: formattedVacations };
  } catch (error) {
    console.error('Exception fetching teacher vacations:', error);
    return { success: false, error };
  }
};

// Function to create a vacation request
export const createVacationRequest = async (vacationData: {
  teacherId: string;
  teacherName: string;
  startDate: Date;
  endDate: Date;
  reason: string;
}) => {
  try {
    const { data, error } = await supabase
      .from('vacations')
      .insert({
        user_id: vacationData.teacherId,
        teacher_name: vacationData.teacherName,
        start_date: vacationData.startDate.toISOString().split('T')[0],
        end_date: vacationData.endDate.toISOString().split('T')[0],
        reason: vacationData.reason,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating vacation request:', error);
      toast.error('Failed to create vacation request');
      return { success: false, error };
    }

    toast.success('Vacation request created successfully');
    return { success: true, vacation: data };
  } catch (error) {
    console.error('Exception creating vacation request:', error);
    toast.error('An error occurred while creating vacation request');
    return { success: false, error };
  }
};

// Function to update a vacation request status (approve/reject)
export const updateVacationStatus = async (vacationId: string, status: 'approved' | 'rejected') => {
  try {
    const { data, error } = await supabase
      .from('vacations')
      .update({ status })
      .eq('id', vacationId)
      .select()
      .single();

    if (error) {
      console.error(`Error ${status === 'approved' ? 'approving' : 'rejecting'} vacation:`, error);
      toast.error(`Failed to ${status === 'approved' ? 'approve' : 'reject'} vacation`);
      return { success: false, error };
    }

    // If approved, update teacher's vacation status
    if (status === 'approved' && data) {
      // Get the teacher's ID from the vacation record
      const userId = data.user_id;
      
      if (userId) {
        const { error: teacherError } = await supabase
          .from('teacher_profiles')
          .update({ on_vacation: true })
          .eq('user_id', userId);
          
        if (teacherError) {
          console.error('Error updating teacher vacation status:', teacherError);
        }
      }
    }

    toast.success(`Vacation ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
    return { success: true, vacation: data };
  } catch (error) {
    console.error(`Exception ${status === 'approved' ? 'approving' : 'rejecting'} vacation:`, error);
    toast.error(`An error occurred while ${status === 'approved' ? 'approving' : 'rejecting'} vacation`);
    return { success: false, error };
  }
};

// Function to delete a vacation request
export const deleteVacation = async (vacationId: string) => {
  try {
    const { error } = await supabase
      .from('vacations')
      .delete()
      .eq('id', vacationId);

    if (error) {
      console.error('Error deleting vacation:', error);
      toast.error('Failed to delete vacation');
      return { success: false, error };
    }

    toast.success('Vacation deleted successfully');
    return { success: true };
  } catch (error) {
    console.error('Exception deleting vacation:', error);
    toast.error('An error occurred while deleting vacation');
    return { success: false, error };
  }
};

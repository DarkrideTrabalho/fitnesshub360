
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Vacation {
  id: string;
  user_id: string;
  teacher_name: string;
  start_date: string;
  end_date: string;
  reason?: string;
  status: string;
  created_at: string;
}

// Function to request a vacation
export const requestVacation = async (vacationData) => {
  try {
    const { data, error } = await supabase
      .from('vacations')
      .insert({
        ...vacationData,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Error requesting vacation:', error);
      toast.error('Failed to submit vacation request');
      return { success: false, error };
    }

    toast.success('Vacation request submitted successfully');
    return { success: true, vacation: data };
  } catch (error) {
    console.error('Exception requesting vacation:', error);
    toast.error('An error occurred while submitting vacation request');
    return { success: false, error };
  }
};

// Function to get vacation requests for a teacher
export const getTeacherVacations = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('vacations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching teacher vacations:', error);
      return { success: false, error };
    }

    return { success: true, vacations: data };
  } catch (error) {
    console.error('Exception fetching teacher vacations:', error);
    return { success: false, error };
  }
};

// Function to get pending vacation requests
export const getPendingVacationRequests = async () => {
  try {
    // Fix: Query by status instead of a non-existent 'approved' column
    const { data, error } = await supabase
      .from('vacations')
      .select('*')
      .eq('status', 'pending')
      .order('start_date', { ascending: true });

    if (error) {
      console.error('Error fetching pending vacations:', error);
      return { success: false, error };
    }

    return { success: true, vacations: data };
  } catch (error) {
    console.error('Exception fetching pending vacations:', error);
    return { success: false, error };
  }
};

// Function to approve or reject a vacation request
export const handleVacationRequest = async (vacationId, approved) => {
  try {
    const status = approved ? 'approved' : 'rejected';
    
    const { data, error } = await supabase
      .from('vacations')
      .update({ 
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', vacationId)
      .select()
      .single();

    if (error) {
      console.error(`Error ${status} vacation:`, error);
      return { success: false, error };
    }

    // If approved, update the teacher's on_vacation status
    if (approved) {
      const today = new Date().toISOString().split('T')[0];
      const startDate = data.start_date;
      const endDate = data.end_date;
      
      // Check if the vacation is current
      const isCurrentVacation = today >= startDate && today <= endDate;
      
      if (isCurrentVacation && data.user_id) {
        const { error: teacherError } = await supabase
          .from('teacher_profiles')
          .update({ on_vacation: true })
          .eq('user_id', data.user_id);
          
        if (teacherError) {
          console.error('Error updating teacher vacation status:', teacherError);
        }
      }
    }

    return { success: true, vacation: data };
  } catch (error) {
    console.error('Exception handling vacation request:', error);
    return { success: false, error };
  }
};

// Function to cancel a vacation request
export const cancelVacationRequest = async (vacationId) => {
  try {
    const { data, error } = await supabase
      .from('vacations')
      .delete()
      .eq('id', vacationId)
      .select()
      .single();

    if (error) {
      console.error('Error canceling vacation request:', error);
      toast.error('Failed to cancel vacation request');
      return { success: false, error };
    }

    toast.success('Vacation request canceled successfully');
    return { success: true };
  } catch (error) {
    console.error('Exception canceling vacation request:', error);
    toast.error('An error occurred while canceling vacation request');
    return { success: false, error };
  }
};

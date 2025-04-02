
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Defining interface for vacation data to match the database schema
export interface Vacation {
  id: string;
  user_id?: string;
  start_date: string;
  end_date: string;
  reason?: string;
  teacher_name?: string;
  created_at?: string;
  updated_at?: string;
  status?: string; // Using status instead of approved
}

// Function to request a vacation
export const requestVacation = async (teacherId: string, teacherName: string, startDate: string, endDate: string, reason: string) => {
  try {
    const { data, error } = await supabase
      .from('vacations')
      .insert({
        user_id: teacherId, // Store teacher ID in user_id field
        teacher_name: teacherName,
        start_date: startDate,
        end_date: endDate,
        reason: reason
      })
      .select()
      .single();

    if (error) {
      console.error('Error requesting vacation:', error);
      toast.error('Failed to request vacation');
      return { success: false, error };
    }

    toast.success('Vacation request submitted successfully');
    return { success: true, vacation: data as Vacation };
  } catch (error) {
    console.error('Exception requesting vacation:', error);
    toast.error('An error occurred while submitting vacation request');
    return { success: false, error };
  }
};

// Function to get pending vacation requests
export const getPendingVacationRequests = async () => {
  try {
    const { data, error } = await supabase
      .from('vacations')
      .select('*')
      .is('status', null) // Use status field
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching pending vacation requests:', error);
      return { success: false, error };
    }

    return { success: true, vacations: data as Vacation[] };
  } catch (error) {
    console.error('Exception fetching pending vacation requests:', error);
    return { success: false, error };
  }
};

// Function to approve or reject a vacation request
export const handleVacationRequest = async (vacationId: string, isApproved: boolean) => {
  try {
    const { data, error } = await supabase
      .from('vacations')
      .update({
        status: isApproved ? 'approved' : 'rejected' // Use status instead of approved
      })
      .eq('id', vacationId)
      .select()
      .single();

    if (error) {
      console.error('Error handling vacation request:', error);
      toast.error(`Failed to ${isApproved ? 'approve' : 'reject'} vacation request`);
      return { success: false, error };
    }

    // Cast to our Vacation type to properly type the response
    const vacation = data as Vacation;

    // If approved, update teacher's on_vacation status if the vacation starts today
    if (isApproved) {
      const today = new Date().toISOString().split('T')[0];
      
      if (vacation.start_date <= today && vacation.end_date >= today) {
        // Use user_id field which stores the teacher ID in our schema
        await supabase
          .from('teacher_profiles')
          .update({ on_vacation: true })
          .eq('user_id', vacation.user_id);
      }
      
      // Create a notification
      await supabase
        .from('notifications')
        .insert({
          user_id: vacation.user_id,
          title: 'Vacation Request Approved',
          message: `Your vacation request from ${vacation.start_date} to ${vacation.end_date} has been approved.`,
          type: 'vacation_approval',
          read: false
        });
    } else {
      // Create a notification for rejection
      await supabase
        .from('notifications')
        .insert({
          user_id: vacation.user_id,
          title: 'Vacation Request Rejected',
          message: `Your vacation request from ${vacation.start_date} to ${vacation.end_date} has been rejected.`,
          type: 'vacation_rejection',
          read: false
        });
    }

    toast.success(`Vacation request ${isApproved ? 'approved' : 'rejected'} successfully`);
    return { success: true, vacation };
  } catch (error) {
    console.error('Exception handling vacation request:', error);
    toast.error('An error occurred while processing the vacation request');
    return { success: false, error };
  }
};

// Function to get teacher's vacations
export const getTeacherVacations = async (teacherId: string) => {
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

    return { success: true, vacations: data as Vacation[] };
  } catch (error) {
    console.error('Exception fetching teacher vacations:', error);
    return { success: false, error };
  }
};

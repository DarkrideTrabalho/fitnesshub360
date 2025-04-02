
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Function to request a vacation
export const requestVacation = async (teacherId: string, teacherName: string, startDate: string, endDate: string, reason: string) => {
  try {
    const { data, error } = await supabase
      .from('vacations')
      .insert({
        teacher_id: teacherId,
        teacher_name: teacherName,
        start_date: startDate,
        end_date: endDate,
        reason: reason,
        approved: false
      })
      .select()
      .single();

    if (error) {
      console.error('Error requesting vacation:', error);
      toast.error('Failed to request vacation');
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

// Function to get pending vacation requests
export const getPendingVacationRequests = async () => {
  try {
    const { data, error } = await supabase
      .from('vacations')
      .select('*')
      .eq('approved', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching pending vacation requests:', error);
      return { success: false, error };
    }

    return { success: true, vacations: data };
  } catch (error) {
    console.error('Exception fetching pending vacation requests:', error);
    return { success: false, error };
  }
};

// Function to approve or reject a vacation request
export const handleVacationRequest = async (vacationId: string, approved: boolean) => {
  try {
    const { data, error } = await supabase
      .from('vacations')
      .update({ approved })
      .eq('id', vacationId)
      .select()
      .single();

    if (error) {
      console.error('Error handling vacation request:', error);
      toast.error(`Failed to ${approved ? 'approve' : 'reject'} vacation request`);
      return { success: false, error };
    }

    // If approved, update teacher's on_vacation status if the vacation starts today
    if (approved) {
      const today = new Date().toISOString().split('T')[0];
      
      if (data.start_date <= today && data.end_date >= today) {
        await supabase
          .from('teacher_profiles')
          .update({ on_vacation: true })
          .eq('id', data.teacher_id);
      }
      
      // Create a notification
      await supabase
        .from('notifications')
        .insert({
          user_id: data.user_id,
          title: 'Vacation Request Approved',
          message: `Your vacation request from ${data.start_date} to ${data.end_date} has been approved.`,
          type: 'vacation_approval',
          read: false
        });
    } else {
      // Create a notification for rejection
      await supabase
        .from('notifications')
        .insert({
          user_id: data.user_id,
          title: 'Vacation Request Rejected',
          message: `Your vacation request from ${data.start_date} to ${data.end_date} has been rejected.`,
          type: 'vacation_rejection',
          read: false
        });
    }

    toast.success(`Vacation request ${approved ? 'approved' : 'rejected'} successfully`);
    return { success: true, vacation: data };
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
      .eq('teacher_id', teacherId)
      .order('start_date', { ascending: false });

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

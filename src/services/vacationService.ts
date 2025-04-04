
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Get all vacation requests
export const getVacationRequests = async () => {
  try {
    const { data, error } = await supabase
      .from('vacations')
      .select('*')
      .order('start_date', { ascending: true });

    if (error) {
      console.error('Error fetching vacation requests:', error);
      toast.error('Failed to fetch vacation requests');
      return { success: false, error };
    }

    const vacations = data.map(vacation => ({
      id: vacation.id,
      teacherId: vacation.user_id || '', // Map user_id to teacherId
      teacherName: vacation.teacher_name || '',
      startDate: vacation.start_date,
      endDate: vacation.end_date,
      reason: vacation.reason || '',
      status: vacation.status || 'pending',
      approved: vacation.status === 'approved'
    }));

    return { success: true, vacations };
  } catch (error) {
    console.error('Exception fetching vacation requests:', error);
    toast.error('An error occurred while fetching vacation requests');
    return { success: false, error };
  }
};

// Get pending vacation requests (not approved or rejected yet)
export const getPendingVacationRequests = async () => {
  try {
    const { data, error } = await supabase
      .from('vacations')
      .select('*')
      .eq('status', 'pending')
      .order('start_date', { ascending: true });

    if (error) {
      console.error('Error fetching pending vacation requests:', error);
      toast.error('Failed to fetch pending vacation requests');
      return { success: false, error };
    }

    const vacations = data.map(vacation => ({
      id: vacation.id,
      teacherId: vacation.user_id || '', // Map user_id to teacherId
      teacherName: vacation.teacher_name || '',
      startDate: vacation.start_date,
      endDate: vacation.end_date,
      reason: vacation.reason || '',
      status: vacation.status || 'pending',
      approved: vacation.status === 'approved'
    }));

    return { success: true, vacations };
  } catch (error) {
    console.error('Exception fetching pending vacation requests:', error);
    toast.error('An error occurred while fetching pending vacation requests');
    return { success: false, error };
  }
};

// Approve a vacation request
export const approveVacationRequest = async (vacationId: string) => {
  try {
    // Update the vacation request status
    const { error } = await supabase
      .from('vacations')
      .update({ status: 'approved' })
      .eq('id', vacationId);

    if (error) {
      console.error('Error approving vacation request:', error);
      toast.error('Failed to approve vacation request');
      return { success: false, error };
    }

    // Get the vacation details to update the teacher's status
    const { data: vacationData } = await supabase
      .from('vacations')
      .select('*')
      .eq('id', vacationId)
      .single();

    if (vacationData && vacationData.user_id) {  // Using user_id instead of teacher_id
      // Update the teacher's vacation status
      const { error: teacherError } = await supabase
        .from('teacher_profiles')
        .update({ on_vacation: true })
        .eq('id', vacationData.user_id);

      if (teacherError) {
        console.error('Error updating teacher vacation status:', teacherError);
      }
    }

    toast.success('Vacation request approved');
    return { success: true };
  } catch (error) {
    console.error('Exception approving vacation request:', error);
    toast.error('An error occurred while approving vacation request');
    return { success: false, error };
  }
};

// Reject a vacation request
export const rejectVacationRequest = async (vacationId: string) => {
  try {
    const { error } = await supabase
      .from('vacations')
      .update({ status: 'rejected' })
      .eq('id', vacationId);

    if (error) {
      console.error('Error rejecting vacation request:', error);
      toast.error('Failed to reject vacation request');
      return { success: false, error };
    }

    toast.success('Vacation request rejected');
    return { success: true };
  } catch (error) {
    console.error('Exception rejecting vacation request:', error);
    toast.error('An error occurred while rejecting vacation request');
    return { success: false, error };
  }
};

// Create a new vacation request
export const createVacationRequest = async (teacherId: string, teacherName: string, startDate: Date, endDate: Date, reason: string) => {
  try {
    const { data, error } = await supabase
      .from('vacations')
      .insert({
        user_id: teacherId,  // Using user_id instead of teacher_id
        teacher_name: teacherName,
        start_date: startDate,
        end_date: endDate,
        reason: reason,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating vacation request:', error);
      toast.error('Failed to create vacation request');
      return { success: false, error };
    }

    toast.success('Vacation request submitted successfully');
    return { success: true, vacation: data };
  } catch (error) {
    console.error('Exception creating vacation request:', error);
    toast.error('An error occurred while creating vacation request');
    return { success: false, error };
  }
};

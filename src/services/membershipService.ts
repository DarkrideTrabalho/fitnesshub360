
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Function to update student membership status
export const updateMembershipStatus = async (studentId: string, status: 'active' | 'inactive' | 'overdue') => {
  try {
    const { data, error } = await supabase
      .from('student_profiles')
      .update({ membership_status: status, updated_at: new Date().toISOString() })
      .eq('id', studentId)
      .select()
      .single();

    if (error) {
      console.error('Error updating membership status:', error);
      toast.error('Failed to update membership status');
      return { success: false, error };
    }

    toast.success(`Membership status updated to ${status}`);
    return { success: true, student: data };
  } catch (error) {
    console.error('Exception updating membership status:', error);
    toast.error('An error occurred while updating membership status');
    return { success: false, error };
  }
};

// Function to create a payment record
export const createPayment = async (studentId: string, amount: number, dueDate: string) => {
  try {
    const { data, error } = await supabase
      .from('student_payments')
      .insert({
        student_id: studentId,
        amount: amount,
        payment_date: null,
        due_date: dueDate,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating payment record:', error);
      toast.error('Failed to create payment record');
      return { success: false, error };
    }

    toast.success('Payment record created successfully');
    return { success: true, payment: data };
  } catch (error) {
    console.error('Exception creating payment record:', error);
    toast.error('An error occurred while creating payment record');
    return { success: false, error };
  }
};

// Function to mark a payment as paid
export const markPaymentAsPaid = async (paymentId: string) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('student_payments')
      .update({ 
        status: 'paid', 
        payment_date: today,
        updated_at: new Date().toISOString()
      })
      .eq('id', paymentId)
      .select()
      .single();

    if (error) {
      console.error('Error marking payment as paid:', error);
      toast.error('Failed to mark payment as paid');
      return { success: false, error };
    }

    // Update student's membership status to active
    if (data?.student_id) {
      await updateMembershipStatus(data.student_id, 'active');
    }

    toast.success('Payment marked as paid');
    return { success: true, payment: data };
  } catch (error) {
    console.error('Exception marking payment as paid:', error);
    toast.error('An error occurred while marking payment as paid');
    return { success: false, error };
  }
};

// Function to get student payments
export const getStudentPayments = async (studentId: string) => {
  try {
    const { data, error } = await supabase
      .from('student_payments')
      .select('*')
      .eq('student_id', studentId)
      .order('due_date', { ascending: false });

    if (error) {
      console.error('Error fetching student payments:', error);
      return { success: false, error };
    }

    return { success: true, payments: data };
  } catch (error) {
    console.error('Exception fetching student payments:', error);
    return { success: false, error };
  }
};

// Function to get overdue payments
export const getOverduePayments = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('student_payments')
      .select('*, student_profiles(name, email, id)')
      .eq('status', 'overdue')
      .order('due_date', { ascending: false });

    if (error) {
      console.error('Error fetching overdue payments:', error);
      return { success: false, error, overduePayments: 0 };
    }

    return { success: true, payments: data, overduePayments: data.length };
  } catch (error) {
    console.error('Exception fetching overdue payments:', error);
    return { success: false, error, overduePayments: 0 };
  }
};

// Function to get total revenue
export const getTotalRevenue = async () => {
  try {
    const { data, error } = await supabase
      .from('student_payments')
      .select('amount')
      .eq('status', 'paid');

    if (error) {
      console.error('Error fetching total revenue:', error);
      return { success: false, error, totalRevenue: 0 };
    }

    const totalRevenue = data.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
    
    return { success: true, totalRevenue };
  } catch (error) {
    console.error('Exception fetching total revenue:', error);
    return { success: false, error, totalRevenue: 0 };
  }
};

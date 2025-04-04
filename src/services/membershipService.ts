
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Function to get total revenue
export const getTotalRevenue = async (): Promise<{ success: boolean; totalRevenue: number; error?: any }> => {
  try {
    const { data, error } = await supabase
      .from('student_payments')
      .select('amount')
      .eq('status', 'paid');

    if (error) {
      console.error('Error fetching total revenue:', error);
      return { success: false, totalRevenue: 0, error };
    }

    const totalRevenue = data.reduce((total, payment) => {
      return total + Number(payment.amount);
    }, 0);

    return { success: true, totalRevenue };
  } catch (error) {
    console.error('Exception fetching total revenue:', error);
    return { success: false, totalRevenue: 0, error };
  }
};

// Function to get all payments
export const getAllPayments = async () => {
  try {
    const { data, error } = await supabase
      .from('student_payments')
      .select(`
        *,
        student_profiles:student_id (
          name,
          email
        )
      `)
      .order('due_date', { ascending: false });

    if (error) {
      console.error('Error fetching payments:', error);
      return { success: false, error };
    }

    return { success: true, payments: data };
  } catch (error) {
    console.error('Exception fetching payments:', error);
    return { success: false, error };
  }
};

// Function to get overdue payments
export const getOverduePayments = async () => {
  try {
    const { data, error } = await supabase
      .from('student_payments')
      .select(`
        *,
        student_profiles:student_id (
          name,
          email
        )
      `)
      .eq('status', 'overdue')
      .order('due_date', { ascending: true });

    if (error) {
      console.error('Error fetching overdue payments:', error);
      return { success: false, error };
    }

    return { success: true, overduePayments: data };
  } catch (error) {
    console.error('Exception fetching overdue payments:', error);
    return { success: false, error };
  }
};

// Function to get pending payments
export const getPendingPayments = async () => {
  try {
    const { data, error } = await supabase
      .from('student_payments')
      .select(`
        *,
        student_profiles:student_id (
          name,
          email
        )
      `)
      .eq('status', 'pending')
      .order('due_date', { ascending: true });

    if (error) {
      console.error('Error fetching pending payments:', error);
      return { success: false, error };
    }

    return { success: true, pendingPayments: data };
  } catch (error) {
    console.error('Exception fetching pending payments:', error);
    return { success: false, error };
  }
};

// Function to create a payment
export const createPayment = async (paymentData: {
  studentId: string;
  amount: number;
  dueDate: string;
  paymentDate?: string;
}) => {
  try {
    const { data, error } = await supabase
      .from('student_payments')
      .insert({
        student_id: paymentData.studentId,
        amount: paymentData.amount,
        due_date: paymentData.dueDate,
        payment_date: paymentData.paymentDate || null
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating payment:', error);
      toast.error('Failed to create payment');
      return { success: false, error };
    }

    toast.success('Payment created successfully');
    return { success: true, payment: data };
  } catch (error) {
    console.error('Exception creating payment:', error);
    toast.error('An error occurred while creating payment');
    return { success: false, error };
  }
};

// Function to update a payment
export const updatePayment = async (
  paymentId: string,
  paymentData: {
    amount?: number;
    dueDate?: string;
    paymentDate?: string | null;
    status?: string;
  }
) => {
  try {
    const updateData: any = {};
    if (paymentData.amount !== undefined) updateData.amount = paymentData.amount;
    if (paymentData.dueDate !== undefined) updateData.due_date = paymentData.dueDate;
    if (paymentData.paymentDate !== undefined) updateData.payment_date = paymentData.paymentDate;
    if (paymentData.status !== undefined) updateData.status = paymentData.status;

    const { data, error } = await supabase
      .from('student_payments')
      .update(updateData)
      .eq('id', paymentId)
      .select()
      .single();

    if (error) {
      console.error('Error updating payment:', error);
      toast.error('Failed to update payment');
      return { success: false, error };
    }

    toast.success('Payment updated successfully');
    return { success: true, payment: data };
  } catch (error) {
    console.error('Exception updating payment:', error);
    toast.error('An error occurred while updating payment');
    return { success: false, error };
  }
};

// Function to delete a payment
export const deletePayment = async (paymentId: string) => {
  try {
    const { error } = await supabase
      .from('student_payments')
      .delete()
      .eq('id', paymentId);

    if (error) {
      console.error('Error deleting payment:', error);
      toast.error('Failed to delete payment');
      return { success: false, error };
    }

    toast.success('Payment deleted successfully');
    return { success: true };
  } catch (error) {
    console.error('Exception deleting payment:', error);
    toast.error('An error occurred while deleting payment');
    return { success: false, error };
  }
};

// Function to mark a payment as paid
export const markPaymentAsPaid = async (paymentId: string) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    const { data, error } = await supabase
      .from('student_payments')
      .update({
        payment_date: today,
        status: 'paid'
      })
      .eq('id', paymentId)
      .select()
      .single();

    if (error) {
      console.error('Error marking payment as paid:', error);
      toast.error('Failed to mark payment as paid');
      return { success: false, error };
    }

    toast.success('Payment marked as paid');
    return { success: true, payment: data };
  } catch (error) {
    console.error('Exception marking payment as paid:', error);
    toast.error('An error occurred while marking payment as paid');
    return { success: false, error };
  }
};


import { supabase } from "@/lib/supabase";

// Notification types
export type NotificationType = 'vacation_start' | 'vacation_end' | 'payment_overdue' | 'class_assigned' | 'system';

// Function to create a notification
export const createNotification = async (
  userId: string | null,
  title: string,
  message: string,
  type: NotificationType
) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type,
        read: false
      });
      
    if (error) {
      console.error("Error creating notification:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Failed to create notification:", error);
    return null;
  }
};

// Function to mark a notification as read
export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .select();
      
    if (error) {
      console.error("Error marking notification as read:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    return false;
  }
};

// Function to get unread notifications for a user
export const getUnreadNotifications = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('read', false)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching unread notifications:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Failed to fetch unread notifications:", error);
    return [];
  }
};

// Function to create a vacation notification
export const createVacationNotification = async (
  teacherId: string,
  teacherName: string,
  startDate: Date,
  endDate: Date,
  isStart: boolean
) => {
  const title = isStart 
    ? `${teacherName} Started Vacation` 
    : `${teacherName} Returned from Vacation`;
    
  const message = isStart
    ? `${teacherName} is on vacation from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}.`
    : `${teacherName} has returned from vacation and is now available.`;
    
  return createNotification(
    null, // null userId means a global notification
    title,
    message,
    isStart ? 'vacation_start' : 'vacation_end'
  );
};

// Function to create a payment overdue notification
export const createPaymentOverdueNotification = async (
  studentId: string,
  studentName: string,
  dueDate: Date,
  amount: number
) => {
  const title = `Overdue Payment for ${studentName}`;
  const message = `Payment of ${amount.toFixed(2)}€ was due on ${dueDate.toLocaleDateString()}.`;
  
  return createNotification(
    null, // This can be sent to admins or specific user IDs
    title,
    message,
    'payment_overdue'
  );
};

export default {
  createNotification,
  markNotificationAsRead,
  getUnreadNotifications,
  createVacationNotification,
  createPaymentOverdueNotification
};

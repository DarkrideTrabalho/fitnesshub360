
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Notification {
  id?: string;
  user_id?: string | null;
  title: string;
  message: string;
  type: string;
  read?: boolean;
  created_at?: string;
}

/**
 * Creates a new notification for a user
 * @param userId The ID of the user to send the notification to (null for system-wide notifications)
 * @param title Notification title
 * @param message Notification message
 * @param type Type of notification (info, warning, error, success, etc.)
 */
export const createNotification = async (
  userId: string | null,
  title: string,
  message: string,
  type: string
): Promise<string | null> => {
  try {
    console.log(`Creating notification for user ${userId || 'system'}: ${title}`);
    
    // Try to use RPC function first
    try {
      const { data, error } = await supabase.rpc('create_notification', {
        p_user_id: userId as any,
        p_title: title,
        p_message: message,
        p_type: type
      });
      
      if (error) {
        throw error;
      }
      
      console.log('Notification created via RPC');
      return 'success';
    } catch (rpcError) {
      console.warn('RPC function failed, falling back to direct insert', rpcError);
      
      // Fallback to direct insert
      const notification: Notification = {
        user_id: userId,
        title,
        message,
        type,
        read: false
      };
      
      const { data, error } = await supabase
        .from('notifications')
        .insert([notification])
        .select();
        
      if (error) {
        throw error;
      }
      
      console.log('Notification created via direct insert');
      return data?.[0]?.id || null;
    }
  } catch (error) {
    console.error('Error creating notification:', error);
    toast.error('Failed to create notification');
    return null;
  }
};

/**
 * Marks a notification as read
 * @param notificationId The ID of the notification to mark as read
 */
export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    console.log(`Marking notification ${notificationId} as read`);
    
    // Try to use RPC function first
    try {
      const { data, error } = await supabase.rpc('mark_notification_read', {
        p_notification_id: notificationId as any
      });
      
      if (error) {
        throw error;
      }
      
      console.log('Notification marked as read via RPC');
      return true;
    } catch (rpcError) {
      console.warn('RPC function failed, falling back to direct update', rpcError);
      
      // Fallback to direct update
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
        
      if (error) {
        throw error;
      }
      
      console.log('Notification marked as read via direct update');
      return true;
    }
  } catch (error) {
    console.error('Error marking notification as read:', error);
    toast.error('Failed to mark notification as read');
    return false;
  }
};

/**
 * Gets all notifications for a user
 * @param userId The ID of the user to get notifications for
 */
export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    console.log(`Getting notifications for user ${userId}`);
    
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .or(`user_id.eq.${userId},user_id.is.null`)
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    console.log(`Found ${data.length} notifications`);
    return data as Notification[];
  } catch (error) {
    console.error('Error getting user notifications:', error);
    toast.error('Failed to load notifications');
    return [];
  }
};

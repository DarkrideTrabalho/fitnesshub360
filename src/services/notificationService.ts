
import { supabase } from "@/lib/supabase";

export interface Notification {
  id: string;
  user_id: string | null;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

/**
 * Creates a new notification
 * 
 * @param userId User ID or null for system-wide notifications
 * @param title Notification title
 * @param message Notification message
 * @param type Notification type (e.g., 'info', 'warning', 'error')
 * @returns Promise that resolves when notification is created
 */
export const createNotification = async (
  userId: string | null,
  title: string,
  message: string,
  type: string
): Promise<void> => {
  try {
    // Try to use RPC first
    const { error: rpcError } = await supabase.rpc('create_notification', {
      p_user_id: userId,
      p_title: title,
      p_message: message,
      p_type: type
    });
    
    // If RPC fails (e.g., function doesn't exist), fallback to direct insert
    if (rpcError) {
      console.warn("RPC failed, falling back to direct insert:", rpcError.message);
      
      // Fallback to direct insert if RPC fails
      const { error: insertError } = await supabase
        .from('notifications')
        .insert([{
          user_id: userId,
          title,
          message,
          type,
          read: false
        }]);
      
      if (insertError) {
        console.error("Error creating notification:", insertError);
        throw new Error(`Failed to create notification: ${insertError.message}`);
      }
    }
  } catch (error) {
    console.error("Error in createNotification:", error);
    throw error;
  }
};

/**
 * Marks a notification as read
 * 
 * @param notificationId ID of the notification to mark as read
 * @returns Promise that resolves when notification is marked as read
 */
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    // Try to use RPC first
    const { error: rpcError } = await supabase.rpc('mark_notification_read', {
      p_notification_id: notificationId
    });
    
    // If RPC fails, fallback to direct update
    if (rpcError) {
      console.warn("RPC failed, falling back to direct update:", rpcError.message);
      
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
      
      if (updateError) {
        console.error("Error marking notification as read:", updateError);
        throw new Error(`Failed to mark notification as read: ${updateError.message}`);
      }
    }
  } catch (error) {
    console.error("Error in markNotificationAsRead:", error);
    throw error;
  }
};

/**
 * Gets all notifications for a user, including system-wide notifications
 * 
 * @param userId User ID
 * @returns Promise that resolves to an array of notifications
 */
export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .or(`user_id.eq.${userId},user_id.is.null`)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching notifications:", error);
      throw new Error(`Failed to fetch notifications: ${error.message}`);
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getUserNotifications:", error);
    throw error;
  }
};

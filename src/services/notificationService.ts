
import { supabase } from "@/integrations/supabase/client";

export interface CreateNotificationParams {
  userId?: string;
  title: string;
  message: string;
  type: string;
}

export const createNotification = async ({
  userId,
  title,
  message,
  type
}: CreateNotificationParams) => {
  try {
    // Try to use RPC first
    const { error: rpcError } = await supabase.rpc('create_notification', {
      p_user_id: userId || null,
      p_title: title,
      p_message: message,
      p_type: type
    });

    if (rpcError) {
      console.error("Error creating notification using RPC:", rpcError);
      
      // Fallback to direct insert if RPC fails
      const { error: insertError } = await supabase
        .from('notifications')
        .insert([{
          user_id: userId,
          title,
          message,
          type,
          read: false
        }] as any);
      
      if (insertError) {
        console.error("Error creating notification:", insertError);
        throw insertError;
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error("Failed to create notification:", error);
    return { success: false, error };
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    // Try to use RPC first
    const { error: rpcError } = await supabase.rpc('mark_notification_read', {
      p_notification_id: notificationId
    });

    if (rpcError) {
      console.error("Error marking notification as read using RPC:", rpcError);
      
      // Fallback to direct update if RPC fails
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ read: true } as any)
        .eq('id', notificationId);
      
      if (updateError) {
        console.error("Error marking notification as read:", updateError);
        throw updateError;
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    return { success: false, error };
  }
};

export const getUserNotifications = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .or(`user_id.eq.${userId},user_id.is.null`)
      .order('created_at', { ascending: false }) as any;
    
    if (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return [];
  }
};

// Use the "as any" type assertion to work around TypeScript limitations
// when accessing tables that might not be fully defined in the type system

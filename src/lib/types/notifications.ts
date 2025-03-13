
// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  user_id: string;
  read: boolean;
  created_at: string;
}

export interface CreateNotificationProps {
  title: string;
  message: string;
  type: string;
  user_id: string;
}

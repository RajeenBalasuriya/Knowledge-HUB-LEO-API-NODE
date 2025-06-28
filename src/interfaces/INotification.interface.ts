export interface INotification {
  notification_id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  data?: any;
  is_read: boolean;
  created_at: Date;
  read_at?: Date;
}

export interface ICreateNotification {
  user_id: number;
  type: string;
  title: string;
  message: string;
  data?: any;
}

export interface INotificationResponse {
  notification_id: number;
  type: string;
  title: string;
  message: string;
  data?: any;
  is_read: boolean;
  created_at: Date;
  read_at?: Date;
} 
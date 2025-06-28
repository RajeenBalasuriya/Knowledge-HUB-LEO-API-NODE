import { INotification, ICreateNotification, INotificationResponse } from "../interfaces/INotification.interface";
import { Notification } from "../entities/notification.entity";

export class NotificationService {
  // Create notification
  async createNotification(notificationData: ICreateNotification): Promise<INotificationResponse> {
    try {
      const notification = Notification.create({
        user_id: notificationData.user_id,
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.message,
        data: notificationData.data,
        is_read: false,
        created_at: new Date(),
      });

      const createdNotification = await notification.save();

      return {
        notification_id: createdNotification.notification_id,
        type: createdNotification.type,
        title: createdNotification.title,
        message: createdNotification.message,
        data: createdNotification.data,
        is_read: createdNotification.is_read,
        created_at: createdNotification.created_at,
        read_at: createdNotification.read_at,
      };
    } catch (err: any) {
      const error = new Error("Failed to create notification");
      (error as any).status = 500;
      (error as any).code = "NOTIFICATION_CREATION_FAILED";
      (error as any).details = err;
      throw error;
    }
  }

  // Get user notifications with pagination
  async getUserNotifications(userId: number, page: number = 1, limit: number = 20) {
    try {
      const skip = (page - 1) * limit;
      const [notifications, count] = await Notification.findAndCount({
        where: { user_id: userId },
        skip,
        take: limit,
        order: { created_at: "ASC" }, // Ascending order by date
      });

      const notificationResponses: INotificationResponse[] = notifications.map(notification => ({
        notification_id: notification.notification_id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data,
        is_read: notification.is_read,
        created_at: notification.created_at,
        read_at: notification.read_at,
      }));

      return {
        notifications: notificationResponses,
        meta: {
          total: count,
          page,
          last_page: Math.ceil(count / limit),
        },
      };
    } catch (err: any) {
      const error = new Error("Failed to fetch user notifications");
      (error as any).status = 500;
      (error as any).code = "GET_NOTIFICATIONS_FAILED";
      (error as any).details = err;
      throw error;
    }
  }

  // Mark notification as read
  async markNotificationAsRead(notificationId: number, userId: number) {
    try {
      const notification = await Notification.findOne({
        where: {
          notification_id: notificationId,
          user_id: userId,
        },
      });

      if (!notification) {
        const error = new Error("Notification not found");
        (error as any).status = 404;
        (error as any).code = "NOTIFICATION_NOT_FOUND";
        throw error;
      }

      notification.is_read = true;
      notification.read_at = new Date();
      await notification.save();

      return {
        notification_id: notification.notification_id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data,
        is_read: notification.is_read,
        created_at: notification.created_at,
        read_at: notification.read_at,
      };
    } catch (err: any) {
      if (err.code) {
        throw err;
      }
      const error = new Error("Failed to mark notification as read");
      (error as any).status = 500;
      (error as any).code = "MARK_READ_FAILED";
      (error as any).details = err;
      throw error;
    }
  }

  // Mark all user notifications as read
  async markAllNotificationsAsRead(userId: number) {
    try {
      await Notification.update(
        { user_id: userId, is_read: false },
        { is_read: true, read_at: new Date() }
      );

      return { message: "All notifications marked as read" };
    } catch (err: any) {
      const error = new Error("Failed to mark all notifications as read");
      (error as any).status = 500;
      (error as any).code = "MARK_ALL_READ_FAILED";
      (error as any).details = err;
      throw error;
    }
  }

  // Get unread notification count
  async getUnreadCount(userId: number) {
    try {
      const count = await Notification.count({
        where: {
          user_id: userId,
          is_read: false,
        },
      });

      return { unread_count: count };
    } catch (err: any) {
      const error = new Error("Failed to get unread count");
      (error as any).status = 500;
      (error as any).code = "GET_UNREAD_COUNT_FAILED";
      (error as any).details = err;
      throw error;
    }
  }

  // Cleanup old notifications if table exceeds 2500 records
  private async performCleanupIfNeeded() {
    try {
      const totalCount = await Notification.count();
      
      if (totalCount > 2500) {
        // Delete the oldest 1000 records
        const oldestNotifications = await Notification.find({
          order: { created_at: "ASC" },
          take: 1000,
          select: { notification_id: true },
        });

        if (oldestNotifications.length > 0) {
          const notificationIds = oldestNotifications.map(n => n.notification_id);
          await Notification.delete(notificationIds);
          
          console.log(`Cleaned up ${oldestNotifications.length} old notifications. Total remaining: ${totalCount - oldestNotifications.length}`);
        }
      }
    } catch (err) {
      console.error("Failed to perform notification cleanup:", err);
      // Don't throw error as cleanup failure shouldn't break the main flow
    }
  }

  // Manual cleanup method (can be called from cron job)
  async manualCleanup() {
    await this.performCleanupIfNeeded();
  }
} 
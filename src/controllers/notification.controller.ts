import { NextFunction, Response } from "express";
import { AuthRequest } from "../interfaces/IAuthRequest.interface";
import { NotificationService } from "../services/notification.service";

const notificationService = new NotificationService();

// Get user notifications
export const getUserNotifications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const { notifications, meta } = await notificationService.getUserNotifications(
      parseInt(user.id),
      page,
      limit
    );

    res.status(200).json({
      status: "success",
      data: {
        notifications,
        meta,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Mark notification as read
export const markNotificationAsRead = async (
  req: AuthRequest<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const notificationId = parseInt(req.params.id);

    const notification = await notificationService.markNotificationAsRead(
      notificationId,
      parseInt(user.id)
    );

    res.status(200).json({
      status: "success",
      message: "Notification marked as read",
      data: {
        notification,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    const result = await notificationService.markAllNotificationsAsRead(parseInt(user.id));

    res.status(200).json({
      status: "success",
      message: result.message,
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

// Get unread notification count
export const getUnreadCount = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    const { unread_count } = await notificationService.getUnreadCount(parseInt(user.id));

    res.status(200).json({
      status: "success",
      data: {
        unread_count,
      },
    });
  } catch (err) {
    next(err);
  }
}; 
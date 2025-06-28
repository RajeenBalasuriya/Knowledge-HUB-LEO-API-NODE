import { Router } from "express";
import { authenticateMiddleware } from "../middlewares/auth";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadCount,
} from "../controllers/notification.controller";

const notificationRouter = Router();

// All notification routes require authentication
notificationRouter.get("/", authenticateMiddleware, getUserNotifications);
notificationRouter.put("/:id/read", authenticateMiddleware, markNotificationAsRead);
notificationRouter.put("/mark-all-read", authenticateMiddleware, markAllNotificationsAsRead);
notificationRouter.get("/unread-count", authenticateMiddleware, getUnreadCount);

export default notificationRouter; 
import { NextFunction, Response } from "express";
import { AuthRequest } from "../interfaces/IAuthRequest.interface";
import { CronScheduler } from "../utils/cronScheduler";
import { performNotificationCleanup } from "../utils/notificationCleanup";

const cronScheduler = CronScheduler.getInstance();

// Get cron scheduler status
export const getCronStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const status = cronScheduler.getStatus();

    res.status(200).json({
      status: "success",
      data: {
        cron_status: status,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Manually trigger notification cleanup
export const triggerNotificationCleanup = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("Manual notification cleanup triggered");
    await performNotificationCleanup();

    res.status(200).json({
      status: "success",
      message: "Notification cleanup completed successfully",
      data: null,
    });
  } catch (err) {
    next(err);
  }
}; 
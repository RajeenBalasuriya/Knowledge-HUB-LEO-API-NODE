import { NotificationService } from "../services/notification.service";

const notificationService = new NotificationService();

export const performNotificationCleanup = async () => {
  try {
    console.log("Starting weekly notification cleanup check...");
    await notificationService.manualCleanup();
    console.log("Weekly notification cleanup check completed");
  } catch (error) {
    console.error("Weekly notification cleanup failed:", error);
  }
};

// For manual execution
if (require.main === module) {
  performNotificationCleanup()
    .then(() => {
      console.log("Weekly cleanup script finished");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Weekly cleanup script failed:", error);
      process.exit(1);
    });
} 
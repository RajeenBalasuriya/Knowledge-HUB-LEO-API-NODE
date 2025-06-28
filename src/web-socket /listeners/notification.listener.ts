import { eventEmitter } from "../events/eventEmitter";
import { getIO, connectedUsers } from "../socket";
import { NotificationService } from "../../services/notification.service";

const notificationService = new NotificationService();

export const registerNotificationListeners = () => {
  eventEmitter.on("commentCreated", async (comment) => {
    const io = getIO();
    
    // Create persistent notification for all users except the comment author
    for (const [uid, socketId] of connectedUsers.entries()) {
      if (uid != comment.user.user_id) {
        try {
          // Create notification in database
          const notification = await notificationService.createNotification({
            user_id: parseInt(uid),
            type: "comment",
            title: "New Comment",
            message: `${comment.user.user_name} commented on a course ${comment.course.crs_name}`,
            data: {
              comment_id: comment.comment_id,
              course_id: comment.course.crs_id,
              course_name: comment.course.crs_name,
              user_id: comment.user.user_id,
              user_name: comment.user.user_name,
            },
          });

          // Emit real-time notification
          console.log(`Emitting to user ${uid} on socket ${socketId}`);
          io.to(socketId).emit("new_comment", {
            comment,
            notification,
          });
        } catch (error) {
          console.error(`Failed to create notification for user ${uid}:`, error);
          // Still emit the comment even if notification creation fails
          io.to(socketId).emit("new_comment", {
            comment,
          });
        }
      }
    }
  });
};

import { eventEmitter } from "../events/eventEmitter";
import { getIO, connectedUsers } from "../socket";

export const registerNotificationListeners = () => {
  eventEmitter.on("commentCreated", (comment) => {

    const io = getIO();
    for (const [uid, socketId] of connectedUsers.entries()) {
      
      if (uid != comment.user.user_id) {
        
        console.log(`Emitting to user ${uid} on socket ${socketId}`);
        io.to(socketId).emit("new_comment", {
          comment
        });
      }
    }
  });

};

import { Server } from "socket.io";
import { Server as HTTPServer } from "http";

let io: Server;

// Map to store userId -> socketId
const connectedUsers = new Map<string, string>();

export const initSocket = (server: HTTPServer) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Update this to your frontend origin
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`🟢 New client connected: ${socket.id}`);

    // Listen for the 'register' event from client to associate userId with socketId
    socket.on("register", (userId: string) => {
      connectedUsers.set(userId, socket.id);
      console.log(`User registered: ${userId} with socket ${socket.id}`);
    });

    socket.on("disconnect", () => {
      console.log(`🔴 Client disconnected: ${socket.id}`);

      // Remove user from connectedUsers map on disconnect
      for (const [userId, socketId] of connectedUsers.entries()) {
        if (socketId === socket.id) {
          connectedUsers.delete(userId);
          console.log(`User disconnected and removed: ${userId}`);
          break;
        }
      }
    });
  });
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

export { connectedUsers };

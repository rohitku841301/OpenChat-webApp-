// utils/socket.js

const { Server } = require("socket.io");
const { createServer } = require("http");

let io; // Define io variable outside the function

exports.initSocketIO = (app) => {
  const server = createServer(app);
  io = new Server(server, {
    cors: "*",
  });

  io.on("connection", (socket) => {
    console.log("user connected");
    console.log("id", socket.id);
    socket.on("sendToGroup", ({ message, groupId }) => {
      console.log("message: " + message);
      socket.broadcast.emit("message-received", `${message} from ${groupId}`);
    });
  });

  return server; // Return the server instance
};

exports.getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }
  return io;
};

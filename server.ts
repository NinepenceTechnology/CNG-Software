import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    },
    transports: ['websocket', 'polling'],
    allowEIO3: true // Support older clients if any
  });

  const PORT = 3000;

  // Socket.io logic
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.emit("connection-success", { id: socket.id });

    // Chat messages
    socket.on("message", (data) => {
      console.log("Message received:", data);
      io.emit("message", {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
      });
    });

    // WebRTC Signaling for Video Chat
    socket.on("join-video-room", (roomId) => {
      socket.join(roomId);
      socket.to(roomId).emit("user-joined", socket.id);
      console.log(`User ${socket.id} joined video room ${roomId}`);
    });

    socket.on("signal", (data) => {
      // data: { to, from, signal }
      io.to(data.to).emit("signal", {
        from: socket.id,
        signal: data.signal,
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      io.emit("user-left", socket.id);
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

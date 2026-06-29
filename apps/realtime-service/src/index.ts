import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

const PORT = parseInt(process.env.PORT ?? "5000", 10);
const CLIENT_ORIGIN = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// ─── Express + HTTP server ─────────────────────────────────────────────────
const app = express();
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "realtime-service",
    timestamp: new Date().toISOString(),
  });
});

const httpServer = createServer(app);

// ─── Socket.io ────────────────────────────────────────────────────────────
const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

// ─── Debate Room Namespace /debate ─────────────────────────────────────────
const debateNsp = io.of("/debate");

debateNsp.on("connection", (socket: Socket) => {
  console.log(`[debate] client connected: ${socket.id}`);

  socket.on("join-room", (roomId: string) => {
    socket.join(roomId);
    console.log(`[debate] ${socket.id} joined room: ${roomId}`);
    debateNsp.to(roomId).emit("user-joined", { socketId: socket.id });
  });

  socket.on("leave-room", (roomId: string) => {
    socket.leave(roomId);
    debateNsp.to(roomId).emit("user-left", { socketId: socket.id });
  });

  socket.on("send-message", (data: { roomId: string; message: string; userId: string }) => {
    // TODO: persist message, add Clerk user info, broadcast
    debateNsp.to(data.roomId).emit("new-message", {
      id: crypto.randomUUID(),
      userId: data.userId,
      message: data.message,
      timestamp: new Date().toISOString(),
    });
  });

  socket.on("cast-vote", (data: { roomId: string; fighterId: string; userId: string }) => {
    // TODO: tally votes in Redis, broadcast updated counts
    debateNsp.to(data.roomId).emit("vote-updated", {
      fighterId: data.fighterId,
      votes: 0, // placeholder
    });
  });

  socket.on("disconnect", () => {
    console.log(`[debate] client disconnected: ${socket.id}`);
  });
});

// ─── Live Events Namespace /live ──────────────────────────────────────────
const liveNsp = io.of("/live");

liveNsp.on("connection", (socket: Socket) => {
  console.log(`[live] client connected: ${socket.id}`);

  socket.on("subscribe-event", (eventId: string) => {
    socket.join(`event:${eventId}`);
    // TODO: emit current fight state from Redis cache
  });

  socket.on("disconnect", () => {
    console.log(`[live] client disconnected: ${socket.id}`);
  });
});

// ─── Start ────────────────────────────────────────────────────────────────
httpServer.listen(PORT, () => {
  console.log(`Realtime Service running on http://0.0.0.0:${PORT}`);
  console.log(`  /debate namespace — live debate rooms`);
  console.log(`  /live namespace   — live event updates`);
});

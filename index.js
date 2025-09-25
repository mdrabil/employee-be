import bcrypt from "bcryptjs";
import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // ✅ missing import
import connectDB from "./DB/ConnectDB.js";
import { MODULES } from "./config/module.js";

import mainRoutes from "./routes/mainRoutes.js";
import http from "http";
import { createAdmin } from "./controller/AdminController.js";
import { Server } from "socket.io"; // ✅ move import to top
import { ensureModules } from "./utils/autoCreateModule.js";
import path from "path";
import cron from "node-cron";

import { setupTaskReminderCron } from "./controller/DailyTask.js";
import AttenanceModel from "./models/AttenanceModel.js";

dotenv.config();
const app = express();

// ✅ Middleware
app.use(express.json());

// ✅ Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "https://crm.arawebtechnologies.com",
  "http://crm.arawebtechnologies.com",
  "https://mcr0j5fm-5173.inc1.devtunnels.ms"
];

// ✅ CORS Middleware for Express
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // agar cookies/jwt bhejni ho to
  })
);


// cron.schedule("30 22 * * *", async () => {
//   await AttenanceModel.autoPunchOutToday();
// });





cron.schedule("30 21 * * *", async () => {
  console.log("🚀 Running auto punch-out cron...");
  await AttenanceModel.autoPunchOutToday();
});


// cron.schedule("26 09 * * *", async () => {
//   console.log("🚀 Running auto punch-out cron...");
//   await AttenanceModel.autoPunchOutYesterday();
// });
// ✅ Connect DB
connectDB();

// ✅ Create HTTP server for Socket.IO
const server = http.createServer(app);

// ✅ Correct Socket.IO initialization with same CORS rules
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

setupTaskReminderCron(io);

// ✅ Make io accessible in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// server.js



// ✅ Socket.IO events
io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

    socket.on("user_connected", (userId) => {
    socket.join(userId); // ✅ unique room
    console.log("User connected:", userId);
  });



 socket.on("join", (roomId) => {
    socket.join(roomId);
    console.log('room id',roomId)
    socket.to(roomId).emit("user-joined", socket.id);
  });

  socket.on("offer", (data) => {
    socket.to(data.roomId).emit("offer", data);
  });

  socket.on("answer", (data) => {
    socket.to(data.roomId).emit("answer", data);
  });

  socket.on("ice-candidate", (data) => {
    socket.to(data.roomId).emit("ice-candidate", data.candidate);
  });



  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });

  socket.on("sendMessage", (data) => {
    console.log("💬 Message received via socket:", data);
    io.emit("newMessage", data);
  });
});

// ✅ Sample route
app.get("/", (req, res) => {
  res.json({ success: true, message: "API is running" });
});

// ✅ Main routes
app.use("/api", mainRoutes);
const __dirname = path.resolve();

// 🔹 Static folder expose karna
app.use("/api/uploads", express.static(path.join(__dirname, "/uploads")));
// ✅ Create super admin (enable if needed)
createAdmin();
ensureModules()


// ✅ Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

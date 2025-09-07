// db/DBConnection.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";

dotenv.config();

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "MONGO_URI is missing in .env file",
      };
    }

    // MongoDB connection
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME || "employeeDB",
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
      autoIndex: true, // helps in creating indexes automatically
    });

    console.log("✅ MongoDB Connected:");

    // Events
    mongoose.connection.on("connected", () => {
      console.log("📡 Mongoose connected to DB");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ Mongoose connection error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ Mongoose disconnected");
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("🔴 Mongoose connection closed on app termination");
      process.exit(0);
    });
  } catch (err) {
    console.error("❌ Database connection failed:", err.message || err);
    process.exit(1); // stop app if DB not connected
  }
};

export default connectDB;

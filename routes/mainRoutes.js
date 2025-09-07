import express from "express";
import departmentRoutes from './departmentRoute.js'
import employeeRoutes from './EmployeeRoutes.js'
import roleRoutes from './roleRoutes.js'
import moduleRoutes from './moduleRoutes.js'
import authRoutes from './authRoutes.js'
import dailyTaskRoutes from "./dailyTask.js";
import projectRoutes from "./projectRoutes.js";
import IsonlineRoutes from "./OnOff.js";
import ChatEmplyeeRoutes from "./ChatEmplyeeRoutes.js";
import AttananceRoutes from "./AttananceRoutes.js";


const router = express.Router();

// 🔹 All Routes
router.use("/departments", departmentRoutes);
router.use("/employees", employeeRoutes);
router.use("/roles", roleRoutes);
router.use("/modules", moduleRoutes);
router.use("/auth", authRoutes);
router.use("/dailytasks", dailyTaskRoutes);
router.use("/projects", projectRoutes);
router.use("/online", IsonlineRoutes);
router.use("/chat", ChatEmplyeeRoutes);
router.use("/attendance", AttananceRoutes);
export default router;

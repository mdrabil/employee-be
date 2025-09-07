import express from "express";
import * as ctrl from "../controller/DailyTask.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Employee routes (protected)
router.post("/",authMiddleware, ctrl.addTaskForToday); // add task (push into today's)
router.get("/my",authMiddleware, ctrl.getMyDailyTasks);
router.patch("/:dailyTaskId/tasks/:taskId/status", ctrl.updateTaskStatus);
router.get("/summary/:id", ctrl.getTaskSummary);
router.get("/:id",  ctrl.getDailyTaskById);

// Admin routes
router.get("/",ctrl.getAllDailyTasks);
router.get("/today", ctrl.getTodayTasks);
router.delete("/:id",  ctrl.deleteDailyTask);

export default router;

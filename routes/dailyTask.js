import express from "express";
import * as ctrl from "../controller/DailyTask.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Employee routes (protected)
router.post("/",authMiddleware, ctrl.addTaskForToday); // add task (push into today's)
router.get("/my",authMiddleware, ctrl.getMyDailyTasks);
router.patch("/:dailyTaskId/tasks/:taskId/status",authMiddleware, ctrl.updateTaskStatus);
router.delete("/:dailyTaskId/tasks/:taskId/delete",authMiddleware, ctrl.deleteTaskStatus);
router.get("/summary/:id", ctrl.getTaskSummary);
router.get("/:id",  ctrl.getDailyTaskById);

// Admin routes
router.get("/",authMiddleware, ctrl.getAllDailyTasks);
router.get("/today", ctrl.getTodayTasks);
router.delete("/:id",  ctrl.deleteDailyTask);
router.patch("/:dailyTaskId/tasks/:taskId", authMiddleware, ctrl.editTask);


export default router;

import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectsByEmployeeId,
} from "../controller/ProjectControll.js";
import { authMiddleware } from "../middleware/auth.js";
import { upload } from "../utils/multerConfig.js";

const router = express.Router();

router.post("/",authMiddleware,
   upload.array("files", 10), // max 10 files

    createProject);
router.get("/",authMiddleware, getProjects);
router.get("/:id", getProjectById);
router.get("/employee/:id", getProjectsByEmployeeId);
router.put("/:id",authMiddleware, updateProject);
router.delete("/:id", deleteProject);

export default router;

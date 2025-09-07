import express from "express";

import { authMiddleware } from "../middleware/auth.js";
import { checkPermission } from "../middleware/checkPermissions.js";
import { createModule, deleteModule, getModuleById, getModules, updateModule } from "../controller/ModuleController.js";

const router = express.Router();

router.post("/",
    // authMiddleware, checkPermission("department", "canCreate"),
     createModule);        // Create
router.get("/",
    // authMiddleware, checkPermission("department", "canRead"),
     getModules);           // Get all
router.get("/:id",authMiddleware, checkPermission("department", "canRead"), getModuleById);     // Get single
router.put("/:id",authMiddleware, checkPermission("department", "canUpdate"), updateModule);      // Update
router.delete("/:id",authMiddleware, checkPermission("department", "canDelete"), deleteModule);   // Delete

export default router;

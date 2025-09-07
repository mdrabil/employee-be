import express from "express";
import {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment
} from "../controller/DepartmentControll.js";
import { authMiddleware } from "../middleware/auth.js";
import { checkPermission } from "../middleware/checkPermissions.js";

const router = express.Router();

router.post("/",
  // authMiddleware,
  //  checkPermission("department", "canCreate"),
    createDepartment);        // Create
router.get("/",
  // authMiddleware, 
  // checkPermission("department", "canRead"), 
  getDepartments);           // Get all
router.get("/:id",
  // authMiddleware, checkPermission("department", "canRead"),
   getDepartmentById);     // Get single
router.put("/:id",
  // authMiddleware, checkPermission("department", "canUpdate"),
   updateDepartment);      // Update
router.delete("/:id",
  // authMiddleware, checkPermission("department", "canDelete"),
   deleteDepartment);   // Delete

export default router;

import express from "express";


import { authMiddleware } from "../middleware/auth.js";
import { checkPermission } from "../middleware/checkPermissions.js";
import { createRole, deleteRole, getRoleById, getRoles, updateRole } from "../controller/AdminController.js";

const router = express.Router();

// Only admin OR users with roles.canCreate can create role
router.post(
  "/",
  // authMiddleware,
  // checkPermission("roles", "canCreate"),
  createRole
);

router.get(
  "/",
  // authMiddleware,
  // checkPermission("roles", "canCreate"),
  getRoles
);
router.get(
  "/:id",
  // authMiddleware,
  // checkPermission("roles", "canCreate"),
  getRoleById
);
router.put(
  "/:id",
  // authMiddleware,
  // checkPermission("roles", "canCreate"),
  updateRole
);
router.delete(
  "/:id",
  // authMiddleware,
  // checkPermission("roles", "canCreate"),
  deleteRole
);
export default router;

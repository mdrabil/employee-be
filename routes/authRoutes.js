import express from "express";
import { login } from "../controller/AdminController.js";
import { checkPermission } from "../middleware/checkPermissions.js";
import { createEmployee, deleteEmployee } from "../controller/EmployeeControll.js";

const router = express.Router();

router.post("/login", login);
router.post("/", checkPermission("employees", "create"), createEmployee);
router.delete("/:id", checkPermission("employees", "delete"), deleteEmployee);


export default router;

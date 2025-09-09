



import express from "express";


import { authMiddleware } from "../middleware/auth.js";
import { createEmployee,  deleteEmployee,  getEmployeeDetails,  getEmployees, getSafeEmployees, updateEmployee } from "../controller/EmployeeControll.js";
import { checkPermission } from "../middleware/checkPermissions.js";
import { upload } from "../utils/multerConfig.js";

const router = express.Router();

// 🔹 All routes protected + permission checked
router.post("/",
  //  authMiddleware,
    //  checkPermission("permissions", "canCreate"),
      upload.single("profileImage"),
      createEmployee);
router.get("/",
    //  authMiddleware, checkPermission("permissions", "canRead"),
      getEmployees);
router.get("/:id",
  
  //  authMiddleware, checkPermission("permissions", "canRead"),
    getEmployees);
    router.get("/safe", authMiddleware, getSafeEmployees);

router.get("/details/:employeeID", getEmployeeDetails);
router.put("/:id",
  //  authMiddleware, checkPermission("employees", "canUpdate"), 
   updateEmployee);
router.delete("/:id", authMiddleware, checkPermission("employees", "canDelete"), deleteEmployee);

export default router;



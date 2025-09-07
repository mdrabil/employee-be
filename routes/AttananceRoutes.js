

// import express from "express";
// import {
//     markAttendance,
//     startBreak,
//     endBreak,
//     undoLastAction,
//     getAllAttendance,
//     getEmployeeAttendance,
//     updateAttendance
// } from "../controller/AttananceControll.js";

// const router = express.Router();

// router.post("/mark", markAttendance); // checkIn / checkOut
// router.get("/employee/:employeeId", getEmployeeAttendance);
// router.post("/break/start", startBreak);
// router.post("/break/end", endBreak);
// router.post("/undo", undoLastAction);

// router.get("/", getAllAttendance);
// router.put("/:id", updateAttendance); // admin fix

// export default router;





import express from "express";
import { endBreak, getEmployeeOverallAttendance, getOverallAttendance, getTodayAttendance, punchIn, punchOut, startBreak } from "../controller/AttananceControll.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();
getOverallAttendance
router.post("/:employeeId/punch-in",authMiddleware, punchIn);
router.post("/:employeeId/punch-out",authMiddleware, punchOut);
router.post("/:employeeId/break-start",authMiddleware, startBreak);
router.post("/:employeeId/break-end",authMiddleware, endBreak);
router.get("/:employeeId/today",authMiddleware, getTodayAttendance);
router.get("/employee/:employeeId/overall",authMiddleware, getEmployeeOverallAttendance);
router.get("/overall",authMiddleware, getOverallAttendance);



router.get("/:employeeId/today", getTodayAttendance);

export default router;

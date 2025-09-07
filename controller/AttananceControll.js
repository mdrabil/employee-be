// import Attendance from "../models/Attendance.js";
// import Employee from "../models/Employee.js";

// export const markAttendance = async (req, res) => {
//   try {
//     const { employeeId, type } = req.body;

//     const employee = await Employee.findById(employeeId);
//     if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });

//     const today = new Date();
//     today.setHours(0,0,0,0);

//     let attendance = await Attendance.findOne({ employee: employeeId, date: today });

//     if (!attendance) {
//       attendance = new Attendance({ employee: employeeId, date: today });
//     }

//     const dutyStartParts = attendance.dutyStart.split(":");
//     const dutyStartDate = new Date();
//     dutyStartDate.setHours(parseInt(dutyStartParts[0]), parseInt(dutyStartParts[1]), 0, 0);

//     const dutyEndParts = attendance.dutyEnd.split(":");
//     const dutyEndDate = new Date();
//     dutyEndDate.setHours(parseInt(dutyEndParts[0]), parseInt(dutyEndParts[1]), 0, 0);

//     if(type === "checkIn") {
//       attendance.checkIn = new Date();
//       if(attendance.checkIn > dutyStartDate) {
//         const late = (attendance.checkIn - dutyStartDate) / (1000*60); // minutes late
//         attendance.lateByMinutes = Math.round(late);
//       }
//     }
//     else if(type === "checkOut") {
//       attendance.checkOut = new Date();

//       if(attendance.checkIn) {
//         const workedHours = (attendance.checkOut - attendance.checkIn) / (1000*60*60);
//         attendance.totalHours = parseFloat(workedHours.toFixed(2));

//         const dutyHours = (dutyEndDate - dutyStartDate)/(1000*60*60);
//         attendance.extraHours = workedHours > dutyHours ? parseFloat((workedHours - dutyHours).toFixed(2)) : 0;

//         // Status
//         attendance.status = workedHours < 8 ? "half-day" : "present";
//       }
//     }

//     await attendance.save();
//     res.json({ success: true, data: attendance });

//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };




// // 🔹 Mark attendance (checkIn / checkOut)
// export const markAttendance = async (req, res) => {
//   try {
//     const { employeeId, type } = req.body;

//     const employee = await Employee.findById(employeeId);
//     if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });

//     const today = new Date();
//     today.setHours(0,0,0,0);

//     let attendance = await Attendance.findOne({ employee: employeeId, date: today });

//     if (!attendance) {
//       attendance = new Attendance({ employee: employeeId, date: today });
//     }

//     const dutyStartParts = attendance.dutyStart.split(":");
//     const dutyStartDate = new Date();
//     dutyStartDate.setHours(parseInt(dutyStartParts[0]), parseInt(dutyStartParts[1]), 0, 0);

//     const dutyEndParts = attendance.dutyEnd.split(":");
//     const dutyEndDate = new Date();
//     dutyEndDate.setHours(parseInt(dutyEndParts[0]), parseInt(dutyEndParts[1]), 0, 0);

//     if(type === "checkIn") {
//       attendance.checkIn = new Date();
//       if(attendance.checkIn > dutyStartDate) {
//         const late = (attendance.checkIn - dutyStartDate) / (1000*60); // minutes late
//         attendance.lateByMinutes = Math.round(late);
//       }
//     }
//     else if(type === "checkOut") {
//       attendance.checkOut = new Date();

//       if(attendance.checkIn) {
//         const workedHours = (attendance.checkOut - attendance.checkIn) / (1000*60*60);
//         attendance.totalHours = parseFloat(workedHours.toFixed(2));

//         const dutyHours = (dutyEndDate - dutyStartDate)/(1000*60*60);
//         attendance.extraHours = workedHours > dutyHours ? parseFloat((workedHours - dutyHours).toFixed(2)) : 0;

//         attendance.status = workedHours < 8 ? "half-day" : "present";
//       }
//     }

//     await attendance.save();
//     res.json({ success: true, data: attendance });

//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // 🔹 Get all attendance
// export const getAllAttendance = async (req, res) => {
//   try {
//     const data = await Attendance.find();
//     res.json({ success: true, data });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // 🔹 Get one employee's attendance
// export const getEmployeeAttendance = async (req, res) => {
//   try {
//     const { employeeId } = req.params;
//     const data = await Attendance.find({ employee: employeeId });
//     res.json({ success: true, data });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // 🔹 Update attendance manually
// export const updateAttendance = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;

//     const att = await Attendance.findById(id);
//     if(!att) return res.status(404).json({ success: false, message: "Attendance not found" });

//     Object.keys(updates).forEach(key => {
//       att[key] = updates[key];
//     });

//     // Recalculate total hours and extra hours if checkIn/checkOut changed
//     if(att.checkIn && att.checkOut) {
//       const workedHours = (new Date(att.checkOut) - new Date(att.checkIn)) / (1000*60*60);
//       att.totalHours = parseFloat(workedHours.toFixed(2));

//       const dutyStartParts = att.dutyStart.split(":");
//       const dutyStartDate = new Date();
//       dutyStartDate.setHours(parseInt(dutyStartParts[0]), parseInt(dutyStartParts[1]), 0, 0);

//       const dutyEndParts = att.dutyEnd.split(":");
//       const dutyEndDate = new Date();
//       dutyEndDate.setHours(parseInt(dutyEndParts[0]), parseInt(dutyEndParts[1]), 0, 0);

//       const dutyHours = (dutyEndDate - dutyStartDate)/(1000*60*60);
//       att.extraHours = workedHours > dutyHours ? parseFloat((workedHours - dutyHours).toFixed(2)) : 0;

//       att.lateByMinutes = att.checkIn > dutyStartDate ? Math.round((att.checkIn - dutyStartDate)/(1000*60)) : 0;
//       att.status = workedHours < 8 ? "half-day" : "present";
//     }

//     await att.save();
//     res.json({ success: true, data: att });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };




import Attendance from '../models/AttenanceModel.js'
import EmployeeModel from '../models/EmployeeModel.js';
// import Employee from "../models/Employee.js";

// // 🔹 Mark CheckIn / CheckOut
// export const markAttendance = async (req, res) => {
//   try {
//     const { employeeId, type } = req.body;
//     console.log('employee mark',employeeId)

//     const employee = await Employee.findOne({employeeId});
//     if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     let attendance = await Attendance.findOne({ employee: employeeId, date: today });
//     if (!attendance) {
//       attendance = new Attendance({ employee: employeeId, date: today });
//     }

//     // Duty timings
//     const dutyStartParts = attendance.dutyStart.split(":");
//     const dutyStartDate = new Date();
//     dutyStartDate.setHours(parseInt(dutyStartParts[0]), parseInt(dutyStartParts[1]), 0, 0);

//     const dutyEndParts = attendance.dutyEnd.split(":");
//     const dutyEndDate = new Date();
//     dutyEndDate.setHours(parseInt(dutyEndParts[0]), parseInt(dutyEndParts[1]), 0, 0);

//     if (type === "checkIn") {
//       attendance.checkIn = new Date();
//       attendance.lastAction = "checkIn";
//       attendance.lastActionAt = new Date();

//       if (attendance.checkIn > dutyStartDate) {
//         const late = (attendance.checkIn - dutyStartDate) / (1000 * 60);
//         attendance.lateByMinutes = Math.round(late);
//       }
//     } else if (type === "checkOut") {
//       attendance.checkOut = new Date();
//       attendance.lastAction = "checkOut";
//       attendance.lastActionAt = new Date();

//       if (attendance.checkIn) {
//         const workedHours = (attendance.checkOut - attendance.checkIn) / (1000 * 60 * 60);
//         attendance.totalHours = parseFloat(workedHours.toFixed(2));

//         const dutyHours = (dutyEndDate - dutyStartDate) / (1000 * 60 * 60);
//         attendance.extraHours =
//           workedHours > dutyHours ? parseFloat((workedHours - dutyHours).toFixed(2)) : 0;

//         attendance.status = workedHours < 8 ? "half-day" : "present";
//       }
//     }

//     await attendance.save();
//     res.json({ success: true, data: attendance });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // 🔹 Start Break
// export const startBreak = async (req, res) => {
//   try {
//     const { employeeId } = req.body;
//     const today = new Date(); today.setHours(0, 0, 0, 0);

//     const attendance = await Attendance.findOne({ employee: employeeId, date: today });
//     if (!attendance) return res.status(400).json({ success: false, message: "Attendance not found" });

//     attendance.breaks.push({ breakOut: new Date() });
//     attendance.lastAction = "breakOut";
//     attendance.lastActionAt = new Date();

//     await attendance.save();
//     res.json({ success: true, data: attendance });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // 🔹 End Break
// export const endBreak = async (req, res) => {
//   try {
//     const { employeeId } = req.body;
//     const today = new Date(); today.setHours(0, 0, 0, 0);

//     const attendance = await Attendance.findOne({ employee: employeeId, date: today });
//     if (!attendance) return res.status(400).json({ success: false, message: "Attendance not found" });

//     const lastBreak = attendance.breaks[attendance.breaks.length - 1];
//     if (!lastBreak || lastBreak.breakIn) {
//       return res.status(400).json({ success: false, message: "No active break found" });
//     }

//     lastBreak.breakIn = new Date();
//     const diff = (lastBreak.breakIn - lastBreak.breakOut) / (1000 * 60);
//     lastBreak.durationMinutes = Math.round(diff);

//     attendance.totalBreakMinutes = attendance.breaks.reduce(
//       (sum, b) => sum + b.durationMinutes,
//       0
//     );

//     attendance.lastAction = "breakIn";
//     attendance.lastActionAt = new Date();

//     await attendance.save();
//     res.json({ success: true, data: attendance });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // 🔹 Undo Last Action (within 10 minutes)
// export const undoLastAction = async (req, res) => {
//   try {
//     const { employeeId } = req.body;
//     const today = new Date(); today.setHours(0, 0, 0, 0);

//     const attendance = await Attendance.findOne({ employee: employeeId, date: today });
//     if (!attendance) return res.status(400).json({ success: false, message: "Attendance not found" });

//     if (!attendance.lastAction || !attendance.lastActionAt) {
//       return res.status(400).json({ success: false, message: "No recent action to undo" });
//     }

//     const timeDiff = Date.now() - new Date(attendance.lastActionAt).getTime();
//     if (timeDiff > 10 * 60 * 1000) {
//       return res.status(400).json({ success: false, message: "Undo time expired" });
//     }

//     if (attendance.lastAction === "checkOut") {
//       attendance.checkOut = null;
//       attendance.totalHours = 0;
//       attendance.extraHours = 0;
//       attendance.status = "present";
//     } else if (attendance.lastAction === "breakIn") {
//       const lastBreak = attendance.breaks[attendance.breaks.length - 1];
//       if (lastBreak) {
//         lastBreak.breakIn = null;
//         lastBreak.durationMinutes = 0;
//       }
//     } else if (attendance.lastAction === "breakOut") {
//       attendance.breaks.pop(); // remove last break
//     }

//     attendance.lastAction = null;
//     attendance.lastActionAt = null;

//     await attendance.save();
//     res.json({ success: true, message: "Last action undone", data: attendance });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // 🔹 Get All Attendance
// export const getAllAttendance = async (req, res) => {
//   try {
//     const data = await Attendance.find();
//     res.json({ success: true, data });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // 🔹 Get One Employee's Attendance
// export const getEmployeeAttendance = async (req, res) => {
//   try {
//     const  employeeId  = req.params?.employeeId;
   
//     const data = await Attendance.findOne({ employee: employeeId });
//     res.json({ success: true, data });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // 🔹 Admin Update Attendance (Manual Fix)
// export const updateAttendance = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;

//     const att = await Attendance.findById(id);
//     if (!att) return res.status(404).json({ success: false, message: "Attendance not found" });

//     Object.keys(updates).forEach((key) => {
//       att[key] = updates[key];
//     });

//     if (att.checkIn && att.checkOut) {
//       const workedHours = (new Date(att.checkOut) - new Date(att.checkIn)) / (1000 * 60 * 60);
//       att.totalHours = parseFloat(workedHours.toFixed(2));
//     }

//     await att.save();
//     res.json({ success: true, data: att });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };




// import Employee from "../models/Employee.js"; // assuming Employee model exists

// // 🔹 Mark CheckIn / CheckOut
// export const markAttendance = async (req, res) => {
//   try {
//     const { employeeId, type } = req.body;
//     if (!employeeId || !type) {
//       return res.status(400).json({ success: false, message: "EmployeeId and type are required" });
//     }

//     const employee = await Employee.findOne({ employeeId });
//     if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     let attendance = await Attendance.findOne({ employee: employeeId, date: today });
//     if (!attendance) {
//       attendance = new Attendance({ employee: employeeId, date: today });
//     }

//     // Duty timings
//     const [startH, startM] = attendance.dutyStart.split(":").map(Number);
//     const [endH, endM] = attendance.dutyEnd.split(":").map(Number);

//     const dutyStart = new Date(today);
//     dutyStart.setHours(startH, startM, 0, 0);

//     const dutyEnd = new Date(today);
//     dutyEnd.setHours(endH, endM, 0, 0);

//     if (type === "checkIn") {
//       if (attendance.checkIn) {
//         return res.status(400).json({ success: false, message: "Already checked in" });
//       }
//       attendance.checkIn = new Date();
//       attendance.lastAction = "checkIn";
//       attendance.lastActionAt = new Date();

//       // Late calculation
//       if (attendance.checkIn > dutyStart) {
//         const lateMinutes = Math.round((attendance.checkIn - dutyStart) / (1000 * 60));
//         attendance.lateByMinutes = lateMinutes;
//       }

//       attendance.status = "present";

//     } else if (type === "checkOut") {
//       if (!attendance.checkIn) {
//         return res.status(400).json({ success: false, message: "Cannot check out before check in" });
//       }
//       if (attendance.checkOut) {
//         return res.status(400).json({ success: false, message: "Already checked out" });
//       }

//       attendance.checkOut = new Date();
//       attendance.lastAction = "checkOut";
//       attendance.lastActionAt = new Date();

//       // Total worked hours
//       const workedMs = attendance.checkOut - attendance.checkIn;
//       const workedHours = workedMs / (1000 * 60 * 60);

//       // Total break duration
//       const totalBreakMins = attendance.breaks.reduce((sum, b) => sum + (b.durationMinutes || 0), 0);
//       const totalBreakHrs = totalBreakMins / 60;

//       attendance.totalHours = parseFloat((workedHours - totalBreakHrs).toFixed(2));

//       // Extra hours
//       const dutyHours = (dutyEnd - dutyStart) / (1000 * 60 * 60);
//       attendance.extraHours =
//         attendance.totalHours > dutyHours ? parseFloat((attendance.totalHours - dutyHours).toFixed(2)) : 0;
//     }

//     await attendance.save();
//     res.json({ success: true, data: attendance });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // 🔹 Start Break
// export const startBreak = async (req, res) => {
//   try {
//     const { employeeId } = req.body;
//     if (!employeeId) return res.status(400).json({ success: false, message: "EmployeeId required" });

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const attendance = await Attendance.findOne({ employee: employeeId, date: today });
//     if (!attendance) return res.status(404).json({ success: false, message: "Attendance not found" });

//     // Start break
//     attendance.breaks.push({ breakOut: new Date() });
//     attendance.lastAction = "breakOut";
//     attendance.lastActionAt = new Date();

//     await attendance.save();
//     res.json({ success: true, data: attendance });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // 🔹 End Break
// export const endBreak = async (req, res) => {
//   try {
//     const { employeeId } = req.body;
//     if (!employeeId) return res.status(400).json({ success: false, message: "EmployeeId required" });

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const attendance = await Attendance.findOne({ employee: employeeId, date: today });
//     if (!attendance) return res.status(404).json({ success: false, message: "Attendance not found" });

//     const lastBreak = attendance.breaks[attendance.breaks.length - 1];
//     if (!lastBreak || lastBreak.breakIn) {
//       return res.status(400).json({ success: false, message: "No active break found" });
//     }

//     lastBreak.breakIn = new Date();
//     lastBreak.durationMinutes = Math.round((lastBreak.breakIn - lastBreak.breakOut) / (1000 * 60));

//     attendance.totalBreakMinutes = attendance.breaks.reduce(
//       (sum, b) => sum + (b.durationMinutes || 0),
//       0
//     );

//     attendance.lastAction = "breakIn";
//     attendance.lastActionAt = new Date();

//     await attendance.save();
//     res.json({ success: true, data: attendance });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // 🔹 Undo Last Action (10 mins)
// export const undoLastAction = async (req, res) => {
//   try {
//     const { employeeId } = req.body;
//     if (!employeeId) return res.status(400).json({ success: false, message: "EmployeeId required" });

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const attendance = await Attendance.findOne({ employee: employeeId, date: today });
//     if (!attendance) return res.status(404).json({ success: false, message: "Attendance not found" });

//     if (!attendance.lastAction || !attendance.lastActionAt) {
//       return res.status(400).json({ success: false, message: "No recent action to undo" });
//     }

//     const diffMs = Date.now() - new Date(attendance.lastActionAt).getTime();
//     if (diffMs > 10 * 60 * 1000) {
//       return res.status(400).json({ success: false, message: "Undo time expired" });
//     }

//     switch (attendance.lastAction) {
//       case "checkIn":
//         attendance.checkIn = null;
//         attendance.status = "absent";
//         break;
//       case "checkOut":
//         attendance.checkOut = null;
//         attendance.totalHours = 0;
//         attendance.extraHours = 0;
//         break;
//       case "breakOut":
//         attendance.breaks.pop();
//         break;
//       case "breakIn":
//         const lastBreak = attendance.breaks[attendance.breaks.length - 1];
//         if (lastBreak) {
//           lastBreak.breakIn = null;
//           lastBreak.durationMinutes = 0;
//         }
//         break;
//     }

//     attendance.lastAction = null;
//     attendance.lastActionAt = null;

//     await attendance.save();
//     res.json({ success: true, message: "Last action undone", data: attendance });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // 🔹 Get all attendance
// export const getAllAttendance = async (req, res) => {
//   try {
//     const data = await Attendance.find();
//     res.json({ success: true, data });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // 🔹 Get one employee attendance
// export const getEmployeeAttendance = async (req, res) => {
//   try {
//     const { employeeId } = req.params;
//     if (!employeeId) return res.status(400).json({ success: false, message: "EmployeeId required" });

//     const attendance = await Attendance.findOne({ employee: employeeId });
//     if (!attendance) return res.status(404).json({ success: false, message: "Attendance not found" });

//     res.json({ success: true, data: attendance });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // 🔹 Admin manual update
// export const updateAttendance = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;

//     const attendance = await Attendance.findById(id);
//     if (!attendance) return res.status(404).json({ success: false, message: "Attendance not found" });

//     Object.keys(updates).forEach((key) => {
//       attendance[key] = updates[key];
//     });

//     if (attendance.checkIn && attendance.checkOut) {
//       const workedHours = (new Date(attendance.checkOut) - new Date(attendance.checkIn)) / (1000 * 60 * 60);
//       attendance.totalHours = parseFloat(workedHours.toFixed(2));
//     }

//     await attendance.save();
//     res.json({ success: true, data: attendance });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };


// import Attendance from '../models/AttenanceModel.js'

// Punch In


// import Attendance from "../models/attendance.model.js";

// Punch In


// export const punchIn = async (req, res) => {
//   try {
//     const { employeeId } = req.params;
//     const employeeID= req?.user?.id

// console.log('employee id',employeeID)

//     const existing = await Attendance.findOne({ employeeId, checkOut: null });
//     if (existing) {
//       return res.status(400).json({ success: false, message: "Already Punched In" });
//     }

//     const now = new Date();
//     let attendanceStatus = "Present";

//     // 🔹 Half Day check → after 9:20 AM
//     const halfDayLimit = new Date();
//     halfDayLimit.setHours(9, 20, 0, 0);
//     if (now > halfDayLimit) {
//       attendanceStatus = "Half Day";
//     }

//     const attendance = await Attendance.create({
//       employeeID,
//       employeeId,
//       checkIn: now,
//       attendanceStatus,
//       currentStatus: "Working"
//     });

//     res.json({ success: true, attendance });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // Break Start
// export const startBreak = async (req, res) => {
//   try {
//     const { employeeId } = req.params;
//     const attendance = await Attendance.findOne({ employeeId, checkOut: null });
//     if (!attendance) return res.status(404).json({ success: false, message: "Not Punched In" });

//     attendance.breaks.push({ start: new Date() });
//     attendance.currentStatus = "On Break";
//     await attendance.save();

//     res.json({ success: true, attendance });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // Break End
// export const endBreak = async (req, res) => {
//   try {
//     const { employeeId } = req.params;
//     const attendance = await Attendance.findOne({ employeeId, checkOut: null });
//     if (!attendance) return res.status(404).json({ success: false, message: "Not Punched In" });

//     const lastBreak = attendance.breaks[attendance.breaks.length - 1];
//     if (!lastBreak || lastBreak.end) {
//       return res.status(400).json({ success: false, message: "No active break" });
//     }

//     lastBreak.end = new Date();
//     attendance.currentStatus = "Working";
//     await attendance.save();

//     res.json({ success: true, attendance });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // Punch Out
// export const punchOut = async (req, res) => {
//   try {
//     const { employeeId } = req.params;
//     const attendance = await Attendance.findOne({ employeeId, checkOut: null });
//     if (!attendance) return res.status(404).json({ success: false, message: "Not Punched In" });

//     attendance.checkOut = new Date();
//     attendance.currentStatus = "Completed";

//     // 🔹 Work Minutes
//     const workMinutes = (attendance.checkOut - attendance.checkIn) / (1000 * 60);

//     // 🔹 Break Minutes
//     let breakMinutes = 0;
//     attendance.breaks.forEach(b => {
//       if (b.start && b.end) {
//         breakMinutes += (b.end - b.start) / (1000 * 60);
//       }
//     });

//     attendance.totalHours = ((workMinutes - breakMinutes) / 60).toFixed(2);
//     attendance.totalBreakMinutes = breakMinutes;

//     // 🔹 Extra Hours (after 6:30 PM)
//     const endLimit = new Date();
//     endLimit.setHours(18, 30, 0, 0);

//     if (attendance.checkOut > endLimit) {
//       const extraMinutes = (attendance.checkOut - endLimit) / (1000 * 60);
//       attendance.extraHours = (extraMinutes / 60).toFixed(2);
//     } else {
//       attendance.extraHours = 0;
//     }

//     await attendance.save();
//     res.json({ success: true, attendance });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // Get Today Attendance
// export const getTodayAttendance = async (req, res) => {
//   try {
//     const { employeeId } = req.params;
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const attendance = await Attendance.findOne({
//       employeeId,
//       createdAt: { $gte: today }
//     });

//     res.json({ success: true, attendance });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };



// // ✅ Get all employee attendance  todya ka 
// export const getAllAttendance = async (req, res) => {
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0); // aaj ki date

//     const attendance = await Attendance.find({ createdAt: { $gte: today } })
//       .populate("employeeId", "name employeeNo role"); // agar employee schema linked hai

//     res.json({ success: true, attendance });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };


// // over all attendance
// export const getOverallAttendance = async (req, res) => {
//   try {
//     const attendanceRecords = await Attendance.find({})
//       .populate("employeeID", "profileImage employeeId role") // employee info

//       // Optional: calculate stats
//       // Calculate stats
//     const statsall = attendanceRecords.reduce(
//       (acc, att) => {
//         if (att.checkIn) acc.totalDays++;
//         if (att.totalHours >= 8) acc.fullDays++;
//         if (att.totalHours < 8 && att.totalHours > 0) acc.halfDays++;
//         if (att.lateByMinutes > 0) acc.late++;

//         // Total hours and total break minutes
//         acc.totalHours += att.totalHours ? parseFloat(att.totalHours) : 0;
//         acc.totalBreakMinutes += att.totalBreakMinutes || 0;

//         // Overtime (hours above 8)
//         if (att.totalHours > 8) acc.overtime += att.totalHours - 8;

//         return acc;
//       },
//       { totalDays: 0, fullDays: 0, halfDays: 0, late: 0, totalHours: 0, totalBreakMinutes: 0, overtime: 0 }
//     );

//     // Helper function to format hours into 'Xh Ymin'
//     const formatHours = (hoursDecimal) => {
//       const h = Math.floor(hoursDecimal);
//       const m = Math.round((hoursDecimal - h) * 60);
//       return `${h}h ${m}min`;
//     };

//     // Format totals
//     const formattedStats = {
//       totalDays: statsall.totalDays,
//       fullDays: statsall.fullDays,
//       halfDays: statsall.halfDays,
//       late: statsall.late,
//       totalHours: formatHours(statsall.totalHours),
//       totalBreak: formatHours(statsall.totalBreakMinutes / 60),
//       overtime: formatHours(statsall.overtime),
//     };

//     res.json({ success: true, records: attendanceRecords, stats: formattedStats });

//     // res.json({ success: true, data: allAttendance, stats });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };


// export const getEmployeeOverallAttendance = async (req, res) => {
//   try {
//     const { employeeId } = req.params;

//     const attendanceRecords = await Attendance.find({ employeeId }).sort({ createdAt: -1 });

//     // Calculate stats
//     const statsall = attendanceRecords.reduce(
//       (acc, att) => {
//         if (att.checkIn) acc.totalDays++;
//         if (att.totalHours >= 8) acc.fullDays++;
//         if (att.totalHours < 8 && att.totalHours > 0) acc.halfDays++;
//         if (att.lateByMinutes > 0) acc.late++;

//         // Total hours and total break minutes
//         acc.totalHours += att.totalHours ? parseFloat(att.totalHours) : 0;
//         acc.totalBreakMinutes += att.totalBreakMinutes || 0;

//         // Overtime (hours above 8)
//         if (att.totalHours > 8) acc.overtime += att.totalHours - 8;

//         return acc;
//       },
//       { totalDays: 0, fullDays: 0, halfDays: 0, late: 0, totalHours: 0, totalBreakMinutes: 0, overtime: 0 }
//     );

//     // Helper function to format hours into 'Xh Ymin'
//     const formatHours = (hoursDecimal) => {
//       const h = Math.floor(hoursDecimal);
//       const m = Math.round((hoursDecimal - h) * 60);
//       return `${h}h ${m}min`;
//     };

//     // Format totals
//     const formattedStats = {
//       totalDays: statsall.totalDays,
//       fullDays: statsall.fullDays,
//       halfDays: statsall.halfDays,
//       late: statsall.late,
//       totalHours: formatHours(statsall.totalHours),
//       totalBreak: formatHours(statsall.totalBreakMinutes / 60),
//       overtime: formatHours(statsall.overtime),
//     };

//     res.json({ success: true, records: attendanceRecords, stats: formattedStats });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };


// =============================
// Punch In
// =============================
export const punchIn = async (req, res) => {
  try {
    const employeeID = req?.user?.id; // JWT se mila
     const { employeeId } = req.params;           // URL param
    const userEmployeeId = req?.user?.employeeId; // JWT se mila

    // 🔹 Step 1: Check dono match hote hain ya nahi
    if (employeeId !== userEmployeeId) {
      return res.status(403).json({ 
        success: false, 
        message: "Unauthorized Punch In" 
      });
    }

    // 🔹 Step 2: Validate employee exists
    const employee = await EmployeeModel.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({ 
        success: false, 
        message: "Employee not found" 
      });
    }

    const existing = await Attendance.findOne({ employeeId, checkOut: null });
    if (existing) {
      return res.status(400).json({ success: false, message: "Already Punched In" });
    }

    const now = new Date();
    let attendanceStatus = "Present";

    // 🔹 Half Day check → after 9:20 AM
    const halfDayLimit = new Date();
    halfDayLimit.setHours(9, 20, 0, 0);
    if (now > halfDayLimit) {
      attendanceStatus = "Half Day";
    }

    const attendance = await Attendance.create({
      employeeID,
      employeeId,
      checkIn: now,
      attendanceStatus,
      currentStatus: "Working",
    });

    res.json({ success: true, attendance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =============================
// Break Start
// =============================
export const startBreak = async (req, res) => {
  try {
    const { employeeId } = req.params;
 
    const userEmployeeId = req?.user?.employeeId; // JWT se mila

    // 🔹 Step 1: Check dono match hote hain ya nahi
    if (employeeId !== userEmployeeId) {
      return res.status(403).json({ 
        success: false, 
        message: "Unauthorized  Employee" 
      });
    }
    const attendance = await Attendance.findOne({ employeeId, checkOut: null });
    if (!attendance) return res.status(404).json({ success: false, message: "Not Punched In" });

    attendance.breaks.push({ start: new Date() });
    attendance.currentStatus = "On Break";
    await attendance.save();

    res.json({ success: true, attendance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =============================
// Break End
// =============================
export const endBreak = async (req, res) => {
  try {
    const { employeeId } = req.params;
    

       const userEmployeeId = req?.user?.employeeId; // JWT se mila

    // 🔹 Step 1: Check dono match hote hain ya nahi
    if (employeeId !== userEmployeeId) {
      return res.status(403).json({ 
        success: false, 
        message: "Unauthorized  Employee" 
      });
    }
    const attendance = await Attendance.findOne({ employeeId, checkOut: null });
    if (!attendance) return res.status(404).json({ success: false, message: "Not Punched In" });

    const lastBreak = attendance.breaks[attendance.breaks.length - 1];
    if (!lastBreak || lastBreak.end) {
      return res.status(400).json({ success: false, message: "No active break" });
    }

    lastBreak.end = new Date();
    attendance.currentStatus = "Working";
    await attendance.save();

    res.json({ success: true, attendance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =============================
// Punch Out
// =============================
export const punchOut = async (req, res) => {
  try {
    const { employeeId } = req.params;
        const userEmployeeId = req?.user?.employeeId; // JWT se mila

    // 🔹 Step 1: Check dono match hote hain ya nahi
    if (employeeId !== userEmployeeId) {
      return res.status(403).json({ 
        success: false, 
        message: "Unauthorized  Employee" 
      });
    }
    const attendance = await Attendance.findOne({ employeeId, checkOut: null });
    if (!attendance) {
      return res.status(404).json({ success: false, message: "Not Punched In" });
    }

    attendance.checkOut = new Date();
    attendance.currentStatus = "Completed";

    // 🔹 Work Minutes (CheckIn → CheckOut)
    const workMinutes = (attendance.checkOut - attendance.checkIn) / (1000 * 60);

    // 🔹 Break Minutes
    let breakMinutes = 0;
    attendance.breaks.forEach((b) => {
      if (b.start && b.end) {
        breakMinutes += (b.end - b.start) / (1000 * 60);
      }
    });

    // 🔹 Net Working Minutes
    const netMinutes = workMinutes - breakMinutes;
    const netHours = netMinutes / 60;

    attendance.totalHours = parseFloat(netHours.toFixed(2));
    attendance.totalBreakMinutes = Math.round(breakMinutes);

    // 🔹 Required Work Hours (example: 8h)
    const requiredMinutes = 8 * 60;

    // 🔹 Extra Hours (overtime after completing required hours)
    let extraMinutes = 0;
    if (netMinutes > requiredMinutes) {
      extraMinutes = netMinutes - requiredMinutes;
    }

    attendance.extraHours = parseFloat((extraMinutes / 60).toFixed(2));

  

    await attendance.save();
    res.json({ success: true, attendance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// =============================
// Get Today Attendance
// =============================
export const getTodayAttendance = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      employeeId,
      createdAt: { $gte: today },
    }).populate("employeeID", "name employeeNo role profileImage");

    res.json({ success: true, attendance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =============================
// Get All Employees Attendance (Today)
// =============================
export const getAllAttendance = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.find({ createdAt: { $gte: today } })
      .populate("employeeID", "name employeeNo role profileImage");

    res.json({ success: true, attendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// =============================
// Get Overall Attendance (All Employees)
// =============================
export const getOverallAttendance = async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find({})
      .populate("employeeID", "name employeeNo role profileImage firstName lastName");

    res.json({ success: true, records: attendanceRecords });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// =============================
// Get Overall Attendance (Single Employee)
// =============================
export const getEmployeeOverallAttendance = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const attendanceRecords = await Attendance.find({ employeeId })
      .populate("employeeID", "name employeeNo role profileImage")
      .sort({ createdAt: -1 });

    res.json({ success: true, records: attendanceRecords });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

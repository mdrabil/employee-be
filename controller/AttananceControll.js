

import Attendance from '../models/AttenanceModel.js'
import EmployeeModel from '../models/EmployeeModel.js';
import { formatHours } from '../utils/TimeMinHelper.js';



// =============================
// Punch In
// =============================
// export const punchIn = async (req, res) => {
//   try {
//     const employeeID = req?.user?.id; // JWT se mila
//      const { employeeId } = req.params;           // URL param
//     const userEmployeeId = req?.user?.employeeId; // JWT se mila

//     // 🔹 Step 1: Check dono match hote hain ya nahi
//     if (employeeId !== userEmployeeId) {
//       return res.status(403).json({ 
//         success: false, 
//         message: "Unauthorized Punch In" 
//       });
//     }

//     // 🔹 Step 2: Validate employee exists
//     const employee = await EmployeeModel.findOne({ employeeId });
//     if (!employee) {
//       return res.status(404).json({ 
//         success: false, 
//         message: "Employee not found" 
//       });
//     }

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
//       currentStatus: "Working",
//     });

//     res.json({ success: true, attendance });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };




export const punchIn = async (req, res) => {
  try {
    const employeeID = req?.user?.id; // JWT se mila
    const { employeeId } = req.params; // URL param
    const userEmployeeId = req?.user?.employeeId; // JWT se mila

    // 🔹 Step 1: Check dono match hote hain ya nahi
    if (employeeId !== userEmployeeId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized Punch In",
      });
    }

    // 🔹 Step 2: Validate employee exists
    const employee = await EmployeeModel.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const existing = await Attendance.findOne({ employeeId, checkOut: null });
    if (existing) {
      return res.status(400).json({ success: false, message: "Already Punched In" });
    }

    const now = new Date();
    let attendanceStatus = "Present";
    let lateBy = "0h 0min"; // default

    // 🔹 Half Day & Late check
    const halfDayLimit = new Date();
    halfDayLimit.setHours(9, 20, 0, 0);

    if (now > halfDayLimit) {
      attendanceStatus = "Half Day";

      // kitna late hua calculate
      const diffMs = now - halfDayLimit; // milliseconds
      const diffHours = diffMs / (1000 * 60 * 60); // decimal hours
      lateBy = formatHours(diffHours);
    }

    const attendance = await Attendance.create({
      employeeID,
      employeeId,
      checkIn: now,
      attendanceStatus,
      currentStatus: "Working",
      lateBy, // new field
    });
  req.io.emit("attendanceUpdate", {
      type: "punchIn",
      employee: employee?.firstName,
      data: attendance,
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

    req.io.emit("attendanceUpdate", {
  type: "startBreak",
  employee: attendance.employeeID?.firstName,
  data: attendance,
});


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

    req.io.emit("attendanceUpdate", {
  type: "endBreak",
  employee: attendance.employeeID?.firstName,
  data: attendance,
});


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
   attendance.totalBreakTime = Math.round(breakMinutes); // ✅ updated field

    // 🔹 Required Work Hours (example: 8h)
    const requiredMinutes = 8 * 60;

    // 🔹 Extra Hours (overtime after completing required hours)
    let extraMinutes = 0;
    if (netMinutes > requiredMinutes) {
      extraMinutes = netMinutes - requiredMinutes;
    }

    attendance.extraHours = parseFloat((extraMinutes / 60).toFixed(2));

  

    await attendance.save();


    req.io.emit("attendanceUpdate", {
  type: "punchOut",
  employee: attendance.employeeID?.firstName,
  data: attendance,
});

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


    let totalPresent = 0;
    let totalAbsent = 0;
    let totalLate = 0;

    attendance.forEach((rec) => {
      // Present count (Present + Half Day)
      if (rec.attendanceStatus === "Present" || rec.attendanceStatus === "Half Day") {
        totalPresent++;
      }
      // Absent count
      if (rec.attendanceStatus === "Absent") {
        totalAbsent++;
      }
      // Late count (if lateBy not "0h 0min" or "0m")
      if (rec.lateBy && rec.lateBy !== "0h 0min" && rec.lateBy !== "0m") {
        totalLate++;
      }
    });

    res.json({
      success: true,
     attendance,
      stats: {
        totalPresent,
        totalAbsent,
        totalLate,
      },
    });

    // res.json({ success: true, attendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// =============================
// Get Overall Attendance (All Employees)
// =============================
// export const getOverallAttendance = async (req, res) => {
//   try {
//     const attendanceRecords = await Attendance.find({})
//       .populate("employeeID", "name employeeNo role profileImage firstName lastName");

//     res.json({ success: true, records: attendanceRecords });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

export const getOverallAttendance = async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find({})
      .populate("employeeID", "firstName lastName employeeNo role profileImage");

    // ✅ Stats calculate
    let totalPresent = 0;
    let totalAbsent = 0;
    let totalLate = 0;

    attendanceRecords.forEach((rec) => {
      // Present count (Present + Half Day)
      if (rec.attendanceStatus === "Present" || rec.attendanceStatus === "Half Day") {
        totalPresent++;
      }
      // Absent count
      if (rec.attendanceStatus === "Absent") {
        totalAbsent++;
      }
      // Late count (if lateBy not "0h 0min" or "0m")
      if (rec.lateBy && rec.lateBy !== "0h 0min" && rec.lateBy !== "0m") {
        totalLate++;
      }
    });

    res.json({
      success: true,
      records: attendanceRecords,
      stats: {
        totalPresent,
        totalAbsent,
        totalLate,
      },
    });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};



// export const getEmployeeOverallAttendance = async (req, res) => {
//   try {
//     const { employeeId } = req.params;

//     const attendanceRecords = await Attendance.find({ employeeId })
//       .populate("employeeID", "name employeeNo role profileImage")
//       .sort({ createdAt: -1 });

//     res.json({ success: true, records: attendanceRecords });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };


export const getEmployeeOverallAttendance = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const attendanceRecords = await Attendance.find({ employeeId })
      .populate("employeeID", "name employeeNo role profileImage")
      .sort({ createdAt: -1 });

    // 🔹 Aggregate totals
    let totalWorkHours = 0;
    let totalBreakMinutes = 0;
    let totalExtraHours = 0;
    let presentCount = 0;
    let halfDayCount = 0;
    let absentCount = 0;
    let leaveCount = 0;

    attendanceRecords.forEach(record => {
      totalWorkHours += record.totalHours || 0;
      totalBreakMinutes += record.totalBreakTime || 0;
      totalExtraHours += record.extraHours || 0;

      switch (record.attendanceStatus) {
        case "Present":
          presentCount++;
          break;
        case "Half Day":
          halfDayCount++;
          break;
        case "Absent":
          absentCount++;
          break;
        case "Leave":
          leaveCount++;
          break;
        default:
          break;
      }
    });

    // 🔹 Format using your helper
    const summary = {
      totalWorkFormatted: formatHours(totalWorkHours),
      totalBreakFormatted: formatHours(totalBreakMinutes / 60), // mins -> hours
      totalOvertimeFormatted: formatHours(totalExtraHours),
      presentCount,
      halfDayCount,
      absentCount,
      leaveCount
    };
// console.log('records',attendanceRecords)
// console.log('summary',summary)
    res.json({ success: true, summary, records: attendanceRecords });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

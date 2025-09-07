// routes/employeeOnline.js
import express from "express";

const router = express.Router();

// 🔹 Get all employees online/offline
export const getisOnlineEmplyee =  async (req, res) => {
  try {
    const onlineEmployees = await EmployeeOnline.find();
    res.json({ success: true, data: onlineEmployees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔹 Set employee online
export const  isOnlineEmplyee = async (req, res) => {
  try {
    const { employeeId } = req.body;
    let record = await EmployeeOnline.findOne({ employee: employeeId });

    const now = new Date();

    if (!record) {
      record = new EmployeeOnline({
        employee: employeeId,
        isOnline: true,
        lastLogin: now,
        sessions: [{ loginTime: now }]
      });
    } else {
      record.isOnline = true;
      record.lastLogin = now;
      record.sessions.push({ loginTime: now });
    }

    await record.save();
    res.json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// 🔹 Set employee offline
export const IsOfflineEmplyee =  async (req, res) => {
  try {
    const { employeeId } = req.body;
    const now = new Date();
    const record = await EmployeeOnline.findOne({ employee: employeeId });

    if (!record) return res.status(404).json({ success: false, message: "Not found" });

    record.isOnline = false;
    record.lastLogout = now;

    // Update last session
    const lastSession = record.sessions[record.sessions.length - 1];
    if (lastSession && !lastSession.logoutTime) {
      lastSession.logoutTime = now;
      lastSession.durationMinutes = Math.round((now - lastSession.loginTime) / 60000);
    }

    await record.save();
    res.json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}





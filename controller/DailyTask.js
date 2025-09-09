



import DailyTask from "../models/DailyTask.js";

/* ---------- Helper: normalize date to start of day ---------- */
const normalizeDate = (d) => {
  const date = d ? new Date(d) : new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

/* ---------- Recalculate summary for a DailyTask document ---------- */
function recalcSummary(doc) {
  const completedTasks = doc.tasks.filter(t => t.status === "completed");
  doc.totalHours = completedTasks.reduce((acc, t) => acc + (t.durationHours || 0), 0);
  doc.completedTasks = completedTasks.length;
  doc.pendingTasks = doc.tasks.filter(t => t.status === "pending").length;
  doc.productivityScore = doc.tasks.length ? Math.round((doc.completedTasks / doc.tasks.length) * 100) : 0;
}

/* ---------- Employee: Get own tasks (all days) ---------- */
export const getMyDailyTasks = async (req, res) => {
  try {
    const employeeId = req.user?.id || req.user?.employeeId;
    if (!employeeId) return res.status(401).json({ success: false, message: "Unauthorized User" });

    const docs = await DailyTask.find({ employee: employeeId }).sort({ date: -1 })
    res.json({ success: true, data: docs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ---------- Admin: Get all tasks ---------- */
// 🔹 Get All Daily Tasks (Admin Only)
export const getAllDailyTasks = async (req, res) => {
  try {
    // ✅ Check if logged-in user is admin
    if (!req.user || req.user.role?.name !== "admin") {
      // console.log('kya kya hai',req?.user?.role?.name)
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admin can view all tasks.",
      });
    }

    // ✅ Fetch tasks
    const docs = await DailyTask.find().sort({ date: -1 });

    res.json({ success: true, data: docs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


/* ---------- Admin: Get today's tasks ---------- */
export const getTodayTasks = async (req, res) => {
  try {
    const start = normalizeDate(new Date());
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);

    const docs = await DailyTask.find({ date: { $gte: start, $lte: end } }).sort({ employee: 1 });
    res.json({ success: true, data: docs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ---------- Get a single DailyTask by ID ---------- */
export const getDailyTaskById = async (req, res) => {
  try {
    const doc = await DailyTask.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


/* ---------- Get summary for a DailyTask ---------- */



/* ---------- Employee: Add a task for today (or specific date) ---------- */
export const addTaskForToday = async (req, res) => {
  try {
    // const employeeId = req.user?.id || req.user?.employeeId;

      const employeeId = req.body.assignedTo || req.user?.id || req.user?.employeeId;

    if (!employeeId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    
    // if (!employeeId) return res.status(401).json({ success: false, message: "Unauthorized" });

    
    const body = req.body;

 const task = {
  project: body.project,
  title: body.title,
  Ptitle: body?.Ptitle || "Office Work",
  description: body.description,
  startTime: body.startTime ? new Date(body.startTime) : undefined,
  endTime: body.endTime ? new Date(body.endTime) : undefined,
  priority: body.priority || "medium",
  messages: body.messages || "",
};

    const dateToUse = normalizeDate(body.date);

    let doc = await DailyTask.findOne({
      employee: employeeId,
      date: dateToUse
    });

    if (!doc) {
      doc = new DailyTask({ employee: employeeId, date: dateToUse, tasks: [task] });
    } else {
      doc.tasks.push(task);
    }

    recalcSummary(doc);
    await doc.save();
    res.status(201).json({ success: true, data: doc });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

/* ---------- Update Task Status with timer ---------- */
// export const updateTaskStatus = async (req, res) => {
//   try {
//     const { dailyTaskId, taskId } = req.params;
//     const { status, endTime } = req.body;

//     if (!["pending", "in-progress", "completed"].includes(status))
//       return res.status(400).json({ success: false, message: "Invalid status" });

//     const doc = await DailyTask.findById(dailyTaskId);
//     if (!doc) return res.status(404).json({ success: false, message: "Daily task not found" });

//     const task = doc.tasks.id(taskId);
//     if (!task) return res.status(404).json({ success: false, message: "Task not found" });

//     const now = new Date();

//     if (status === "in-progress") {
//       // Start this task, stop any other in-progress tasks
//       doc.tasks.forEach(t => {
//         if (t._id.equals(task._id)) {
//           if (t.status !== "completed") t.status = "in-progress";
//           // ✅ StartTime sirf pehli baar set ho
//           if (!t.startTime) t.startTime = now;
//           if (!t.lastStartedAt) t.lastStartedAt = now;
//         } else if (t.status === "in-progress" && t.lastStartedAt) {
//           const diff = (now - t.lastStartedAt) / (1000 * 60 * 60);
//           t.timeCounter += Math.round(diff * 100) / 100;
//           t.lastStartedAt = null;
//           if (t.status !== "completed") t.status = "pending";
//         }
//       });
//     } else if (status === "completed") {
//       // Stop timer if in-progress
//       if (task.status === "in-progress" && task.lastStartedAt) {
//         const diff = (now - task.lastStartedAt) / (1000 * 60 * 60);
//         task.timeCounter += Math.round(diff * 100) / 100;
//         task.lastStartedAt = null;
//       }
//       task.status = "completed";
//       task.endTime = endTime ? new Date(endTime) : now;

//       // Duration calculate: agar startTime hai tab
//       // if (task.startTime) {
//       //   const diff = (task.endTime - task.startTime) / (1000 * 60 * 60);
//       //   task.durationHours = Math.round(diff * 100) / 100;
//       // }
//       if (task.startTime) {
//   const diff = (task.endTime - task.startTime) / (1000 * 60 * 60); // current session
//   task.durationHours = Math.round((diff + (task.timeCounter || 0)) * 100) / 100; 
//   task.timeCounter = 0; // reset after completion
// }

//     } else if (status === "pending") {
//       // Agar in-progress thi to timer stop karo
//       if (task.status === "in-progress" && task.lastStartedAt) {
//         const diff = (now - task.lastStartedAt) / (1000 * 60 * 60);
//         task.timeCounter += Math.round(diff * 100) / 100;
//         task.lastStartedAt = null;
//       }
//       if (task.status !== "completed") task.status = "pending";
//     }

//     recalcSummary(doc);
//     await doc.save();
//     res.json({ success: true, data: doc });
//   } catch (err) {
//     console.error(err);
//     res.status(400).json({ success: false, message: err.message });
//   }
// };

export const updateTaskStatus = async (req, res) => {
  try {
    const { dailyTaskId, taskId } = req.params;
    const { status, endTime } = req.body;

    if (!["pending", "in-progress", "completed"].includes(status))
      return res.status(400).json({ success: false, message: "Invalid status" });

    const doc = await DailyTask.findById(dailyTaskId);
    if (!doc) return res.status(404).json({ success: false, message: "Daily task not found" });

    const task = doc.tasks.id(taskId);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

    const now = new Date();

    if (status === "in-progress") {
      // 🔹 Start this task
      doc.tasks.forEach(t => {
        if (t._id.equals(task._id)) {
          if (t.status !== "completed") t.status = "in-progress";
          if (!t.startTime) t.startTime = now;
          if (!t.lastStartedAt) {
            t.lastStartedAt = now;
            t.progressSessions.push({ start: now }); // new session start
          }
        } else if (t.status === "in-progress" && t.lastStartedAt) {
          // stop other in-progress tasks
          let lastSession = t.progressSessions[t.progressSessions.length - 1];
          if (lastSession && !lastSession.end) {
            lastSession.end = now;
          }
          t.lastStartedAt = null;
          if (t.status !== "completed") t.status = "pending";
        }
      });
    } 
    
    else if (status === "completed") {
      if (task.status === "in-progress" && task.lastStartedAt) {
        // close current session
        let lastSession = task.progressSessions[task.progressSessions.length - 1];
        if (lastSession && !lastSession.end) {
          lastSession.end = now;
        }
        task.lastStartedAt = null;
      }
      task.status = "completed";
      task.endTime = endTime ? new Date(endTime) : now;

      // 🔹 Calculate total duration from sessions
      let totalHours = 0;
      task.progressSessions.forEach(s => {
        if (s.start && s.end) {
          const diff = (s.end - s.start) / (1000 * 60 * 60);
          totalHours += diff;
        }
      });
      task.durationHours = Math.round(totalHours * 100) / 100;
    } 
    
    else if (status === "pending") {
      if (task.status === "in-progress" && task.lastStartedAt) {
        let lastSession = task.progressSessions[task.progressSessions.length - 1];
        if (lastSession && !lastSession.end) {
          lastSession.end = now;
        }
        task.lastStartedAt = null;
      }
      if (task.status !== "completed") task.status = "pending";
    }

    recalcSummary(doc);
    await doc.save();
    res.json({ success: true, data: doc });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

/* ---------- Get summary for a DailyTask ---------- */
export const getTaskSummary = async (req, res) => {
  try {
    const doc = await DailyTask.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: "Not found" });

    res.json({
      success: true,
      data: {
        totalHours: doc.totalHours,
        completedTasks: doc.completedTasks,
        pendingTasks: doc.pendingTasks,
        productivityScore: doc.productivityScore
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ---------- Delete DailyTask (Admin) ---------- */
export const deleteDailyTask = async (req, res) => {
  try {
    await DailyTask.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

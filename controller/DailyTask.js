import DailyTask from "../models/DailyTask.js";
import mongoose from "mongoose";

/* Helper: normalize date to start of day */
const normalizeDate = (d) => {
  const date = d ? new Date(d) : new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

/* Helper: parse "HH:mm" to Date (1970-01-01) */
function parseHMToDate(hm) {
  if (!hm || typeof hm !== "string") return null;
  const [hh, mm] = hm.split(":").map(x => parseInt(x, 10));
  if (Number.isNaN(hh) || Number.isNaN(mm)) return null;
  return new Date(1970, 0, 1, hh, mm);
}

/* Recalculate summary for a DailyTask document */
function recalcSummary(doc) {
  const completedTasks = doc.tasks.filter(t => t.status === "completed");
  doc.totalHours = completedTasks.reduce((acc, t) => acc + (t.durationHours || 0), 0);
  doc.completedTasks = completedTasks.length;
  doc.pendingTasks = doc.tasks.filter(t => t.status === "pending").length;
  doc.productivityScore = doc.tasks.length ? Math.round((doc.completedTasks / doc.tasks.length) * 100) : 0;
}

/* ---------- Employee: add a task (push into today's doc OR create new) ---------- */
export const addTaskForToday = async (req, res) => {
  try {
    const employeeId = req.user?.id || req.user?.employeeId; // depends on your auth
    if (!employeeId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const body = req.body; // expect { title, description, startTime, ... , date? }
    const task = {
      project: body.project,
      title: body.title,
      description: body.description,
      startTime: body.startTime,
      endTime: body.endTime,
      priority: body.priority || "medium",
      tags: body.tags || [],
      remarks: body.remarks || ""
    };

    const dateToUse = normalizeDate(body.date);
    const dayStart = new Date(dateToUse);
    const dayEnd = new Date(dateToUse);
    dayEnd.setHours(23, 59, 59, 999);

    // find existing doc for this employee + date
    let doc = await DailyTask.findOne({
      employee: employeeId,
      date: { $gte: dayStart, $lte: dayEnd }
    });

    if (!doc) {
      doc = new DailyTask({
        employee: employeeId,
        date: dateToUse,
        tasks: [task]
      });
    } else {
      doc.tasks.push(task);
    }

    recalcSummary(doc); // summary (duration 0 unless completed)
    await doc.save();
    res.status(201).json({ success: true, data: doc });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

/* ---------- Employee: get own tasks (all days) ---------- */
export const getMyDailyTasks = async (req, res) => {
  try {
    const employeeId = req.user?.id || req.user?.employeeId;
 
    if (!employeeId) return res.status(401).json({ success: false, message: "Unauthorized User" });

    const docs = await DailyTask.find({ employee: employeeId }).sort({ date: -1 });
    res.json({ success: true, data: docs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ---------- Admin: get all tasks ---------- */
export const getAllDailyTasks = async (req, res) => {
  try {
    const docs = await DailyTask.find().sort({ date: -1 });
    res.json({ success: true, data: docs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ---------- Admin: get today's tasks ---------- */
export const getTodayTasks = async (req, res) => {
  try {
    const start = normalizeDate(new Date());
    const end = new Date(start); end.setHours(23,59,59,999);

    const docs = await DailyTask.find({ date: { $gte: start, $lte: end } }).sort({ employee: 1 });
    res.json({ success: true, data: docs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ---------- Get a single DailyTask by id ---------- */
export const getDailyTaskById = async (req, res) => {
  try {
    const doc = await DailyTask.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ---------- Update task status (employee action) ---------- */
/* PATCH /api/dailytasks/:dailyTaskId/tasks/:taskId/status
   body: { status: "in-progress"|"completed"|"pending", endTime?: "HH:mm" } */
// export const updateTaskStatus = async (req, res) => {
//   try {
//     const { dailyTaskId, taskId } = req.params;
//     const { status, endTime } = req.body;
//     console.log('status',status)
//     if (!["pending","in-progress","completed"].includes(status))
//       return res.status(400).json({ success: false, message: "Invalid status" });

//     const doc = await DailyTask.findById(dailyTaskId);
//     if (!doc) return res.status(404).json({ success: false, message: "Daily task not found" });

//     const sub = doc.tasks.id(taskId);
//     if (!sub) return res.status(404).json({ success: false, message: "Task not found" });

//     if (status === "in-progress") {
//       // set this one in-progress, all others (non-completed) -> pending
//       doc.tasks.forEach(t => {
//         if (t._id.equals(sub._id)) {
//           if (t.status !== "completed") t.status = "in-progress";
//         } else {
//           if (t.status !== "completed") t.status = "pending";
//         }
//       });
//     } else if (status === "completed") {
//       // mark completed, set endTime (either provided or current time)
//       sub.status = "completed";
//       sub.endTime = endTime || (() => {
//         const now = new Date();
//         return `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
//       })();

//       // calculate duration if startTime exists
//       const startD = parseHMToDate(sub.startTime);
//       const endD = parseHMToDate(sub.endTime);

//       if (startD && endD) {
//         let diff = (endD - startD) / (1000 * 60 * 60); // hours
//         if (diff < 0) {
//           // optional: if negative, assume ended next day -> add 24
//           diff = diff + 24;
//         }
//         sub.durationHours = Math.round(diff * 100) / 100; // round to 2 decimals
//       } else {
//         sub.durationHours = sub.durationHours || 0;
//       }
//     } else if (status === "pending") {
//       // set pending (don't change duration)
//       if (sub.status !== "completed") sub.status = "pending";
//     }

//     // Recalculate summary only using completed tasks' durations
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

    if (!["pending","in-progress","completed"].includes(status))
      return res.status(400).json({ success: false, message: "Invalid status" });

    const doc = await DailyTask.findById(dailyTaskId);
    if (!doc) return res.status(404).json({ success: false, message: "Daily task not found" });

    const sub = doc.tasks.id(taskId);
    if (!sub) return res.status(404).json({ success: false, message: "Task not found" });

    if (status === "in-progress") {
      doc.tasks.forEach(t => {
        if (t._id.equals(sub._id)) {
          if (t.status !== "completed") t.status = "in-progress";
        } else {
          if (t.status !== "completed") t.status = "pending";
        }
      });
    } else if (status === "completed") {
      sub.status = "completed";
      sub.endTime = endTime || (() => {
        const now = new Date();
        return `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
      })();

      const startD = parseHMToDate(sub.startTime);
      const endD = parseHMToDate(sub.endTime);

      if (startD && endD) {
        let diff = (endD - startD) / (1000 * 60 * 60);
        if (diff < 0) diff += 24;
        sub.durationHours = Math.round(diff * 100) / 100;
      }
    } else if (status === "pending") {
      if (sub.status !== "completed") sub.status = "pending";
    }

    recalcSummary(doc);
    await doc.save();

    res.json({ success: true, data: doc });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

/* ---------- Get summary for a dailyTask (by id) ---------- */
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

/* ---------- Delete daily task doc (admin) ---------- */
export const deleteDailyTask = async (req, res) => {
  try {
    await DailyTask.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

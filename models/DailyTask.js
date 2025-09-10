import mongoose from "mongoose";
import { calculateSessionsDuration, formatDate, formatDateTime, formatHours, formatTime } from "../utils/TimeMinHelper.js";

const { Schema, model } = mongoose;

// 🔹 Meeting Schema with Date
const meetingSchema = new Schema({
  name: { type: String },
  time: { type: Date },     // ✅ now full Date
  endTime: { type: Date }   // ✅ now full Date
}, { _id: true });

// 🔹 Task Schema
// 🔹 Task Schema
const taskSubSchema = new Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  assignByUser: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  title: { type: String, required: true },
  Ptitle: { type: String},
  description: { type: String },
  startTime: { type: Date },  
  endTime: { type: Date },     
  progressSessions: [
    {
      start: { type: Date },
      end: { type: Date }
    }
  ],
  durationHours: { type: Number, default: 0 },
  timeCounter: { type: Number, default: 0 },
  lastStartedAt: { type: Date },
  status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  meetings: [meetingSchema],
  messages: { type: String }
}, { _id: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });


// 🔹 Virtuals for Task
taskSubSchema.virtual("durationFormatted").get(function () {
  return formatHours(this.durationHours || 0);
});
taskSubSchema.virtual("lastStartedFormatted").get(function () {
  return formatDateTime(this.lastStartedAt);
});
taskSubSchema.virtual("startTimeFormatted").get(function () {
  return formatTime(this.startTime);
});
taskSubSchema.virtual("endTimeFormatted").get(function () {
  return formatTime(this.endTime);
});


// 🔹 Meeting Virtuals
meetingSchema.virtual("timeFormatted").get(function () {
  return formatHours(this.time);
});
meetingSchema.virtual("endTimeFormatted").get(function () {
  return formatHours(this.endTime);
});
// ✅ NEW: Sessions ka total formatted duration
taskSubSchema.virtual("progressSessionsFormatted").get(function () {
  return calculateSessionsDuration(this.progressSessions || []);
});

// 🔹 DailyTask Schema
const dailyTaskSchema = new Schema({
  employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
  date: { type: Date, required: true },
  tasks: [taskSubSchema],
  totalHours: { type: Number, default: 0 },
  completedTasks: { type: Number, default: 0 },
  pendingTasks: { type: Number, default: 0 },
  productivityScore: { type: Number, default: 0 },
  managerNotes: { type: String },
  employeeNotes: { type: String },
  submitted: { type: Boolean, default: false },
  approved: { type: Boolean, default: false }
}, { timestamps: true });

// 🔹 DailyTask Virtuals
dailyTaskSchema.virtual("dateFormatted").get(function () {
  return formatDate(this.date);
});
dailyTaskSchema.virtual("totalHoursFormatted").get(function () {
  return formatHours(this.totalHours || 0);
});

// 🔹 Auto populate
function autoPopulate(next) {
  this.populate({
    path: "employee",
    select: "firstName lastName email department role"
  }).populate({
    path: "tasks.project",
    select: "name description"
  });
  next();
}
["find", "findOne", "findOneAndUpdate", "findById"].forEach(hook =>
  dailyTaskSchema.pre(hook, autoPopulate)
);

dailyTaskSchema.set("toJSON", { virtuals: true });
dailyTaskSchema.set("toObject", { virtuals: true });

export default model("DailyTask", dailyTaskSchema);

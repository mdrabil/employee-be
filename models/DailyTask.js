import mongoose from "mongoose";
const { Schema, model } = mongoose;

const taskSubSchema = new Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  title: { type: String, required: true },
  description: { type: String },
  startTime: { type: String }, // "09:00"
  endTime: { type: String },   // "11:00"
  durationHours: { type: Number, default: 0 }, // calculated when completed
  status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  remarks: { type: String },
  tags: [{ type: String }]
}, { _id: true });

const dailyTaskSchema = new Schema({
  employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
  // store date normalized to midnight for easy querying
  date: { type: Date, required: true },
  tasks: [taskSubSchema],
  totalHours: { type: Number, default: 0 },
  completedTasks: { type: Number, default: 0 },
  pendingTasks: { type: Number, default: 0 },
  productivityScore: { type: Number, default: 0 }, // 0-100
  managerNotes: { type: String },
  employeeNotes: { type: String },
  submitted: { type: Boolean, default: false },
  approved: { type: Boolean, default: false }
}, { timestamps: true });

// auto-populate employee and project details on find
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
["find", "findOne", "findOneAndUpdate", "findById"].forEach(hook => dailyTaskSchema.pre(hook, autoPopulate));

export default model("DailyTask", dailyTaskSchema);

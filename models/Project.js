import mongoose from "mongoose";

const { Schema, model } = mongoose;

const taskSchema = new Schema({
  title: { type: String },
  description: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  startTime: { type: Date },
  endTime: { type: Date },
status: {
  type: String,
  enum: ["pending", "in progress", "completed", "stop", "hold", "cancel", "continue"],
  default: "pending",
}
,

  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
});

const projectSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },



    client: {
      name: { type: String, required: true },
      email: { type: String }, // optional
      phone: { type: String }, // optional
    },

    startDate: { type: Date, default: Date.now },
    deadline: { type: Date, required: true },

    employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }], // array of IDs
    lead: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }], // array of IDs

    status: {
      type: String,
      enum: ["not started", "in-progress", "completed", "on hold", "cancelled","continue"],
      default: "not started",
    },
files: [{ type: String }],

    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    progress: { type: Number, default: 0 },

    tasks: [taskSchema], // nested tasks

    notes: { type: String },
  },
  { timestamps: true }
);

// 🔹 Auto-populate employees + tasks.assignedTo
function autoPopulate(next) {
  this.populate("employees", "firstName lastName email profileImage").populate("lead", "firstName lastName email profileImage")
      .populate({
        path: "tasks.assignedTo",
        select: "firstName lastName email designation"
      });
  next();
}

// 🔹 Virtual: auto progress calculation
projectSchema.virtual("calculatedProgress").get(function () {
  if (!this.startDate || !this.deadline) return 0;

  const today = new Date();
  const totalDays = Math.max(
    1,
    Math.ceil((this.deadline - this.startDate) / (1000 * 60 * 60 * 24))
  );
  const passedDays = Math.max(
    0,
    Math.ceil((today - this.startDate) / (1000 * 60 * 60 * 24))
  );

  const autoProgress = Math.min(100, Math.round((passedDays / totalDays) * 100));

  // ✅ Agar manual progress set hai aur > 0 hai, use karo warna autoProgress
  return this.progress > 0 ? this.progress : autoProgress;
});

projectSchema.set("toJSON", { virtuals: true });
projectSchema.set("toObject", { virtuals: true });

["find", "findOne", "findById"].forEach(hook => projectSchema.pre(hook, autoPopulate));

export default model("Project", projectSchema);

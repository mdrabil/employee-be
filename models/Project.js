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
    enum: ["pending", "in progress", "completed"],
    default: "pending",
  },
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
      enum: ["not started", "in progress", "completed", "on hold", "cancelled"],
      default: "not started",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },

    tasks: [taskSchema], // nested tasks

    notes: { type: String },
  },
  { timestamps: true }
);

// 🔹 Auto-populate employees + tasks.assignedTo
function autoPopulate(next) {
  this.populate("employees", "firstName lastName email profileImage")
      .populate({
        path: "tasks.assignedTo",
        select: "firstName lastName email designation"
      });
  next();
}

["find", "findOne", "findById"].forEach(hook => projectSchema.pre(hook, autoPopulate));

export default model("Project", projectSchema);

import mongoose from "mongoose";

const { Schema, model } = mongoose;

const employeeOnlineSchema = new Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  isOnline: { type: Boolean, default: false },
  lastLogin: { type: Date },
  lastLogout: { type: Date },
  sessions: [
    {
      loginTime: { type: Date },
      logoutTime: { type: Date },
      durationMinutes: { type: Number, default: 0 }, // optional: calculate session duration
    }
  ]
}, { timestamps: true });

// Auto populate employee info
function autoPopulate(next) {
  this.populate({
    path: "employee",
    select: "firstName lastName email role department"
  });
  next();
}

["find", "findOne", "findById"].forEach(hook => employeeOnlineSchema.pre(hook, autoPopulate));

export default model("EmployeeOnline", employeeOnlineSchema);

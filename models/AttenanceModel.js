// import mongoose from "mongoose";

// const { Schema, model } = mongoose;

// const attendanceSchema = new Schema(
//   {
//     // employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
//     employee: { type: String, required: true },
//     date: { type: Date, required: true },
//     dutyStart: { type: String, default: "09:15" },
//     dutyEnd: { type: String, default: "18:30" },
//     checkIn: { type: Date },
//     checkOut: { type: Date },
//     totalHours: { type: Number, default: 0 },
//     extraHours: { type: Number, default: 0 },
//     lateByMinutes: { type: Number, default: 0 },
//     status: { type: String, enum: ["present", "half-day", "absent"], default: "present" },
//   },
//   { timestamps: true }
// );

// // 🔹 Auto populate employee details (role, department, customPermissions)
// function autoPopulateEmployee(next) {
//   this.populate({
//     path: "employee",
//     select: "firstName lastName email role customPermissions department",
//     populate: [
//       {
//         path: "role",
//         populate: { path: "permissions.module", model: "Module", select: "name" }
//       },
//       {
//         path: "customPermissions",
//         populate: { path: "permissions.module", model: "Module", select: "name" }
//       },
//       {
//         path: "department",
//         select: "name description"
//       }
//     ]
//   });
//   next();
// }

// // 🔹 Apply hooks
// ["find", "findOne", "findById"].forEach(hook => attendanceSchema.pre(hook, autoPopulateEmployee));

// export default model("Attendance", attendanceSchema);




import mongoose from "mongoose";

// import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, index: true },
  employeeID: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  checkIn: Date,
  checkOut: Date,
  breaks: [{ start: Date, end: Date }],
  totalHours: { type: Number, default: 0 },         // in hours decimal
  totalBreakMinutes: { type: Number, default: 0 },  // in minutes
  attendanceStatus: { type: String, default: "Present" }, // Present / Half Day
  extraHours: { type: Number, default: 0 },         // in hours decimal
  currentStatus: { type: String, default: "Not Started" } // Working / On Break / Completed
}, { timestamps: true });


// 🔹 Helper to format hours
function formatHours(hoursDecimal) {
  const h = Math.floor(hoursDecimal);
  const m = Math.round((hoursDecimal - h) * 60);
  return `${h}h ${m}min`;
}

// 🔹 Virtual fields (not stored in DB, but appear in JSON)
attendanceSchema.virtual("totalHoursFormatted").get(function () {
  return formatHours(this.totalHours || 0);
});

attendanceSchema.virtual("totalBreakFormatted").get(function () {
  return formatHours((this.totalBreakMinutes || 0) / 60);
});

attendanceSchema.virtual("extraHoursFormatted").get(function () {
  return formatHours(this.extraHours || 0);
});

// ensure virtuals show up in JSON
attendanceSchema.set("toJSON", { virtuals: true });
attendanceSchema.set("toObject", { virtuals: true });

export default mongoose.model("Attendance", attendanceSchema);


// export default mongoose.model("Attendance", attendanceSchema);


// export default mongoose.model("Attendance", attendanceSchema);

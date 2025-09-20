






// import mongoose from "mongoose";
// import { formatDateTime, formatHours } from "../utils/TimeMinHelper.js";

// const attendanceSchema = new mongoose.Schema({
//   employeeId: { type: String, required: true, index: true },
//   employeeID: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
//   checkIn: Date,
//   checkOut: Date,
//   breaks: [{ start: Date, end: Date }],
//   totalHours: { type: Number, default: 0 },         // stored in hours (decimal)
//   totalBreakTime: { type: Number, default: 0 },  // stored in minutes
//   attendanceStatus: { type: String, default: "Present" },
//   extraHours: { type: Number, default: 0 },
//   currentStatus: { type: String, default: "Not Started" }
// }, { timestamps: true });


// // Virtuals
// attendanceSchema.virtual("totalHoursFormatted").get(function () {
//   return formatHours(this.totalHours || 0);   // decimal hours → h min
// });

// attendanceSchema.virtual("totalBreakFormatted").get(function () {
//   return formatHours(this.totalBreakTime || 0); // minutes → hours → h min
// });

// attendanceSchema.virtual("extraHoursFormatted").get(function () {
//   return formatHours(this.extraHours || 0);
// });

// attendanceSchema.virtual("checkInFormatted").get(function () {
//   return formatDateTime(this.checkIn);
// });

// attendanceSchema.virtual("checkOutFormatted").get(function () {
//   return formatDateTime(this.checkOut);
// });

// // enable JSON virtuals
// attendanceSchema.set("toJSON", { virtuals: true });
// attendanceSchema.set("toObject", { virtuals: true });

// export default mongoose.model("Attendance", attendanceSchema);


// import mongoose from "mongoose";
// import { calculateSessionsDuration, formatDateTime, formatHours } from "../utils/TimeMinHelper.js";

// const attendanceSchema = new mongoose.Schema({
//   employeeId: { type: String, required: true, index: true },
//   employeeID: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
//   checkIn: Date,
//   checkOut: Date,
//   breaks: [{ start: Date, end: Date }],
//   lateBy: { type: String, default: "0h 0min" }, 
//   totalHours: { type: Number, default: 0 },
//   totalBreakTime: { type: Number, default: 0 },
//   attendanceStatus: { type: String, default: "Present" },
//   extraHours: { type: Number, default: 0 },
//   currentStatus: { type: String, default: "Not Started" }
// }, { timestamps: true });


// // 🔹 Virtuals
// attendanceSchema.virtual("totalHoursFormatted").get(function () {
//   return formatHours(this.totalHours || 0);   // decimal hours → h min
// });

// attendanceSchema.virtual("totalBreakFormatted").get(function () {
//   return calculateSessionsDuration(this.breaks || []); // minutes → h min
// });

// attendanceSchema.virtual("extraHoursFormatted").get(function () {
//   return formatHours(this.extraHours || 0);
// });

// attendanceSchema.virtual("checkInFormatted").get(function () {
//   return formatDateTime(this.checkIn);
// });

// attendanceSchema.virtual("checkOutFormatted").get(function () {
//   return formatDateTime(this.checkOut);
// });


// // 🔹 Pre-save hook → calculate total break time
// attendanceSchema.pre("save", function (next) {
//   if (this.breaks && this.breaks.length > 0) {
//     let totalMinutes = 0;

//     this.breaks.forEach(b => {
//       if (b.start && b.end) {
//         const diff = (new Date(b.end) - new Date(b.start)) / (1000 * 60); // minutes
//         totalMinutes += diff;
//       }
//     });

//     this.totalBreakTime = Math.round(totalMinutes); // store in minutes
//   }
//   next();
// });

// attendanceSchema.statics.autoPunchOutToday = async function () {
//   try {
//     const todayStart = new Date();
//     todayStart.setHours(0, 0, 0, 0);

//     const pendingAttendances = await this.find({
//       checkIn: { $gte: todayStart },
//       checkOut: null,
//     });

//     for (let attendance of pendingAttendances) {
//       // Auto punch-out time 6:30 PM
//       const autoCheckOut = new Date();
//       autoCheckOut.setHours(18, 30, 0, 0); // 6:30 PM

//       // Work Minutes
//       const workMinutes = (autoCheckOut - attendance.checkIn) / (1000 * 60);

//       // Break Minutes
//       let breakMinutes = 0;
//       attendance.breaks.forEach(b => {
//         if (b.start && b.end) breakMinutes += (b.end - b.start) / (1000 * 60);
//       });

//       const netMinutes = workMinutes - breakMinutes;
//       const netHours = netMinutes / 60;

//       attendance.checkOut = autoCheckOut;
//       attendance.currentStatus = "Completed";
//       attendance.totalHours = parseFloat(netHours.toFixed(2));
//       attendance.totalBreakTime = Math.round(breakMinutes);

//       const requiredMinutes = 8 * 60;
//       let extraMinutes = 0;
//       if (netMinutes > requiredMinutes) extraMinutes = netMinutes - requiredMinutes;
//       attendance.extraHours = parseFloat((extraMinutes / 60).toFixed(2));

//       await attendance.save();
//     }

//     console.log("Auto punch-out applied for today");
//   } catch (err) {
//     console.error("Error in auto punch-out:", err.message);
//   }
// };



// // enable JSON virtuals
// attendanceSchema.set("toJSON", { virtuals: true });
// attendanceSchema.set("toObject", { virtuals: true });

// export default mongoose.model("Attendance", attendanceSchema);



import mongoose from "mongoose";
import { calculateSessionsDuration, formatDateTime, formatHours } from "../utils/TimeMinHelper.js";

const attendanceSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, index: true },
  employeeID: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  checkIn: Date,
  checkOut: Date,
  breaks: [{ start: Date, end: Date }],
  lateBy: { type: String, default: "0h 0min" }, 
  totalHours: { type: Number, default: 0 },
  totalBreakTime: { type: Number, default: 0 },
  attendanceStatus: { type: String, default: "Present" },
  extraHours: { type: Number, default: 0 },
  currentStatus: { type: String, default: "Not Started" }
}, { timestamps: true });

attendanceSchema.virtual("totalHoursFormatted").get(function () {
  return formatHours(this.totalHours || 0);
});

attendanceSchema.virtual("totalBreakFormatted").get(function () {
  return calculateSessionsDuration(this.breaks || []);
});

attendanceSchema.virtual("extraHoursFormatted").get(function () {
  return formatHours(this.extraHours || 0);
});

attendanceSchema.virtual("checkInFormatted").get(function () {
  return formatDateTime(this.checkIn);
});

attendanceSchema.virtual("checkOutFormatted").get(function () {
  return formatDateTime(this.checkOut);
});

// Pre-save hook
attendanceSchema.pre("save", function (next) {
  if (this.breaks && this.breaks.length > 0) {
    let totalMinutes = 0;
    this.breaks.forEach(b => {
      if (b.start && b.end) {
        const diff = (new Date(b.end) - new Date(b.start)) / (1000 * 60);
        totalMinutes += diff;
      }
    });
    this.totalBreakTime = Math.round(totalMinutes);
  }
  next();
});

// Static function
attendanceSchema.statics.autoPunchOutToday = async function () {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const pendingAttendances = await this.find({
      checkIn: { $gte: todayStart },
      checkOut: null,
    });

    for (let attendance of pendingAttendances) {
      const autoCheckOut = new Date();
      autoCheckOut.setHours(18, 30, 0, 0); // 6:30 PM

      const workMinutes = (autoCheckOut - attendance.checkIn) / (1000 * 60);

      let breakMinutes = 0;
      attendance.breaks.forEach(b => {
        if (b.start && b.end) breakMinutes += (b.end - b.start) / (1000 * 60);
      });

      const netMinutes = workMinutes - breakMinutes;
      const netHours = netMinutes / 60;

      attendance.checkOut = autoCheckOut;
      attendance.currentStatus = "Completed";
      attendance.totalHours = parseFloat(netHours.toFixed(2));
      attendance.totalBreakTime = Math.round(breakMinutes);

      const requiredMinutes = 8 * 60;
      let extraMinutes = 0;
      if (netMinutes > requiredMinutes) extraMinutes = netMinutes - requiredMinutes;
      attendance.extraHours = parseFloat((extraMinutes / 60).toFixed(2));

      await attendance.save();
    }

    console.log("✅ Auto punch-out applied for today");
  } catch (err) {
    console.error("❌ Error in auto punch-out:", err.message);
  }
};

export default mongoose.model("Attendance", attendanceSchema);

import Attendance from "../models/AttenanceModel.js";

export const processPunchOut = async (attendance, checkOutTime = new Date()) => {
  attendance.checkOut = checkOutTime;
  attendance.currentStatus = "Completed";

  // Work Minutes
  const workMinutes = (attendance.checkOut - attendance.checkIn) / (1000 * 60);

  // Break Minutes
  let breakMinutes = 0;
  attendance.breaks.forEach((b) => {
    if (b.start && b.end) breakMinutes += (b.end - b.start) / (1000 * 60);
  });

  const netMinutes = workMinutes - breakMinutes;
  const netHours = netMinutes / 60;

  attendance.totalHours = parseFloat(netHours.toFixed(2));
  attendance.totalBreakTime = Math.round(breakMinutes);

  // Extra Hours (after 8h)
  const requiredMinutes = 8 * 60;
  let extraMinutes = 0;
  if (netMinutes > requiredMinutes) extraMinutes = netMinutes - requiredMinutes;
  attendance.extraHours = parseFloat((extraMinutes / 60).toFixed(2));

  await attendance.save();
  return attendance;
};

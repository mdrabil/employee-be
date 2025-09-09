// utils/formatHelper.js

// ⏰ Hours ko "5h 50min" jaisa format karega
export function formatHours(hoursDecimal) {
  if (!hoursDecimal || isNaN(hoursDecimal)) return "0h 0min";

  const totalMinutes = Math.round(hoursDecimal * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;

  return `${h}h ${m}min`;
}

// 📅 Sirf Date (dd-mm-yyyy)
export function formatDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB");
}

// 📅⏰ Date + Time (dd-mm-yyyy hh:mm)
export function formatDateTime(date) {
  if (!date) return "";
  return new Date(date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}


export function formatTime(date) {
  if (!date) return null;
  return new Date(date).toLocaleString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// 📏 Do dates ke beech ka difference in hours & minutes
export function diffHours(startDate, endDate) {
  if (!startDate || !endDate) return "0h 0min";

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Difference in milliseconds
  let diffMs = end - start;
  if (diffMs < 0) diffMs = 0; // agar end < start to 0 return kare

  const totalMinutes = Math.round(diffMs / (1000 * 60));
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;

  return `${h}h ${m}min`;
}


// 🔹 Format hours + minutes (e.g. 7h 4m)
export const formatDuration = (ms) => {
  if (!ms || ms <= 0) return "0m";

  const totalMinutes = Math.floor(ms / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}min`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}min`;
};

// 🔹 Helper: Calculate total duration from array of sessions
export const calculateSessionsDuration = (sessions = []) => {
  if (!Array.isArray(sessions)) return "0m";

  let totalMs = 0;

  sessions.forEach((s) => {
    if (s.start && s.end) {
      const diff = new Date(s.end) - new Date(s.start);
      if (diff > 0) totalMs += diff;
    }
  });

  return formatDuration(totalMs);
};

import EmployeeModel from "../models/EmployeeModel.js";

export const generateEmployeeId = async (name) => {
  if (!name) throw new Error("Name is required for Employee ID");

  const count = await EmployeeModel.countDocuments();
  const nextNumber = String(count + 1).padStart(3, "0");

  // Remove spaces and capitalize properly
  const cleanName = name
    .trim()
    .split(/\s+/)                 // split by spaces
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");                    // join without spaces

  return `${cleanName}-Emp-${nextNumber}`;
};

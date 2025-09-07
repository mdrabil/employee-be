// src/controllers/adminController.js


import bcrypt from "bcryptjs";
import { generateEmployeeId } from "../utils/generateEmployeeId.js";

// 🔹 Create Employee
import mongoose from "mongoose";
import EmployeeModel from "../models/EmployeeModel.js";
import Role from "../models/Role.js";
import Department from "../models/Department.js";
import Project from "../models/Project.js";


export const createEmployee = async (req, res) => {
  try {
    const { firstName, email, role, department } = req.body;
    const salary = req.body.salary ? JSON.parse(req.body?.salary) : null;
const bankDetails = req.body?.bankDetails ? JSON?.parse(req.body?.bankDetails) : {};
const emergencyContact = req.body?.emergencyContact ? JSON?.parse(req.body?.emergencyContact) : {};

const empId = await generateEmployeeId(firstName);

    const password = "rabil"; // default password
console.log('file aya ya nhi',empId)
    // ✅ Required field check
    if (!firstName || !email || !password || !salary) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // ✅ Email already exist check
    const existingEmp = await EmployeeModel.findOne({ email });
    if (existingEmp) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // ✅ Role ID check
    if (!mongoose.Types.ObjectId.isValid(role)) {
      return res.status(400).json({ message: "Invalid Role ID" });
    }
    const roleExist = await Role.findById(role);
    if (!roleExist) {
      return res.status(400).json({ message: "Role not found" });
    }

    // ✅ Department ID check
    if (!mongoose.Types.ObjectId.isValid(department)) {
      return res.status(400).json({ message: "Invalid Department ID" });
    }
    const deptExist = await Department.findById(department);
    if (!deptExist || !req.file) {
      return res.status(400).json({ message: "Department not found" });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    
       // 🔹 Image path set karo
    let profileImage = null;
    if (req.file) {
      profileImage = req.file.path.replace(/\\/g, "/");// uploads/employees/filename.jpg
    }

    // ✅ Create Employee
  const joiningDate =  new Date();

const employee = await EmployeeModel.create({
  ...req.body,
  employeeId: empId,
  password: hashedPassword,
  profileImage,
  salary,
  bankDetails,
  emergencyContact,
  joiningDate,
});

    res.status(201).json({ message: "Employee created", employee });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// 🔹 Get All Employees
// export const getEmployees = async (req, res) => {
//   try {
//     const employees = await Employee.find();

//         if (!employees || employees?.length === 0) {
//       return res.status(200).json({
//         success: false,
//         message: "No employees found",
//         module: []
//       });
//     }

//     res.json({ success: true, data: employees });
 
//     // res.json(employees);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
// export const getEmployees = async (req, res) => {
//   try {
//     // role ko populate karo
//     const employees = await Employee.find().populate("role");

//     // filter karo jinka role.name 'admin' na ho
//     const filteredEmployees = employees.filter(emp => emp.role?.name !== "admin");
// // console.log('employee data',employees)
//     if (filteredEmployees.length === 0) {
//       return res.status(200).json({
//         success: false,
//         message: "No employees found",
//         module: []
//       });
//     }

//     res.json({ success: true, data: filteredEmployees });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };




export const getEmployees = async (req, res) => {
  try {
    // Role populate karo
    const employees = await EmployeeModel.find().populate("role");

    // Filter jinka role.name 'admin' na ho
    const filteredEmployees = employees.filter(emp => emp.role?.name !== "admin");

    if (filteredEmployees.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No employees found",
        module: []
      });
    }

    const employeesWithStats = await Promise.all(
      filteredEmployees.map(async (emp) => {
        // Projects jisme employee array ya lead array me employee._id hai
        const projects = await Project.find({
          $or: [
            { employees: emp._id },
            { lead: emp._id }
          ]
        });

        const totalProjects = projects.length;
        const completedProjects = projects.filter(p => p.status === "completed").length;

        const productivity = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

        return {
          ...emp.toObject(),
          totalProjects,
          completedProjects,
          productivity
        };
      })
    );

    res.json({ success: true, data: employeesWithStats });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




// 🔹 Get Single Employee
export const getEmployee = async (req, res) => {
  try {
    const employee = await EmployeeModel.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

        res.json({ success: true, data: employee });
    // res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getEmployeeDetails = async (req, res) => {
  const employeeID = req?.params?.employeeID
  try {
    const employee = await EmployeeModel.findOne({employeeId:employeeID});
    if (!employee) return res.status(404).json({ message: "Employee not found" });

        res.json({ success: true, data: employee });
    // res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Update Employee
export const updateEmployee = async (req, res) => {
  try {
    const data = { ...req.body };

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const updated = await EmployeeModel.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json({ message: "Employee updated", updated });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 🔹 Delete Employee
export const deleteEmployee = async (req, res) => {
  try {
    await EmployeeModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

import mongoose from "mongoose";

import Project from "../models/Project.js";
import EmployeeModel from "../models/EmployeeModel.js";

// Create Project
// export const createProject = async (req, res) => {
//   try {
//     const { name, client, startDate, deadline, employees, status, priority, tasks, notes } = req.body;


//     console.log('name',name)
//     // ✅ Validation
//     if (!name || !client?.name || !deadline) {
//       return res.status(400).json({ success: false, message: "Project name, client name, and deadline are required" });
//     }

//     // Check if project already exists
//     const existing = await Project.findOne({ name });
//     if (existing) {
//       return res.status(400).json({ success: false, message: "Project with this name already exists" });
//     }

//     // Optional: check employees exist
//     if (employees && employees.length > 0) {
//       const validEmployees = await Employee.find({ _id: { $in: employees } });
//       if (validEmployees.length !== employees.length) {
//         return res.status(400).json({ success: false, message: "One or more employees are invalid" });
//       }
//     }

//     const project = new Project({ name, client, startDate, deadline, employees, status, priority, tasks, notes });
//     await project.save();
//     res.status(201).json({ success: true, data: project });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// Create Project
export const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      client,
      startDate,
      deadline,
      priority,
      employees, // array of _id
      lead,      // array of _id
    } = req.body;


  const existingProject = await Project.findOne({ name: title });
    if (existingProject) {
      return res.status(400).json({
        success: false,
        message: `Project with title "${title}" already exists`,
      });
    }
 // 🔹 Combine IDs
    const allEmployeeIds = [...employees, ...lead].map(id => new mongoose.Types.ObjectId(id));

    // 🔹 Get valid employees from DB
    const validEmployees = await EmployeeModel.find({ _id: { $in: allEmployeeIds } }).select("_id");
    const validIds = validEmployees.map(emp => emp._id.toString());

    // 🔹 Check if all IDs exist
    const isAllExist = allEmployeeIds.every(id => validIds.includes(id.toString()));

    if (!isAllExist) {
      return res.status(400).json({
        success: false,
        message: "Some employee IDs are invalid",
      });
    }

    // 🔹 Check dates
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(deadline);

    // if (start < now.setHours(0, 0, 0, 0)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Start date cannot be in the past",
    //   });
    // }

    if (end < start) {
      return res.status(400).json({
        success: false,
        message: "Deadline cannot be before start date",
      });
    }

    const project = new Project({
      name: title,
      description,
      client,
      startDate: start,
      deadline: end,
      priority,
      employees, // store _id array directly
      lead,      // store _id array directly
    });

    await project.save();
    res.status(201).json({ success: true, project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get All Projects
export const getProjects = async (req, res) => {
  try {
    let projects;

    if (req.user.role?.name === "admin") {
      // ✅ Admin => sabhi projects
      projects = await Project.find();
    } else {
      // ✅ Non-admin => sirf jisme lead array me userId ho
      projects = await Project.find({ lead: req.user.id });
    }

    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProjectsByEmployeeId = async (req, res) => {
    const employeeId = req?.params?.id; // yeh string type hai (custom employeeId)

  try {
    // 🔹 Step 1: Employee model me check karo
    const employee = await EmployeeModel.findOne({ employeeId }); // <-- yaha tumhara custom field

    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }
    // 🔹 Step 2: Ab _id se project find karo
    const projects = await Project.find({
      $or: [
        { lead: employee._id },
        { employees: employee._id }
      ]
    });

    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// Get Single Project
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Project
// export const updateProject = async (req, res) => {
//   try {
//     const project = await Project.findById(req.params.id);
//     if (!project)
//       return res.status(404).json({ success: false, message: "Project not found" });

//     // 🔹 Authorization check
//     const userId = req.user.id; // assume req.user is populated
//     const userRole = req.user.role?.name;

//     if (userRole !== "admin" && !project.lead?.includes(userId)) {
//       return res.status(403).json({ success: false, message: "You are not authorized to update this project" });
//     }

//     const { name, client, startDate, deadline, employees, status, priority, tasks, description, progress } = req.body;

//     // ✅ Validation
//     if (name) {
//       const existing = await Project.findOne({ name, _id: { $ne: req.params.id } });
//       if (existing) return res.status(400).json({ success: false, message: "Project name already exists" });
//       project.name = name;
//     }

//     if (client) project.client = client;
//     if (startDate) project.startDate = startDate;
//     if (deadline) project.deadline = deadline;
//     if (employees) project.employees = employees;
//     if (status) project.status = status;
//     if (priority) project.priority = priority;
//     if (tasks) project.tasks = tasks;
//     if (description) project.description = description;
//     if (progress) project.progress = progress;

//     await project.save();
//     res.json({ success: true, data: project });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });

    // 🔹 Authorization check
    const userId = req.user.id; // assume req.user is populated
    const userRole = req.user.role?.name;
    console.log('project',project)
    console.log('userid',userId)
if (
  userRole !== "admin" &&
  !project.lead?.some((lead) => lead._id.toString() === userId.toString())
) {
  return res.status(403).json({
    success: false,
    message: "You are not authorized to update this project",
  });
}

    const {
      name,
      client,
      startDate,
      deadline,
      employees,
      status,
      priority,
      tasks,
      description,
      progress,
    } = req.body;

    // ✅ Validation for name
    if (name) {
      const existing = await Project.findOne({
        name,
        _id: { $ne: req.params.id },
      });
      if (existing)
        return res
          .status(400)
          .json({ success: false, message: "Project name already exists" });
      project.name = name;
    }

    if (client) project.client = client;
    if (startDate) project.startDate = startDate;
    if (deadline) project.deadline = deadline;
    if (employees) project.employees = employees;
    // if (status) project.status = status;
if (status) {
  if (status === "completed") {
    project.status = "completed";
    project.progress = 100;
  } else {
    // agar pehle se 100 tha aur status change ho gaya
    if (project.progress === 100) {
      project.progress = 99;
    }
    project.status = status;
  }
}
    if (priority) project.priority = priority;
    if (tasks) project.tasks = tasks;
    if (description) project.description = description;

if (progress !== undefined) {
  project.progress = progress;

  if (progress === 100) {
    project.status = "completed";
  }
}
      // 🔹 Auto complete condition


    await project.save();
    res.json({ success: true, data: project });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: error.message });
  }
};



// Delete Project
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    res.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

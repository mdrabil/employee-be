




import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { MODULES } from "../config/module.js";
import Role from "../models/Role.js";
import Module from "../models/Module.js";
import EmployeeModel from "../models/EmployeeModel.js";

// Create Role (Only Admin)
export const createRole = async (req, res) => {
  try {
    const { name, permissions, status = true } = req.body;

    // 🔹 Validate modules & convert to ObjectId
    const validPermissions = await Promise.all(
      permissions.map(async (perm) => {
        const moduleDoc = await Module.findById(perm.module) || await Module.findOne({ name: perm.module });
        if (!moduleDoc) throw new Error(`Invalid module: ${perm.module}`);

        return {
          module: moduleDoc._id,
          canCreate: !!perm.canCreate,
          canRead: !!perm.canRead,
          canUpdate: !!perm.canUpdate,
          canDelete: !!perm.canDelete,
        };
      })
    );

    const newRole = new Role({
      name,
      status,
      permissions: validPermissions,
    });

    await newRole.save();
    res.status(201).json({ message: "Role created successfully", role: newRole });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};






// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password)
//       return res.status(400).json({ message: "Email and password are required" });

//     // 🔹 Find user (password stored as plain text in DB)
//     // const user = await Employee.findOne({ email }).populate("role");
//     const user = await Employee.findOne({ email })
//   .select("+password")
//   .populate("role"); // populate role document

//     if (!user) return res.status(401).json({ message: "Invalid credentials" });


//     // 🔹 Compare using bcrypt
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

//     // 🔹 Generate JWT
//     const token = jwt.sign(
//       { id: user._id, role: user.role?.name },
//       process.env.JWT_SECRET,
//       { expiresIn: process.env.JWT_EXPIRES_IN }
//     );

//     res.json({
//       message: "Login successful",
//       token,
//       user: {
//         id: user._id,
//         name: user.firstName + " " + (user.lastName || ""),
//         email: user.email,
//         role: user.role?.name || "N/A",
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('email,',email)
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const user = await EmployeeModel.findOne({ email })

      // .populate({
      //   path: "role",
      //   populate: { path: "permissions.module", model: "Module", select: "name" },
      // })
      // .populate({
      //   path: "customPermissions",
      //   populate: { path: "permissions.module", model: "Module", select: "name" },
      // });

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id,employeeId:user?.employeeId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.firstName + " " + (user.lastName || ""),
        email: user.email,
        employeeId: user.employeeId,
        role: user.role?.name,
        permissions: user.role?.permissions || [],
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const createAdmin = async () => {
  try {
    // 1. Check Role
    let adminRole = await Role.findOne({ name: "admin" });
    if (!adminRole) {
      adminRole = await Role.create({
        name: "admin",
        permissions: []   // abhi empty, baad me bhar sakte ho
      });
      console.log("✅ Admin Role created");
    }

    // 2. Check Admin Employee
    let admin = await EmployeeModel.findOne({ email: process.env.ADMIN_EMAIL });
    if (!admin) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

      admin = await EmployeeModel.create({
        employeeId: "ADMIN-001",
        firstName: process.env.ADMIN_NAME || "Super",
        lastName: "",
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        role: adminRole._id, // ✅ ObjectId assign
        status: true,
        salary: {
          base: 0, hra: 0, bonus: 0, deductions: 0, currency: "INR"
        },
      });
      

      console.log("🚀 Super Admin created successfully:", admin.email);
    } else {
      console.log("ℹ️ Super Admin already exists:", admin.email);
    }
  } catch (err) {
    console.error("❌ Error creating Super Admin:", err.message);
  }
};



// export const createRole = async (req, res) => {
//   try {
//     const { name, permissions } = req.body; // [{module, create, read, update, delete}]
//     const createdPermissions = await Permission.insertMany(permissions);
//     const role = await Role.create({ name, permissions: createdPermissions.map(p => p._id) });
//     res.json({ success: true, role });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// Assign role to employee
export const assignRole = async (req, res) => {
  try {
    const { employeeId, roleId } = req.body;
    const employee = await Employee.findByIdAndUpdate(employeeId, { role: roleId }, { new: true });
    res.json({ success: true, employee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Give custom permission to employee
export const assignCustomPermission = async (req, res) => {
  try {
    const { employeeId, permissions } = req.body; // array of module permissions
    const createdPermissions = await Permission.insertMany(permissions);
    const employee = await Employee.findByIdAndUpdate(
      employeeId,
      { $push: { customPermissions: { $each: createdPermissions.map(p => p._id) } } },
      { new: true }
    );
    res.json({ success: true, employee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};






// 🔹 Get All Roles
export const getRoles = async (req, res) => {
  try {
      const roles = await Role.find({ name: { $ne: "admin" } });

       if (!roles || roles?.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No Roles found",
        module: []
      });
    }
// console.log('all roles',roles)
        res.json({ success: true, data: roles });
    // res.status(200).json(roles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// 🔹 Get Role by ID
export const getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });
   res.json({ success: true, data: role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Update Role
export const updateRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.status(200).json(role);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 🔹 Delete Role
export const deleteRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.status(200).json({ message: "Role deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
import Department from "../models/Department.js";

// 🔹 Create Department
export const createDepartment = async (req, res) => {
  try {
    const { name, description, status } = req.body;

    // Validation
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ success: false, message: "Invalid or missing department name" });
    }
    // if (status) {
    //   return res.status(400).json({ success: false, message: "Status must be active or inactive" });
    // }

    // Duplicate check
    const existing = await Department.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: "Department already exists" });
    }

    const department = new Department({
      name: name.trim(),
      description: description?.trim(),
      status: status || false
    });

    await department.save();
    res.status(201).json({ success: true, data: department });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 Get All Departments
export const getDepartments = async (req, res) => {
  try {

    
    const departments = await Department.find();

       if (!departments || departments?.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No Department found",
        departments: []
      });
    }
    // console.log('depatmet',departments)
    res.json({ success: true, data: departments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 Get Single Department
export const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }
    res.json({ success: true, data: department });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 Update Department
export const updateDepartment = async (req, res) => {
  try {
    const { name, description, status } = req.body;

    // Validation
    if (name && name.trim().length < 2) {
      return res.status(400).json({ success: false, message: "Invalid department name" });
    }
 

    // Duplicate check
    if (name) {
      const existing = await Department.findOne({ name: name.trim(), _id: { $ne: req.params.id } });
      if (existing) {
        return res.status(400).json({ success: false, message: "Department name already exists" });
      }
    }

    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { name: name?.trim(), description, status },
      { new: true, runValidators: true }
    );

    if (!department) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }

    res.json({ success: true, data: department });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 Delete Department
export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }
    res.json({ success: true, message: "Department deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

import Module from "../models/Module.js";

// 🔹 Create Module
export const createModule = async (req, res) => {
  try {
    const { name, description, status } = req.body;

    // Validation
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ success: false, message: "Invalid or missing Module name" });
    }
    if (status && !["active", "inactive"].includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be active or inactive" });
    }

    // Duplicate check
    const existing = await Module.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: "Module already exists" });
    }

    const Module = new Module({
      name: name.trim(),
      description: description?.trim(),
      status: status || "active"
    });

    await Module.save();
    res.status(201).json({ success: true, data: Module });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 Get All Modules
export const getModules = async (req, res) => {
  try {
    const modules = await Module.find();

    if (!modules || modules.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No modules found",
        module: []
      });
    }

    res.json({ success: true, module: modules });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// 🔹 Get Single Module
export const getModuleById = async (req, res) => {
  try {
    const Module = await Module.findById(req.params.id);
    if (!Module) {
      return res.status(404).json({ success: false, message: "Module not found" });
    }
    res.json({ success: true, data: Module });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 Update Module
export const updateModule = async (req, res) => {
  try {
    const { name, description, status } = req.body;

    // Validation
    if (name && name.trim().length < 2) {
      return res.status(400).json({ success: false, message: "Invalid Module name" });
    }
    if (status && !["active", "inactive"].includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be active or inactive" });
    }

    // Duplicate check
    if (name) {
      const existing = await Module.findOne({ name: name.trim(), _id: { $ne: req.params.id } });
      if (existing) {
        return res.status(400).json({ success: false, message: "Module name already exists" });
      }
    }

    const Module = await Module.findByIdAndUpdate(
      req.params.id,
      { name: name?.trim(), description, status },
      { new: true, runValidators: true }
    );

    if (!Module) {
      return res.status(404).json({ success: false, message: "Module not found" });
    }

    res.json({ success: true, data: Module });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 Delete Module
export const deleteModule = async (req, res) => {
  try {
    const Module = await Module.findByIdAndDelete(req.params.id);
    if (!Module) {
      return res.status(404).json({ success: false, message: "Module not found" });
    }
    res.json({ success: true, message: "Module deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

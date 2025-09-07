import { MODULES } from "../config/module.js";
import Module from "../models/Module.js";

export const ensureModules = async () => {
  try {
    for (const moduleName of MODULES) {
      const exists = await Module.findOne({ name: moduleName });
      if (!exists) {
        await Module.create({ name: moduleName });
        console.log(`✅ Module created: ${moduleName}`);
      }
    }
    console.log("🚀 All modules ensured!");
  } catch (err) {
    console.error("❌ Error ensuring modules:", err.message);
  }
};
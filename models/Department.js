import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
     status: {             // Active / Inactive
      type: Boolean,
   
      default:true
    },
});

export default mongoose.model("Department", departmentSchema);

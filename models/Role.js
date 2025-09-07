// import mongoose from 'mongoose';
// const { Schema, model, Types } = mongoose;


// const roleSchema = new Schema(
// {
// name: { type: String, required: true, unique: true, trim: true, lowercase: true },
// permissions: [{ type: Types.ObjectId, ref: 'Permission' }],
// isSystem: { type: Boolean, default: false }
// },
// { timestamps: true }
// );


// export default model('Role', roleSchema);


// src/models/Role.js




import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  permissions: [
    {
      module: { type: mongoose.Schema.Types.ObjectId, ref: "Module" },
      canCreate: { type: Boolean, default: false },
      canRead: { type: Boolean, default: false },
      canUpdate: { type: Boolean, default: false },
      canDelete: { type: Boolean, default: false },
    },
  ],
    status: {             // Active / Inactive
      type: Boolean,
   
      default:true
    },
  },
  { timestamps: true }
)

function autoPopulate(next) {
  this.populate({
     path: "permissions.module", select: "name ,_id" 
  })
  next();
}

// 🔹 Add hooks
roleSchema.pre("find", autoPopulate);
roleSchema.pre("findOne", autoPopulate);
roleSchema.pre("findById", autoPopulate);
export default mongoose.model("Role", roleSchema);



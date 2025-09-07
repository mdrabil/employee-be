// import mongoose from 'mongoose';
// const { Schema, model } = mongoose;


// const permissionSchema = new Schema(
// {
// name: { type: String, required: true, unique: true, trim: true, lowercase: true },
// description: { type: String, trim: true }
// },
// { timestamps: true }
// );


// export default model('Permission', permissionSchema);





// src/models/Permission.js
import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
  module: { type: String, required: true }, // e.g., "employees"
  create: { type: Boolean, default: false },
  read: { type: Boolean, default: false },
  update: { type: Boolean, default: false },
  delete: { type: Boolean, default: false },
});

export default mongoose.model("Permission", permissionSchema);

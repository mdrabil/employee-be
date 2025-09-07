// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";
// import validator from "validator";
// import mongooseAutopopulate from "mongoose-autopopulate";

// const { Schema, model } = mongoose;

// const employeeSchema = new Schema(
//   {
//     employeeId: { type: String, required: true, unique: true, trim: true },

//     // 🔹 Personal Details
//     firstName: { type: String, trim: true },
//     lastName: { type: String, trim: true },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//       validate: [validator.isEmail, "Invalid email"],
//     },
//     phone: { type: String, trim: true },
//     dob: { type: Date }, // Date of Birth
//     gender: { type: String, enum: ["male", "female", "other"] },
//     profileImage: { type: String }, // Image URL

//     // 🔹 Account & Security
//     password: { type: String, required: true, },
//    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" ,
//       autopopulate: true},
//     customPermissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" ,
//       autopopulate:true}],
//     // 🔹 Job/Work Details
//     department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
//     designation: { type: String }, // e.g., Software Engineer
//     joiningDate: { type: Date, default: Date.now },
//     workLocation: { type: String }, // e.g., "Bangalore HQ"

//     // 🔹 Salary & Payroll
//     salary: {
//       base: { type: Number, }, // Basic Salary
//       hra: { type: Number, default: 0 }, // House Rent Allowance
//       bonus: { type: Number, default: 0 },
//       deductions: { type: Number, default: 0 },
//       currency: { type: String, default: "INR" },
//     },
//     bankDetails: {
//       accountHolderName: { type: String },
//       accountNumber: { type: String },
//       ifscCode: { type: String },
//       bankName: { type: String },
//       branch: { type: String },
//     },

//     // 🔹 Documents
//     documents: [
//       {
//         type: { type: String }, // e.g., Aadhar, PAN, Passport
//         number: { type: String },
//         fileUrl: { type: String }, // Uploaded file URL
//       },
//     ],

//     // 🔹 Emergency Contact
//     emergencyContact: {
//       name: { type: String },
//       relation: { type: String },
//       phone: { type: String },
//     },

//     // 🔹 Status
//     status: { type: String, enum: ["active", "inactive"], default: "active" },
//   },
//   { timestamps: true }
// );



// // 🔹 Auto-populate function
// function autoPopulate(next) {
//   this.populate({
//     path: "role",
//     populate: { path: "permissions.module", model: "Module", select: "name" }
//   }).populate({
//     path: "customPermissions.module",
//     model: "Module",
//     select: "name"
//   });
//   next();
// }

// // 🔹 Add hooks


// employeeSchema.plugin(mongooseAutopopulate);

// export default model("Employee", employeeSchema);


import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";


const { Schema, model } = mongoose;

const employeeSchema = new Schema(
  {
    employeeId: { type: String, required: true, unique: true, trim: true },

    // 🔹 Personal Details
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Invalid email"],
    },
    phone: { type: String, trim: true },
    dob: { type: Date }, // Date of Birth
    gender: { type: String, enum: ["male", "female", "other"] },
    profileImage: { type: String }, // Image URL

    // 🔹 Account & Security
    password: { type: String, required: true, },
   role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
    customPermissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
    // 🔹 Job/Work Details
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    designation: { type: String }, // e.g., Software Engineer
    joiningDate: { type: Date },
    workLocation: { type: String }, // e.g., "Bangalore HQ"

    // 🔹 Salary & Payroll
    salary: {
      base: { type: Number, }, // Basic Salary
      hra: { type: Number, default: 0 }, // House Rent Allowance
      bonus: { type: Number, default: 0 },
      deductions: { type: Number, default: 0 },
      currency: { type: String, default: "INR" },
    },
    bankDetails: {
      accountHolderName: { type: String },
      accountNumber: { type: String },
      ifscCode: { type: String },
      bankName: { type: String },
      branch: { type: String },
    },

    // 🔹 Documents
    documents: [
      {
        type: { type: String }, // e.g., Aadhar, PAN, Passport
        number: { type: String },
        fileUrl: { type: String }, // Uploaded file URL
      },
    ],

    // 🔹 Emergency Contact
    emergencyContact: {
      name: { type: String },
      relation: { type: String },
      phone: { type: String },
    },

    // 🔹 Status
    status: {             // Active / Inactive
      type: Boolean,
   
      default:true
    },
  },
  { timestamps: true }
);




function autoPopulate(next) {
  this.populate({
    path: "role",
    populate: { path: "permissions.module", model: "Module", select: "name" }
  })
  .populate({
    path: "customPermissions",
    populate: { path: "permissions.module", model: "Module", select: "name" }
  })
  .populate({
    path:'department',  // ✅ lowercase
    select: "name description"
  });
  next();
}

// 🔹 Add hooks
const hooks = ["find", "findOne", "findById"];
hooks.forEach(hook => employeeSchema.pre(hook, autoPopulate));



const EmployeeModel = mongoose.model("Employee", employeeSchema);
export default EmployeeModel;


// import jwt from 'jsonwebtoken';
// import { StatusCodes } from 'http-status-codes';
// import Employee from '../models/Employee.js';


// export const protect = async (req, res, next) => {
// try {
// const header = req.headers.authorization || '';
// const token = header.startsWith('Bearer ') ? header.split(' ')[1] : null;
// if (!token) return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: 'No token' });


// const payload = jwt.verify(token, process.env.JWT_SECRET);
// const user = await Employee.findById(payload.id).populate('role');
// if (!user) return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: 'User not found' });


// req.user = user;
// next();
// } catch (e) {
// return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: 'Invalid/Expired token' });
// }
// };




// import jwt from "jsonwebtoken";
// import { Employee } from "../models/Employee.js";

// export const protect = async (req, res, next) => {
//   let token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "Not authorized" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await Employee.findById(decoded.id).populate("role");
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };

// export const isAdmin = (req, res, next) => {
//   if (req.user?.role?.name !== "admin") {
//     return res.status(403).json({ message: "Admin only" });
//   }
//   next();
// };



import jwt from "jsonwebtoken";

import Role from "../models/Role.js";
import Module from "../models/Module.js";
import EmployeeModel from "../models/EmployeeModel.js";


export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await EmployeeModel.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });


    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};


// export const protect = async (req, res, next) => {
//   try {
//     let token;
//     if (
//       req.headers.authorization &&
//       req.headers.authorization.startsWith("Bearer")
//     ) {
//       token = req.headers.authorization.split(" ")[1];
//     }
//     if (!token) return res.status(401).json({ message: "Unauthorized" });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     // 🔹 Populate role & permissions
//  const user = await Employee.findById(decoded.id)


//     //   .populate("customPermissions"); // if customPermissions exist

//         console.log('user yaha hai 0',user)
//     if (!user) return res.status(401).json({ message: "Unauthorized" });

//     req.user = user;
//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Unauthorized" });
//   }
// };


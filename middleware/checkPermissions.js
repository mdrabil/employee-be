// src/middleware/checkPermission.js
// import Employee from "../models/Employee.js";
// import Role from "../models/Role.js";

// export const checkPermission = (module, action) => {
//   return async (req, res, next) => {
//     try {
//       const employee = await Employee.findById(req.user.id)
//         .populate({ path: "role", populate: { path: "permissions" } })
//         .populate("customPermissions");

//       let allowed = false;

//       // role-based
//       if (employee.role) {
//         allowed = employee.role.permissions.some(
//           (perm) => perm.module === module && perm[action] === true
//         );
//       }

//       // custom override
//       if (!allowed && employee.customPermissions.length > 0) {
//         allowed = employee.customPermissions.some(
//           (perm) => perm.module === module && perm[action] === true
//         );
//       }

//       if (!allowed) {
//         return res.status(403).json({ success: false, message: "Access denied" });
//       }

//       next();
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   };
// };


// done 

// export const checkPermission = (moduleName, action) => {
//   return (req, res, next) => {
//     try {
//       if (!req.user || !req.user.role) {
//         return res.status(401).json({ message: "Unauthorized" });
//       }

//       // console.log(req.user?.)
//       // 🔹 Super Admin always allowed
//       if (req.user.email === process?.env?.ADMIN_EMAIL) {
//         return next();
//       }

//       // 🔹 Check custom permissions (override role)
//       const custom = req.user.customPermissions?.find(
//         (perm) => perm.module === moduleName && perm[action] === true
//       );
//       if (custom) return next();

//       // 🔹 Check role permissions
//       const rolePerm = req.user.role.permissions?.find(
//         (perm) => perm.module === moduleName && perm[action] === true
//       );
//       if (rolePerm) return next();

//       return res.status(403).json({ message: `No ${action} permission on ${moduleName}` });
//     } catch (err) {
//       return res.status(500).json({ message: "Permission check error" });
//     }
//   };
// };



// middleware/auth.js
// done 

import Role from "../models/Role.js";

export const checkPermission =  (moduleName, action) => {
  return async (req, res, next) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      
         if (req.user.email === process?.env?.ADMIN_EMAIL) {
        return next();
      }
      const role = await Role.findById(req.user.role)
      
      const rolePerms = role?.permissions || [];
      const customPerms = req.user.customPermissions || [];
      
      // console.log('user find',rolePerms)
      // Check role permissions
      const roleModule = rolePerms.find((p) => p.module?.name === moduleName);
      if (roleModule?.[action]) return next();

      // Check custom permissions
      const customModule = customPerms.find((p) => p.module?.name === moduleName);
      if (customModule?.[action]) return next();

      return res.status(403).json({ message: "Forbidden: You don't have permission" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };
};




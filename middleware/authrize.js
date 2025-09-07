import Role from '../models/Role.js';


export const requireRole = (...roleNames) => async (req, res, next) => {
const userRole = req.user?.role;
if (!userRole) return res.status(403).json({ success: false, message: 'Role missing' });
if (roleNames.map((r) => r.toLowerCase()).includes(userRole.name)) return next();
return res.status(403).json({ success: false, message: 'Forbidden: role' });
};


export const requirePermission = (permName) => async (req, res, next) => {
const role = req.user?.role;
if (!role) return res.status(403).json({ success: false, message: 'Role missing' });
const populated = await Role.findById(role._id).populate('permissions');
if (role.name === 'admin') return next(); // Admin full access
const has = populated.permissions.some((p) => p.name === permName.toLowerCase());
return has ? next() : res.status(403).json({ success: false, message: 'Forbidden: permission' });
};
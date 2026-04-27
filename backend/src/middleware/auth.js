const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Captain = require('../models/Captain');
const Admin = require('../models/Admin');

/**
 * Verifies JWT token and attaches entity to req
 * Supports: User, Captain, Admin
 */
const protect = (allowedRoles = []) => async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let entity;
    if (decoded.role === 'admin') {
      entity = await Admin.findById(decoded.id).select('-password');
    } else if (decoded.role === 'captain') {
      entity = await Captain.findById(decoded.id);
    } else {
      entity = await User.findById(decoded.id);
    }

    if (!entity) return res.status(401).json({ success: false, message: 'Entity not found' });
    if (entity.status === 'blocked' || entity.isBanned) {
      return res.status(403).json({ success: false, message: 'Account suspended' });
    }

    // Role-based access check
    if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }

    req.user = entity;
    req.role = decoded.role;
    next();

  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired' });
    }
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

/**
 * Permission key validation middleware (for Admin RBAC)
 */
const requirePermission = (permKey) => (req, res, next) => {
  if (req.role !== 'admin') return res.status(403).json({ success: false, message: 'Admin only' });
  
  const admin = req.user;
  const hasPermission = admin.role === 'super_admin' || (admin.permissions && admin.permissions.includes(permKey));
  
  if (!hasPermission) {
    return res.status(403).json({ success: false, message: `Missing permission: ${permKey}` });
  }
  next();
};

module.exports = { protect, requirePermission };

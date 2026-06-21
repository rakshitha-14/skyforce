const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token from Authorization header
const verifyToken = async (req, res, next) => {
  let token;

  // Check for token in Authorization header (Bearer token)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from database (exclude password) and attach to request
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      if (req.user.isBlocked) {
        return res.status(403).json({ message: 'Account has been blocked by the administrator.' });
      }

      // Check if user is approved (Admins are always approved, but check role just in case)
      if (!req.user.isApproved && req.user.role !== 'Admin') {
        const isProfileGet = req.method === 'GET' && (req.originalUrl === '/api/auth/profile' || req.path === '/profile');
        if (!isProfileGet) {
          return res.status(403).json({ message: 'Access denied. Account pending admin approval.' });
        }
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Authorize roles
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role (${req.user ? req.user.role : 'Guest'}) is not authorized to access this resource`,
      });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  authorizeRoles,
};

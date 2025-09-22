const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User'); // Assuming User model is defined in server.js

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error('No token provided');

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use environment variable for secret
    const user = await User.findOne({ _id: decoded._id, 'role': decoded.role });

    if (!user) throw new Error('User not found');
    req.user = user; // Attach user to request object
    next();
  } catch (err) {
    res.status(401).json({ message: 'Authentication failed', error: err.message });
  }
};

// Role-based authorization middleware
const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

module.exports = { auth, authorize };

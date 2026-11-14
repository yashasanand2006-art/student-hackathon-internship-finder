const jwt = require('jsonwebtoken');
const { isMongoConnected, User, memoryDB } = require('../utils/store');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Authentication token is missing.',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'super_secret_jwt_key_hackathon_internship_2026_nexus'
    );

    let user;
    if (isMongoConnected()) {
      user = await User.findById(decoded.id).select('-password');
    } else {
      user = memoryDB.users.find((u) => u._id.toString() === decoded.id.toString());
      if (user) {
        // Return without password hash
        const { password, ...safeUser } = user;
        user = safeUser;
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('JWT Auth Error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please log in again.',
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user ? req.user.role : 'anonymous'}' is not authorized to access this resource.`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };

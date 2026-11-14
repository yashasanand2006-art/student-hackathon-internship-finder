const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { isMongoConnected, User, memoryDB, generateId } = require('../utils/store');

// Generate JWT token helper
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'super_secret_jwt_key_hackathon_internship_2026_nexus',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

// @desc    Register a new student or admin
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, university, major, gradYear, skills } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (isMongoConnected()) {
      const userExists = await User.findOne({ email: cleanEmail });
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists.',
        });
      }

      const user = await User.create({
        name: name.trim(),
        email: cleanEmail,
        password,
        role: role === 'admin' ? 'admin' : 'student',
        university: university || '',
        major: major || '',
        gradYear: gradYear || '',
        skills: Array.isArray(skills) ? skills : [],
      });

      const token = generateToken(user._id);

      return res.status(201).json({
        success: true,
        message: 'Registration successful!',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          university: user.university,
          major: user.major,
          gradYear: user.gradYear,
          skills: user.skills,
          bio: user.bio,
          avatar: user.avatar,
        },
      });
    } else {
      // In-Memory store handler
      const userExists = memoryDB.users.find((u) => u.email.toLowerCase() === cleanEmail);
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists.',
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        _id: generateId(),
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        role: role === 'admin' ? 'admin' : 'student',
        university: university || '',
        major: major || '',
        gradYear: gradYear || '',
        skills: Array.isArray(skills) ? skills : [],
        bio: '',
        githubUrl: '',
        linkedinUrl: '',
        portfolioUrl: '',
        avatar: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      memoryDB.users.push(newUser);
      const token = generateToken(newUser._id);

      const { password: _, ...safeUser } = newUser;

      return res.status(201).json({
        success: true,
        message: 'Registration successful!',
        token,
        user: safeUser,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (isMongoConnected()) {
      const user = await User.findOne({ email: cleanEmail }).select('+password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password credentials.',
        });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password credentials.',
        });
      }

      const token = generateToken(user._id);

      return res.status(200).json({
        success: true,
        message: 'Login successful!',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          university: user.university,
          major: user.major,
          gradYear: user.gradYear,
          skills: user.skills,
          bio: user.bio,
          githubUrl: user.githubUrl,
          linkedinUrl: user.linkedinUrl,
          portfolioUrl: user.portfolioUrl,
          avatar: user.avatar,
        },
      });
    } else {
      // In-Memory store handler
      const user = memoryDB.users.find((u) => u.email.toLowerCase() === cleanEmail);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password credentials.',
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password credentials.',
        });
      }

      const token = generateToken(user._id);
      const { password: _, ...safeUser } = user;

      return res.status(200).json({
        success: true,
        message: 'Login successful!',
        token,
        user: safeUser,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      university,
      major,
      gradYear,
      skills,
      bio,
      githubUrl,
      linkedinUrl,
      portfolioUrl,
      avatar,
    } = req.body;

    if (isMongoConnected()) {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (name) user.name = name.trim();
      if (university !== undefined) user.university = university.trim();
      if (major !== undefined) user.major = major.trim();
      if (gradYear !== undefined) user.gradYear = gradYear.trim();
      if (skills !== undefined) {
        user.skills = Array.isArray(skills)
          ? skills
          : typeof skills === 'string'
          ? skills.split(',').map((s) => s.trim()).filter(Boolean)
          : [];
      }
      if (bio !== undefined) user.bio = bio.trim();
      if (githubUrl !== undefined) user.githubUrl = githubUrl.trim();
      if (linkedinUrl !== undefined) user.linkedinUrl = linkedinUrl.trim();
      if (portfolioUrl !== undefined) user.portfolioUrl = portfolioUrl.trim();
      if (avatar !== undefined) user.avatar = avatar.trim();

      const updatedUser = await user.save();

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully!',
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          university: updatedUser.university,
          major: updatedUser.major,
          gradYear: updatedUser.gradYear,
          skills: updatedUser.skills,
          bio: updatedUser.bio,
          githubUrl: updatedUser.githubUrl,
          linkedinUrl: updatedUser.linkedinUrl,
          portfolioUrl: updatedUser.portfolioUrl,
          avatar: updatedUser.avatar,
        },
      });
    } else {
      // In-Memory store
      const userIndex = memoryDB.users.findIndex(
        (u) => u._id.toString() === req.user._id.toString()
      );

      if (userIndex === -1) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const target = memoryDB.users[userIndex];
      if (name) target.name = name.trim();
      if (university !== undefined) target.university = university.trim();
      if (major !== undefined) target.major = major.trim();
      if (gradYear !== undefined) target.gradYear = gradYear.trim();
      if (skills !== undefined) {
        target.skills = Array.isArray(skills)
          ? skills
          : typeof skills === 'string'
          ? skills.split(',').map((s) => s.trim()).filter(Boolean)
          : [];
      }
      if (bio !== undefined) target.bio = bio.trim();
      if (githubUrl !== undefined) target.githubUrl = githubUrl.trim();
      if (linkedinUrl !== undefined) target.linkedinUrl = linkedinUrl.trim();
      if (portfolioUrl !== undefined) target.portfolioUrl = portfolioUrl.trim();
      if (avatar !== undefined) target.avatar = avatar.trim();
      target.updatedAt = new Date();

      const { password: _, ...safeUser } = target;

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully!',
        user: safeUser,
      });
    }
  } catch (error) {
    next(error);
  }
};

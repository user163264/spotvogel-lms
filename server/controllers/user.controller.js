const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (user) {
      // Check if the requesting user is an admin or the user themselves
      if (req.user.role === 'admin' || req.user._id.toString() === req.params.id) {
        res.json(user);
      } else {
        res.status(403).json({
          message: 'Not authorized to access this user data'
        });
      }
    } else {
      res.status(404).json({
        message: 'User not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Create a new user (by admin)
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, preferredLanguage, institution, active } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: 'User already exists'
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'teacher',
      preferredLanguage: preferredLanguage || 'en',
      institution,
      active: active !== undefined ? active : true
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        preferredLanguage: user.preferredLanguage,
        institution: user.institution,
        active: user.active,
        createdAt: user.createdAt
      });
    } else {
      res.status(400).json({
        message: 'Invalid user data'
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      // Check if the requesting user is an admin or the user themselves
      if (req.user.role === 'admin' || req.user._id.toString() === req.params.id) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.preferredLanguage = req.body.preferredLanguage || user.preferredLanguage;
        user.institution = req.body.institution || user.institution;

        // Only admins can change roles and active status
        if (req.user.role === 'admin') {
          user.role = req.body.role || user.role;
          user.active = req.body.active !== undefined ? req.body.active : user.active;
        }

        if (req.body.password) {
          user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          preferredLanguage: updatedUser.preferredLanguage,
          institution: updatedUser.institution,
          active: updatedUser.active
        });
      } else {
        res.status(403).json({
          message: 'Not authorized to update this user'
        });
      }
    } else {
      res.status(404).json({
        message: 'User not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      // Don't allow deleting your own admin account
      if (req.user._id.toString() === req.params.id && req.user.role === 'admin') {
        return res.status(400).json({
          message: 'Cannot delete your own admin account'
        });
      }

      await User.findByIdAndDelete(req.params.id);
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({
        message: 'User not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const Auth = require('../models/Auth');
const crypto = require('crypto');

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated',
      errors: [{ field: 'auth', message: 'You must be logged in' }]
    });
  }
  next();
};

// POST /api/auth/login - Login a user
router.post('/login', [
  body('username')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters'),
  body('password')
    .isLength({ min: 1 })
    .withMessage('Password is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }

  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await Auth.findByUsername(username);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password',
        errors: [{ field: 'credentials', message: 'Invalid credentials' }]
      });
    }

    // Compare password with hash
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password',
        errors: [{ field: 'credentials', message: 'Invalid credentials' }]
      });
    }

    // Set session data
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.isAdmin = user.is_admin;

    // Return user info (without password hash)
    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        is_admin: user.is_admin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login',
      errors: [{ field: 'server', message: error.message }]
    });
  }
});

// GET /api/auth/me - Get current user info
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await Auth.findById(req.session.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        errors: [{ field: 'user', message: 'User not found' }]
      });
    }

    return res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      errors: [{ field: 'server', message: error.message }]
    });
  }
});

// POST /api/auth/logout - Logout a user
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error logging out',
        errors: [{ field: 'server', message: err.message }]
      });
    }
    // Clear the cookie
    res.clearCookie("connect.sid", {
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    });

    return res.json({
      success: true,
      message: 'Logout successful'
    });
  });
});

// POST /api/auth/register - Register a new user (should be protected/admin only in production)
router.post('/register', [
  body('username')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('email')
    .isEmail()
    .withMessage('Valid email is required'),
  body('full_name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Full name is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }

  try {
    const { username, password, email, full_name } = req.body;

    // Check if user already exists
    const existingUser = await Auth.findByUsername(username);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Username already exists',
        errors: [{ field: 'username', message: 'Username already exists' }]
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await Auth.createUser(username, passwordHash, email, full_name);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: newUser
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration',
      errors: [{ field: 'server', message: error.message }]
    });
  }
});

module.exports = router;
module.exports.requireAuth = requireAuth;

const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'traveloop_secret_change_in_production';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

const generateToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

// ─── Register ─────────────────────────────────────────────
exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) return res.status(409).json({ success: false, message: 'Email already in use' });

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: user.toPublicJSON(),
    });
  } catch (err) {
    next(err);
  }
};

// ─── Login ────────────────────────────────────────────────
exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);
    res.json({ success: true, message: 'Logged in successfully', token, user: user.toPublicJSON() });
  } catch (err) {
    next(err);
  }
};

// ─── Get Current User ─────────────────────────────────────
exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user.toPublicJSON() });
};

// ─── Logout (client-side, just confirm) ──────────────────
exports.logout = async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};

// ─── Forgot Password (simplified) ────────────────────────
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });
    // Always return success (don't reveal if user exists)
    res.json({ success: true, message: 'If an account with that email exists, you will receive a password reset link.' });
  } catch (err) {
    next(err);
  }
};

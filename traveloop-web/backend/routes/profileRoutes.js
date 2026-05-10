const express = require('express');
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();
router.use(protect);

// Multer config for avatar uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${req.user._id}-${Date.now()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files allowed'));
  },
});

// Get profile
router.get('/', async (req, res) => {
  res.json({ success: true, user: req.user.toPublicJSON() });
});

// Update profile
router.put('/', async (req, res, next) => {
  try {
    const { name, bio, location, phone, preferences } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio, location, phone, preferences },
      { new: true, runValidators: true }
    );
    res.json({ success: true, message: 'Profile updated!', user: user.toPublicJSON() });
  } catch (err) { next(err); }
});

// Upload avatar
router.post('/avatar', upload.single('avatar'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const avatarUrl = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.user._id, { avatar: avatarUrl }, { new: true });
    res.json({ success: true, avatar: avatarUrl, user: user.toPublicJSON() });
  } catch (err) { next(err); }
});

// Change password
router.put('/password', async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Incorrect current password' });
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) { next(err); }
});

// Delete account
router.delete('/', async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ success: true, message: 'Account deleted' });
  } catch (err) { next(err); }
});

module.exports = router;

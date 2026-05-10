const express = require('express');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Trip = require('../models/Trip');

const router = express.Router();
router.use(protect, adminOnly);

// Analytics overview
router.get('/analytics', async (req, res, next) => {
  try {
    const [totalUsers, totalTrips, recentUsers] = await Promise.all([
      User.countDocuments(),
      Trip.countDocuments(),
      User.find().sort({ createdAt: -1 }).limit(10).select('-password'),
    ]);

    const tripsByStatus = await Trip.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      analytics: { totalUsers, totalTrips, tripsByStatus, recentUsers },
    });
  } catch (err) { next(err); }
});

// User management
router.get('/users', async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = search ? { $or: [{ name: /search/i }, { email: /search/i }] } : {};
    const users = await User.find(query).select('-password').sort({ createdAt: -1 })
      .limit(Number(limit)).skip((Number(page) - 1) * Number(limit));
    const total = await User.countDocuments(query);
    res.json({ success: true, users, total });
  } catch (err) { next(err); }
});

// Ban user
router.patch('/users/:id/ban', async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBanned: true }, { new: true }).select('-password');
    res.json({ success: true, user });
  } catch (err) { next(err); }
});

module.exports = router;

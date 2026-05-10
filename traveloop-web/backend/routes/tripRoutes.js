const express = require('express');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const {
  getTrips, getTrip, createTrip, updateTrip, deleteTrip,
  addStop, shareTrip, getSharedTrip,
} = require('../controllers/tripController');

const router = express.Router();

// Protected routes
router.use(protect);
router.route('/').get(getTrips).post(createTrip);
router.route('/:id').get(getTrip).put(updateTrip).delete(deleteTrip);
router.post('/:id/stops', addStop);
router.post('/:id/share', shareTrip);

// Public shared route (no auth needed)
router.get('/shared/:token', optionalAuth, getSharedTrip);

module.exports = router;

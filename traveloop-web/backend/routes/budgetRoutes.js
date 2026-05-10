// ── Budget Routes ──────────────────────────────────────────
const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { Budget } = require('../models/index');

const router = express.Router();
router.use(protect);

router.get('/:tripId', async (req, res, next) => {
  try {
    let budget = await Budget.findOne({ trip: req.params.tripId, user: req.user._id });
    if (!budget) return res.status(404).json({ success: false, message: 'No budget found for this trip' });
    res.json({ success: true, budget });
  } catch (err) { next(err); }
});

router.post('/:tripId', async (req, res, next) => {
  try {
    let budget = await Budget.findOne({ trip: req.params.tripId, user: req.user._id });
    if (budget) {
      Object.assign(budget, req.body);
      await budget.save();
    } else {
      budget = await Budget.create({ ...req.body, trip: req.params.tripId, user: req.user._id });
    }
    res.json({ success: true, budget });
  } catch (err) { next(err); }
});

router.post('/:tripId/expense', async (req, res, next) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { trip: req.params.tripId, user: req.user._id },
      { $push: { expenses: req.body } },
      { new: true }
    );
    if (!budget) return res.status(404).json({ success: false, message: 'Budget not found' });
    res.json({ success: true, budget });
  } catch (err) { next(err); }
});

module.exports = router;

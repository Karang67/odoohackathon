const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { Checklist } = require('../models/index');

const router = express.Router();
router.use(protect);

router.get('/:tripId', async (req, res, next) => {
  try {
    let checklist = await Checklist.findOne({ trip: req.params.tripId, user: req.user._id });
    if (!checklist) return res.json({ success: true, checklist: null });
    res.json({ success: true, checklist });
  } catch (err) { next(err); }
});

router.put('/:tripId', async (req, res, next) => {
  try {
    let checklist = await Checklist.findOneAndUpdate(
      { trip: req.params.tripId, user: req.user._id },
      req.body,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json({ success: true, checklist });
  } catch (err) { next(err); }
});

router.post('/:tripId/items', async (req, res, next) => {
  try {
    const { categoryId, item } = req.body;
    const checklist = await Checklist.findOneAndUpdate(
      { trip: req.params.tripId, user: req.user._id, 'categories._id': categoryId },
      { $push: { 'categories.$.items': item } },
      { new: true }
    );
    if (!checklist) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, checklist });
  } catch (err) { next(err); }
});

router.patch('/:tripId/items/:itemId', async (req, res, next) => {
  try {
    const checklist = await Checklist.findOneAndUpdate(
      { trip: req.params.tripId, user: req.user._id, 'categories.items._id': req.params.itemId },
      { $set: { 'categories.$[].items.$[item].packed': req.body.packed } },
      { arrayFilters: [{ 'item._id': req.params.itemId }], new: true }
    );
    res.json({ success: true, checklist });
  } catch (err) { next(err); }
});

module.exports = router;

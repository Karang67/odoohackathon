const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { Note } = require('../models/index');

const router = express.Router();
router.use(protect);

// Get all notes for user (optional trip filter)
router.get('/', async (req, res, next) => {
  try {
    const query = { user: req.user._id };
    if (req.query.tripId) query.trip = req.query.tripId;
    const notes = await Note.find(query).sort({ pinned: -1, updatedAt: -1 });
    res.json({ success: true, notes });
  } catch (err) { next(err); }
});

// Create note
router.post('/', async (req, res, next) => {
  try {
    const note = await Note.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, note });
  } catch (err) { next(err); }
});

// Update note
router.put('/:id', async (req, res, next) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    res.json({ success: true, note });
  } catch (err) { next(err); }
});

// Delete note
router.delete('/:id', async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    res.json({ success: true, message: 'Note deleted' });
  } catch (err) { next(err); }
});

module.exports = router;

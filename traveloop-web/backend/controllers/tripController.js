const Trip = require('../models/Trip');
const crypto = require('crypto');

// ─── Get All Trips ────────────────────────────────────────
exports.getTrips = async (req, res, next) => {
  try {
    const { status, sort = '-createdAt', limit = 20, page = 1 } = req.query;
    const query = { user: req.user._id };
    if (status && status !== 'all') query.status = status;

    const trips = await Trip.find(query)
      .sort(sort)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    const total = await Trip.countDocuments(query);

    res.json({ success: true, trips, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

// ─── Get Single Trip ──────────────────────────────────────
exports.getTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, user: req.user._id }).populate('user', 'name avatar');
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    res.json({ success: true, trip });
  } catch (err) { next(err); }
};

// ─── Create Trip ──────────────────────────────────────────
exports.createTrip = async (req, res, next) => {
  try {
    const tripData = { ...req.body, user: req.user._id };
    if (req.file) tripData.coverImage = `/uploads/${req.file.filename}`;
    const trip = await Trip.create(tripData);
    res.status(201).json({ success: true, message: 'Trip created!', trip });
  } catch (err) { next(err); }
};

// ─── Update Trip ──────────────────────────────────────────
exports.updateTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { ...req.body, ...(req.file && { coverImage: `/uploads/${req.file.filename}` }) },
      { new: true, runValidators: true }
    );
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    res.json({ success: true, message: 'Trip updated!', trip });
  } catch (err) { next(err); }
};

// ─── Delete Trip ──────────────────────────────────────────
exports.deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    res.json({ success: true, message: 'Trip deleted' });
  } catch (err) { next(err); }
};

// ─── Add Stop to Trip ─────────────────────────────────────
exports.addStop = async (req, res, next) => {
  try {
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $push: { stops: req.body } },
      { new: true }
    );
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    res.json({ success: true, trip });
  } catch (err) { next(err); }
};

// ─── Share Trip ───────────────────────────────────────────
exports.shareTrip = async (req, res, next) => {
  try {
    const token = crypto.randomBytes(24).toString('hex');
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isPublic: true, shareToken: token },
      { new: true }
    );
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    res.json({ success: true, shareUrl: `${process.env.FRONTEND_URL}/shared/${token}`, trip });
  } catch (err) { next(err); }
};

// ─── Get Shared Trip (public) ─────────────────────────────
exports.getSharedTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ shareToken: req.params.token, isPublic: true })
      .populate('user', 'name avatar');
    if (!trip) return res.status(404).json({ success: false, message: 'Shared trip not found' });
    res.json({ success: true, trip });
  } catch (err) { next(err); }
};

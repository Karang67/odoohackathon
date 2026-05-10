const mongoose = require('mongoose');

// ─── Stop Schema ──────────────────────────────────────────
const stopSchema = new mongoose.Schema({
  city: { type: String, required: true },
  country: { type: String },
  arrivalDate: Date,
  departureDate: Date,
  accommodation: {
    name: String,
    address: String,
    checkIn: Date,
    checkOut: Date,
    price: Number,
    confirmationCode: String,
  },
  activities: [{
    name: { type: String, required: true },
    type: { type: String, enum: ['Sightseeing', 'Food', 'Transport', 'Culture', 'Adventure', 'Shopping', 'Wellness', 'Logistics', 'Other'], default: 'Other' },
    time: String,
    duration: String,
    cost: { type: Number, default: 0 },
    notes: String,
    booked: { type: Boolean, default: false },
    bookingRef: String,
  }],
  estimatedCost: { type: Number, default: 0 },
  notes: String,
  order: { type: Number, default: 0 },
});

// ─── Trip Schema ──────────────────────────────────────────
const tripSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: [true, 'Trip name is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
    default: '',
  },
  coverImage: {
    type: String,
    default: '',
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    validate: {
      validator: function (v) { return v >= this.startDate; },
      message: 'End date must be after start date',
    },
  },
  status: {
    type: String,
    enum: ['planning', 'upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'planning',
    index: true,
  },
  budget: {
    type: Number,
    default: 0,
    min: 0,
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true,
  },
  stops: [stopSchema],
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['owner', 'editor', 'viewer'], default: 'viewer' },
    joinedAt: { type: Date, default: Date.now },
  }],
  isPublic: { type: Boolean, default: false },
  shareToken: { type: String, unique: true, sparse: true },
  tags: [{ type: String, trim: true }],
  coverColor: { type: String, default: '#5B4BFF' },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtuals
tripSchema.virtual('durationDays').get(function () {
  if (!this.startDate || !this.endDate) return 0;
  return Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
});

tripSchema.virtual('totalSpent').get(function () {
  return this.stops.reduce((total, stop) =>
    total + stop.activities.reduce((s, a) => s + (a.cost || 0), 0) + (stop.accommodation?.price || 0), 0
  );
});

// Indexes
tripSchema.index({ user: 1, status: 1 });
tripSchema.index({ startDate: -1 });
tripSchema.index({ isPublic: 1 });
tripSchema.index({ shareToken: 1 });

module.exports = mongoose.model('Trip', tripSchema);

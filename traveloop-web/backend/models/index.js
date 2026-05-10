const mongoose = require('mongoose');

// Budget Schema
const budgetSchema = new mongoose.Schema({
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  total: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'USD', uppercase: true },
  categories: [{
    name: { type: String, required: true },
    budget: { type: Number, default: 0 },
    spent: { type: Number, default: 0 },
    color: { type: String, default: '#5B4BFF' },
  }],
  expenses: [{
    category: String,
    amount: { type: Number, required: true },
    description: String,
    date: { type: Date, default: Date.now },
    receipt: String,
  }],
}, { timestamps: true });

// Checklist Schema
const checklistItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  packed: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
});

const checklistSchema = new mongoose.Schema({
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  categories: [{
    name: { type: String, required: true },
    icon: String,
    color: String,
    items: [checklistItemSchema],
  }],
}, { timestamps: true });

// Note Schema
const noteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  content: { type: String, default: '' },
  tags: [{ type: String, trim: true }],
  pinned: { type: Boolean, default: false },
  color: { type: String, default: '#ffffff' },
}, { timestamps: true });

noteSchema.index({ user: 1, createdAt: -1 });
noteSchema.index({ user: 1, trip: 1 });

// SharedTrip Schema
const sharedTripSchema = new mongoose.Schema({
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true, unique: true, index: true },
  title: String,
  description: String,
  isActive: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
  copies: { type: Number, default: 0 },
  expiresAt: Date,
}, { timestamps: true });

module.exports = {
  Budget: mongoose.model('Budget', budgetSchema),
  Checklist: mongoose.model('Checklist', checklistSchema),
  Note: mongoose.model('Note', noteSchema),
  SharedTrip: mongoose.model('SharedTrip', sharedTripSchema),
};

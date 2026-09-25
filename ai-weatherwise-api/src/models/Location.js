const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    city: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    place: { 
      type: String, 
      trim: true, 
      default: 'Home' 
    },
    isDefault: { type: Boolean, default: false },
    tags: [{ type: String, trim: true }]
  },
  { timestamps: true }
);

locationSchema.index({ user: 1, city: 1 });

module.exports = mongoose.model('Location', locationSchema);
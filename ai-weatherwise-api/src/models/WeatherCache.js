const mongoose = require('mongoose');

const weatherCacheSchema = new mongoose.Schema(
  {
    city: { type: String, required: true },
    country: { type: String, required: true },
    data: { type: Object, required: true },
    expiresAt: { type: Date, required: true }
  },
  { timestamps: true }
);

weatherCacheSchema.index({ city: 1, country: 1 });

module.exports = mongoose.model('WeatherCache', weatherCacheSchema);
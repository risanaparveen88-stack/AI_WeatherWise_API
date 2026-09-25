const mongoose = require('mongoose');

const weatherSearchSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    city: { type: String, required: true },
    country: { type: String, default: '' },
    lat: Number,
    lon: Number,
    temperature: Number,
    condition: String,
    humidity: Number,
    windSpeed: Number
  },
  { timestamps: true }
);

weatherSearchSchema.index({ createdAt: -1, user: 1 });

module.exports = mongoose.model('WeatherSearch', weatherSearchSchema);
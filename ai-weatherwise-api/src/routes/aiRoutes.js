const express = require('express');
const { getWeatherSummary, getWeatherRecommendation } = require('../controllers/aiController');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/weather-summary', protect, getWeatherSummary);
router.post('/weather-recommendation', protect, getWeatherRecommendation);

module.exports = router;
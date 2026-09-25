const express = require('express');
const { getCurrentWeatherByCity } = require('../controllers/weatherController');
const protect = require('../middleware/authMiddleware'); // <-- Ithu romba mukkiyam
const router = express.Router();

router.get('/:city', protect, getCurrentWeatherByCity);

module.exports = router;
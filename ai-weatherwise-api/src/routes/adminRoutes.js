const express = require('express');
const { getStats } = require('../controllers/adminController');
const protect = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');
const router = express.Router();

router.get('/stats', protect, requireRole('admin'), getStats);

module.exports = router;
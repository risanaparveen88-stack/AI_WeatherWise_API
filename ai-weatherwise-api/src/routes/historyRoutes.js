const express = require('express');
const { getSearchHistory } = require('../controllers/historyController');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, getSearchHistory);

module.exports = router;
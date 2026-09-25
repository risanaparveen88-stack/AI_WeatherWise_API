const WeatherSearch = require('../models/WeatherSearch');
const { successResponse } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getSearchHistory = asyncHandler(async (req, res) => {
  // WeatherSearch-le irundhe logged-in user-oda last 5 searches-ai fetch panrom
  const history = await WeatherSearch.find({ user: req.user._id || req.user.id })
    .sort({ createdAt: -1 })
    .limit(5);

  return successResponse(res, 'Recent search history fetched successfully', history);
});

module.exports = { getSearchHistory };
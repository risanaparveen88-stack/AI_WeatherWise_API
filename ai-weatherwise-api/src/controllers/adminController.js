const User = require('../models/User');
const Location = require('../models/Location');
const WeatherSearch = require('../models/WeatherSearch');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalLocations = await Location.countDocuments();
  const totalSearches = await WeatherSearch.countDocuments();

  return successResponse(res, 'Admin stats fetched', {
    totalUsers,
    totalLocations,
    totalSearches
  });
});

module.exports = { getStats };
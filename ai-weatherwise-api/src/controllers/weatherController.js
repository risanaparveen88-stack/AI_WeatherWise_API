const { fetchCurrentWeather } = require('../services/openWeatherService');
const WeatherSearch = require('../models/WeatherSearch');
const SearchHistory = require('../models/SearchHistory');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getCurrentWeatherByCity = asyncHandler(async (req, res) => {
  const city = req.params.city;
  const country = req.query.country || 'IN';

  const { data } = await fetchCurrentWeather(city, country);

  // General weather search log
  await WeatherSearch.create({
    user: req.user?._id || req.user?.id || null,
    city,
    country,
    lat: data.lat,
    lon: data.lon,
    temperature: data.temperature,
    condition: data.condition,
    humidity: data.humidity,
    windSpeed: data.windSpeed
  });

  // Save to User's Recent Search History if authenticated
  if (req.user) {
    try {
      await SearchHistory.create({
        user: req.user._id || req.user.id,
        city: data.city || city,
        temperature: data.temperature,
        condition: data.condition
      });
    } catch (err) {
      console.error('History Save Error:', err.message);
    }
  }

  return successResponse(res, 'Current weather fetched successfully', data);
});

module.exports = { getCurrentWeatherByCity };
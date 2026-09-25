const { fetchCurrentWeather } = require('../services/openWeatherService');
const { generateText } = require('../services/aiService');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getWeatherSummary = asyncHandler(async (req, res) => {
  const { city, temperature, humidity, condition, country = 'IN' } = req.body;

  if (!city && (temperature === undefined || condition === undefined)) {
    return errorResponse(res, 'Please provide either a city name or temperature & condition details.', 400);
  }

  let weather = { temperature, humidity, condition };

  if (city && (temperature === undefined || humidity === undefined || condition === undefined)) {
    const { data } = await fetchCurrentWeather(city, country);
    weather = {
      temperature: data.temperature,
      humidity: data.humidity,
      condition: data.condition,
      feelsLike: data.feelsLike,
      windSpeed: data.windSpeed
    };
  }

  const insight = await generateText(
    `Weather is ${weather.temperature}°C, ${weather.condition}, humidity ${weather.humidity}%. Generate meteorological summary.`
  );

  return successResponse(res, 'AI weather summary generated', {
    city: city || 'Custom Location',
    weather,
    summary: insight?.summary || 'Weather conditions remain stable across the area.'
  });
});

const getWeatherRecommendation = asyncHandler(async (req, res) => {
  const { temperature, condition, city, country = 'IN', purpose } = req.body;

  if (!city && (temperature === undefined || condition === undefined)) {
    return errorResponse(res, 'Please provide either a city name or temperature & condition details.', 400);
  }

  let weather = { temperature, condition };

  if (city && (temperature === undefined || condition === undefined)) {
    const { data } = await fetchCurrentWeather(city, country);
    weather = {
      temperature: data.temperature,
      humidity: data.humidity,
      condition: data.condition,
      feelsLike: data.feelsLike,
      windSpeed: data.windSpeed
    };
  }

  const promptText = `Weather is ${weather.temperature}°C, ${weather.condition}. Suggest clothing, activities, and health tips.`;
  
  const insight = await generateText(promptText, purpose);

  const responseData = {
    city: city || 'Custom Location',
    weather,
    clothing: insight?.clothing || ['Wear comfortable cotton clothes.'],
    activities: insight?.activities || ['Good weather for outdoor walks.'],
    healthTips: insight?.healthTips || ['Drink sufficient water and stay hydrated.']
  };

  if (insight?.purposeTemplate || insight?.purposeTip) {
    responseData.purposeTip = insight.purposeTip;
  }

  return successResponse(res, 'AI weather recommendation generated', responseData);
});

module.exports = { getWeatherSummary, getWeatherRecommendation };
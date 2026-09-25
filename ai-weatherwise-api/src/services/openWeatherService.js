const axios = require('axios');
const env = require('../config/env');
const WeatherCache = require('../models/WeatherCache');

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const getWeatherFromCache = async (city, country) => {
  const cacheDoc = await WeatherCache.findOne({
    city: city.toLowerCase(),
    country: country.toUpperCase()
  });
  if (cacheDoc && cacheDoc.expiresAt > new Date()) {
    return cacheDoc.data;
  }
  return null;
};

const saveWeatherToCache = async (city, country, data, ttlMinutes = 10) => {
  await WeatherCache.findOneAndUpdate(
    { city: city.toLowerCase(), country: country.toUpperCase() },
    {
      city: city.toLowerCase(),
      country: country.toUpperCase(),
      data,
      expiresAt: new Date(Date.now() + ttlMinutes * 60 * 1000)
    },
    { upsert: true, new: true }
  );
};

const fetchCurrentWeather = async (city, country = 'IN') => {
  const cached = await getWeatherFromCache(city, country);
  if (cached) return { data: cached, fromCache: true };

  if (!env.OPENWEATHER_API_KEY) {
    throw new Error('OpenWeather API key not configured');
  }

  const url = `${BASE_URL}/weather`;
  const params = {
    q: `${city},${country}`,
    appid: env.OPENWEATHER_API_KEY,
    units: 'metric'
  };

  const res = await axios.get(url, { params });
  const data = {
    city: res.data.name,
    country: res.data.sys.country,
    temperature: res.data.main.temp,
    feelsLike: res.data.main.feels_like,
    humidity: res.data.main.humidity,
    pressure: res.data.main.pressure,
    condition: res.data.weather[0]?.description || 'Unknown',
    windSpeed: res.data.wind?.speed || 0,
    lat: res.data.coord?.lat,
    lon: res.data.coord?.lon,
    fromCache: false
  };

  await saveWeatherToCache(city, country, data);
  return { data, fromCache: false };
};

const fetchForecast = async (city, country = 'IN') => {
  if (!env.OPENWEATHER_API_KEY) {
    throw new Error('OpenWeather API key not configured');
  }

  const url = `${BASE_URL}/forecast`;
  const params = {
    q: `${city},${country}`,
    appid: env.OPENWEATHER_API_KEY,
    units: 'metric'
  };

  const res = await axios.get(url, { params });
  const list = res.data.list.slice(0, 5).map(item => ({
    dt: item.dt,
    date: item.dt_txt,
    temperature: item.main.temp,
    feelsLike: item.main.feels_like,
    humidity: item.main.humidity,
    condition: item.weather[0]?.description || 'Unknown',
    windSpeed: item.wind?.speed || 0
  }));

  return {
    city: res.data.city.name,
    country: res.data.city.country,
    forecast: list
  };
};

module.exports = { fetchCurrentWeather, fetchForecast };
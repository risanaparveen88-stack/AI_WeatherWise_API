const Location = require('../models/Location');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const createLocation = asyncHandler(async (req, res) => {
  const { city, country, place, isDefault, tags } = req.body;

  if (isDefault) {
    await Location.updateMany({ user: req.user._id, isDefault: true }, { isDefault: false });
  }

  const location = await Location.create({
    user: req.user._id,
    city,
    country,
    place: place || 'Home',
    isDefault: !!isDefault,
    tags: tags || []
  });

  return successResponse(res, 'Location added successfully', location, 201);
});

const getLocations = asyncHandler(async (req, res) => {
  const locations = await Location.find({ user: req.user._id }).sort({ createdAt: -1 });
  return successResponse(res, 'Locations fetched', locations);
});

const getLocationById = asyncHandler(async (req, res) => {
  const location = await Location.findOne({ _id: req.params.id, user: req.user._id });
  if (!location) {
    return errorResponse(res, 'Location not found', 404);
  }
  return successResponse(res, 'Location fetched', location);
});

const updateLocation = asyncHandler(async (req, res) => {
  const { city, country, place, isDefault, tags } = req.body;
  const location = await Location.findOne({ _id: req.params.id, user: req.user._id });
  if (!location) {
    return errorResponse(res, 'Location not found', 404);
  }

  if (isDefault) {
    await Location.updateMany({ user: req.user._id, _id: { $ne: location._id }, isDefault: true }, { isDefault: false });
  }

  if (city) location.city = city;
  if (country) location.country = country;
  if (place !== undefined) location.place = place;
  if (isDefault !== undefined) location.isDefault = isDefault;
  if (tags !== undefined) location.tags = tags;

  await location.save();
  return successResponse(res, 'Location updated successfully', location);
});

const deleteLocation = asyncHandler(async (req, res) => {
  const location = await Location.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!location) {
    return errorResponse(res, 'Location not found', 404);
  }
  return successResponse(res, 'Location deleted successfully', location);
});

module.exports = { createLocation, getLocations, getLocationById, updateLocation, deleteLocation };
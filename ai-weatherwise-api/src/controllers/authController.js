const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { sanitizeObject } = require('../utils/sanitize');

const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, preferences } = sanitizeObject(req.body);

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return errorResponse(res, 'Email already registered', 400);
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    phone: phone || '',
    preferences: preferences || {}
  });

  const token = generateToken(user._id, user.role);

  return successResponse(res, 'Registration successful', {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      preferences: user.preferences
    },
    token
  }, 201);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user || !(await user.comparePassword(password))) {
    return errorResponse(res, 'Invalid email or password', 401);
  }

  const token = generateToken(user._id, user.role);
  return successResponse(res, 'Login successful', {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      preferences: user.preferences
    },
    token
  });
});

const getProfile = asyncHandler(async (req, res) => {
  return successResponse(res, 'Profile fetched', {
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      phone: req.user.phone,
      preferences: req.user.preferences
    }
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, preferences } = req.body;
  if (name) req.user.name = name;
  if (phone !== undefined) req.user.phone = phone;
  if (preferences) {
    req.user.preferences = { ...req.user.preferences, ...preferences };
  }
  await req.user.save();
  return successResponse(res, 'Profile updated', {
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      phone: req.user.phone,
      preferences: req.user.preferences
    }
  });
});

module.exports = { register, login, getProfile, updateProfile };
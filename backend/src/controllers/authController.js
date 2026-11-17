
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const makeToken = (id) =>
  jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

const safeUser = (user) => {
  const isPremiumActive =
    user.subscriptionPlan === 'premium' &&
    user.subscriptionExpiry &&
    new Date(user.subscriptionExpiry) > new Date();

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    subscriptionPlan: isPremiumActive ? 'premium' : 'free',
    subscriptionStatus: isPremiumActive
      ? 'active'
      : user.subscriptionPlan === 'premium'
        ? 'expired'
        : 'inactive',
    subscriptionExpiry: user.subscriptionExpiry || null
  };
};

export const register = asyncHandler(async (req, res) => {
  const email = req.body.email.toLowerCase();

  if (await User.findOne({ email })) {
    throw new AppError('Email is already registered', 409);
  }

  const password = await bcrypt.hash(req.body.password, 12);

  const user = await User.create({
    name: req.body.name,
    email,
    password
  });

  res.status(201).json({
    success: true,
    token: makeToken(user._id),
    user: safeUser(user)
  });
});

export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    email: req.body.email.toLowerCase()
  }).select('+password');

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    throw new AppError('Invalid email or password', 401);
  }

  res.json({
    success: true,
    token: makeToken(user._id),
    user: safeUser(user)
  });
});

export const me = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: safeUser(req.user)
  });
});


import crypto from 'crypto';
import Razorpay from 'razorpay';
import User from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const PREMIUM_AMOUNT = 9900;
const SUBSCRIPTION_DAYS = 30;

function razorpayClient() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new AppError('Razorpay is not configured on the server', 503);
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
}

// Create fixed Rs99 Premium order
export const createOrder = asyncHandler(async (req, res) => {
  const razorpay = razorpayClient();

  const order = await razorpay.orders.create({
    amount: PREMIUM_AMOUNT,
    currency: 'INR',
    receipt: `tm_${req.user._id.toString().slice(-8)}_${Date.now()}`
  });

  req.user.razorpayOrderId = order.id;
  await req.user.save();

  res.status(201).json({
    success: true,
    order,
    keyId: process.env.RAZORPAY_KEY_ID,
    plan: 'premium',
    amount: PREMIUM_AMOUNT
  });
});

// Verify actual Razorpay payment and activate Premium
export const verifyPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  } = req.body;

  const user = req.user;

  if (user.razorpayPaymentId === razorpay_payment_id) {
    return res.json({
      success: true,
      verified: true,
      message: 'Payment already verified'
    });
  }

  if (user.razorpayOrderId !== razorpay_order_id) {
    throw new AppError('Order does not belong to this account', 400);
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;

  if (!secret) {
    throw new AppError('Razorpay is not configured on the server', 503);
  }

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;

  const expected = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  const actualBuffer = Buffer.from(razorpay_signature);
  const expectedBuffer = Buffer.from(expected);

  const valid =
    actualBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(actualBuffer, expectedBuffer);

  if (!valid) {
    throw new AppError('Payment signature verification failed', 400);
  }

  const razorpay = razorpayClient();

  const [order, payment] = await Promise.all([
    razorpay.orders.fetch(razorpay_order_id),
    razorpay.payments.fetch(razorpay_payment_id)
  ]);

  if (
    order.amount !== PREMIUM_AMOUNT ||
    order.currency !== 'INR' ||
    order.status !== 'paid'
  ) {
    throw new AppError('Order payment is not completed', 400);
  }

  if (
    payment.order_id !== razorpay_order_id ||
    payment.amount !== PREMIUM_AMOUNT ||
    payment.currency !== 'INR' ||
    payment.status !== 'captured'
  ) {
    throw new AppError('Payment is not captured or details do not match', 400);
  }

  const currentExpiry = user.subscriptionExpiry
    ? new Date(user.subscriptionExpiry).getTime()
    : 0;

  const startDate = new Date(Math.max(Date.now(), currentExpiry));
  const expiryDate = new Date(startDate);

  expiryDate.setDate(expiryDate.getDate() + SUBSCRIPTION_DAYS);

  user.subscriptionPlan = 'premium';
  user.subscriptionStatus = 'active';
  user.subscriptionExpiry = expiryDate;
  user.razorpayPaymentId = razorpay_payment_id;

  await user.save();

  res.json({
    success: true,
    verified: true,
    message: 'Premium subscription activated successfully',
    subscription: {
      plan: 'premium',
      status: 'active',
      expiry: expiryDate
    }
  });
});

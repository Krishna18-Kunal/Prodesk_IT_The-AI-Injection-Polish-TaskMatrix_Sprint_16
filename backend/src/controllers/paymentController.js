import crypto from 'crypto';
import Razorpay from 'razorpay';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function razorpayClient() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new AppError('Razorpay is not configured on the server', 503);
  }
  return new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
}

export const createOrder = asyncHandler(async (req, res) => {
  const order = await razorpayClient().orders.create({
    amount: req.body.amount,
    currency: 'INR',
    receipt: `tm_${req.user._id.toString().slice(-8)}_${Date.now()}`
  });
  res.status(201).json({ success: true, order, keyId: process.env.RAZORPAY_KEY_ID });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) throw new AppError('Razorpay is not configured on the server', 503);
  const body = `${req.body.razorpay_order_id}|${req.body.razorpay_payment_id}`;
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(req.body.razorpay_signature);
  const valid = a.length === b.length && crypto.timingSafeEqual(a, b);
  if (!valid) throw new AppError('Payment signature verification failed', 400);
  res.json({ success: true, verified: true, message: 'Payment signature verified' });
});

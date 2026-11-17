
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 60 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },

  // Subscription details
  subscriptionPlan: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free'
  },
  subscriptionStatus: {
    type: String,
    enum: ['inactive', 'active', 'expired'],
    default: 'inactive'
  },
  subscriptionExpiry: {
    type: Date,
    default: null
  },
  razorpayOrderId: {
    type: String,
    default: null
  },
  razorpayPaymentId: {
    type: String,
    default: null
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);

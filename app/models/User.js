import mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  // Add fields for subscription status, expiration, etc. if needed
  status: {
    type: String,
    enum: ['active', 'expired', 'canceled'],
    default: 'active'
  }
});

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  username: {
    type: String,
    trim: true,
    // No unique constraint to avoid issues with existing data
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  image: {
    type: String,
    default: null,
  },
  emailVerified: {
    type: Date,
    default: null,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  // Add subscriptions field
  subscriptions: [SubscriptionSchema],
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  lastLoginDevice: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);

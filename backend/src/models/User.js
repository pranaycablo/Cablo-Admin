const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name:   { type: String, required: true, trim: true },
  email:  { type: String, sparse: true, lowercase: true, trim: true },
  mobile: { type: String, required: true, unique: true, trim: true },
  role:   { type: String, enum: ['user', 'admin'], default: 'user' },
  status: { type: String, enum: ['active', 'blocked', 'suspended'], default: 'active' },
  password: { type: String, select: false },

  walletBalance: { type: Number, default: 0 },
  negativeWalletCap: { type: Number, default: -30 }, // Platform policy

  otp: {
    code:      { type: String, select: false },
    expiresAt: { type: Date }
  },

  lastUsedService: { type: String, default: null },
  deviceTokens:    [String],       // Push notification tokens
  trustedDevices:  [String],       // Device fingerprints

  referralCode:     String,
  referredBy:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  totalReferrals:   { type: Number, default: 0 },

  loyaltyPoints:    { type: Number, default: 0 },
  loyaltyTier:      { type: String, enum: ['bronze', 'silver', 'gold', 'platinum'], default: 'bronze' },

  totalRides:       { type: Number, default: 0 },
  rating:           { type: Number, default: 5.0, min: 1, max: 5 },

  isKycVerified:    { type: Boolean, default: false },
  blockedReason:    String,

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare Password Method
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Indexes
UserSchema.index({ mobile: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ referralCode: 1 });

module.exports = mongoose.model('User', UserSchema);

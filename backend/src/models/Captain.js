const mongoose = require('mongoose');

const CaptainSchema = new mongoose.Schema({
  name:   { type: String, required: true, trim: true },
  mobile: { type: String, required: true, unique: true },
  email:  { type: String, sparse: true, lowercase: true },
  photo:  String,

  status: {
    type: String,
    enum: ['online', 'offline', 'busy', 'suspended', 'pending_verification'],
    default: 'pending_verification'
  },

  // Real-time GeoJSON location (2dsphere indexed)
  location: {
    type:        { type: String, default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] } // [lng, lat]
  },

  activeVehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },

  verification: {
    status:   { type: String, enum: ['pending', 'ai_verified', 'admin_verified', 'rejected'], default: 'pending' },
    attempts: { type: Number, default: 0 },
    reviewedAt: Date,
    documents: {
      aadhaar:      { url: String, status: String, ocrData: Object },
      drivingLicence: { url: String, status: String, ocrData: Object, expiryDate: Date },
      vehicleRC:    { url: String, status: String, ocrData: Object },
      selfie:       { url: String, status: String },
      vehiclePhoto: { url: String, status: String, plateDetected: String }
    },
    rejectionReason: String
  },

  earnings: {
    today:      { type: Number, default: 0 },
    thisWeek:   { type: Number, default: 0 },
    thisMonth:  { type: Number, default: 0 },
    total:      { type: Number, default: 0 },
    pendingPayout: { type: Number, default: 0 }
  },

  walletBalance:   { type: Number, default: 0 },
  rating:          { type: Number, default: 5.0, min: 1, max: 5 },
  totalRides:      { type: Number, default: 0 },
  acceptanceRate:  { type: Number, default: 100 },
  cancellationRate:{ type: Number, default: 0 },

  otp: {
    code:      { type: String, select: false },
    expiresAt: Date
  },

  deviceTokens: [String],
  isBanned:     { type: Boolean, default: false },
  blockedUntil: Date,

  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Critical Index: geo-spatial for nearby matching
CaptainSchema.index({ location: '2dsphere' });
CaptainSchema.index({ status: 1, 'activeVehicleId': 1 });

module.exports = mongoose.model('Captain', CaptainSchema);

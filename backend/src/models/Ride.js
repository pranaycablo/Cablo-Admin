const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const RideSchema = new mongoose.Schema({
  rideId: { type: String, default: () => `RD-${uuidv4().slice(0, 8).toUpperCase()}`, unique: true },

  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  captainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Captain' },
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },

  serviceType: {
    type: String,
    enum: ['ride', 'parcel', 'logistics', 'heavy', 'machinery', 'bus', 'subscription'],
    required: true
  },

  pickup: {
    address:     String,
    coordinates: { type: [Number], index: '2dsphere' },
    landmark:    String
  },
  drop: {
    address:     String,
    coordinates: { type: [Number], index: '2dsphere' },
    landmark:    String
  },

  distanceKm:  Number,
  durationMin: Number,

  // Status lifecycle
  status: {
    type: String,
    enum: ['pending', 'searching', 'captain_assigned', 'captain_arriving', 'started', 'completed', 'cancelled'],
    default: 'pending'
  },

  // Pricing snapshot at time of booking
  pricing: {
    baseFare:         Number,
    perKmFare:        Number,
    surgeMultiplier:  { type: Number, default: 1.0 },
    platformFee:      Number,
    totalFare:        { type: Number, required: true },
    captainEarnings:  Number,
    aiMargin:         Number
  },

  // OTP for ride start (security)
  otp: { type: String, select: false },

  // Service-specific data
  serviceDetails: {
    weightKg:       Number,   // Parcel / Logistics
    seats:          [Number], // Bus seat numbers
    hours:          Number,   // Machinery booking hours
    schedule:       Object    // Subscription
  },

  // Tracking
  captainLocationHistory: [{
    coordinates: [Number],
    timestamp:   Date
  }],

  // Cancellation
  cancelledBy:     { type: String, enum: ['user', 'captain', 'system', 'admin'] },
  cancellationReason: String,
  cancellationTime:   Date,

  // Ratings
  userRating:    { score: Number, comment: String },
  captainRating: { score: Number, comment: String },

  // FHAL Retries
  matchingAttempts: { type: Number, default: 0 },
  searchRadiusKm:   { type: Number, default: 2 },

  createdAt: { type: Date, default: Date.now },
  startedAt:   Date,
  completedAt: Date
}, { timestamps: true });

// Indexes for fast queries
RideSchema.index({ userId: 1, status: 1 });
RideSchema.index({ captainId: 1, status: 1 });
RideSchema.index({ status: 1, createdAt: -1 });
RideSchema.index({ 'pickup.coordinates': '2dsphere' });

module.exports = mongoose.model('Ride', RideSchema);

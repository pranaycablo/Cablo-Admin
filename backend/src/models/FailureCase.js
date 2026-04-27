const mongoose = require('mongoose');

const FailureCaseSchema = new mongoose.Schema({
  caseId: { type: String, required: true, unique: true },

  type: {
    type: String,
    enum: ['PAYMENT_FAIL', 'RIDE_STUCK', 'GPS_FAIL', 'API_FAIL', 'MATCHING_FAIL', 'EMERGENCY'],
    required: true
  },

  priority:  { type: String, enum: ['critical', 'high', 'medium', 'low'], default: 'medium' },
  status:    { type: String, enum: ['open', 'retrying', 'escalated', 'resolved', 'closed'], default: 'open' },

  // SLA Tracking
  slaHours:       Number,  // Resolution deadline in hours
  slaDeadline:    Date,
  slaBreached:    { type: Boolean, default: false },

  rideId:         { type: mongoose.Schema.Types.ObjectId, ref: 'Ride' },
  userId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  captainId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Captain' },

  errorMessage:   String,
  stackTrace:     String,
  context:        mongoose.Schema.Types.Mixed,

  // FHAL retry logic
  retryCount:     { type: Number, default: 0 },
  maxRetries:     { type: Number, default: 3 },
  lastRetryAt:    Date,
  nextRetryAt:    Date,

  assignedAI:     String,   // Which AI tried to resolve
  assignedAdmin:  { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  resolution:     String,

  adminActions: [{
    adminId:    mongoose.Schema.Types.ObjectId,
    action:     String,
    note:       String,
    timestamp:  Date
  }],

  resolvedAt: Date,
  createdAt:  { type: Date, default: Date.now }
}, { timestamps: true });

FailureCaseSchema.index({ status: 1, priority: 1, createdAt: -1 });
FailureCaseSchema.index({ rideId: 1 });

module.exports = mongoose.model('FailureCase', FailureCaseSchema);

const mongoose = require('mongoose');

const AILogSchema = new mongoose.Schema({
  agentType: {
    type: String,
    enum: ['CEO', 'COO', 'CFO', 'CTO', 'Manager'],
    required: true
  },

  eventType:  { type: String, required: true }, // e.g. 'FARE_CALCULATION', 'MATCHING'
  rideId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Ride' },

  input:    { type: mongoose.Schema.Types.Mixed, required: true },
  decision: { type: String, required: true },
  output:   { type: mongoose.Schema.Types.Mixed, required: true },

  durationMs:     Number,  // Time agent took to decide
  confidence:     Number,  // 0-1 confidence score
  wasOverridden:  { type: Boolean, default: false },
  overriddenBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  overrideReason: String,

  // Admin Learning Loop
  adminQuery:  String,  // Hindi query sent to admin
  adminAnswer: String,  // Admin's response
  isLearned:   { type: Boolean, default: false }, // Was this stored in knowledge base?

  timestamp: { type: Date, default: Date.now }
}, { timestamps: false });

AILogSchema.index({ agentType: 1, timestamp: -1 });
AILogSchema.index({ rideId: 1 });

module.exports = mongoose.model('AILog', AILogSchema);

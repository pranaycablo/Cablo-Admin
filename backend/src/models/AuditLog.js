const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  action: { type: String, required: true }, // e.g., 'USER_BLOCK', 'FARE_OVERRIDE'
  module: { type: String, required: true }, // e.g., 'USER', 'RIDE', 'AI_CFO'
  targetId: mongoose.Schema.Types.ObjectId,
  oldValue: mongoose.Schema.Types.Mixed,
  newValue: mongoose.Schema.Types.Mixed,
  metadata: {
    ip: String,
    userAgent: String,
    reason: String
  },
  timestamp: { type: Date, default: Date.now }
});

// Prevent deletion or modification of logs
AuditLogSchema.pre('save', function(next) {
  if (!this.isNew) {
    throw new Error('Audit logs are immutable and cannot be modified.');
  }
  next();
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);

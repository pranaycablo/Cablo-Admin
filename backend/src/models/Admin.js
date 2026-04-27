const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['super_admin', 'ops_admin', 'finance_admin', 'risk_admin', 'support_admin'], 
    default: 'support_admin' 
  },
  permissions: [String], // Specific permission keys
  status: { type: String, enum: ['active', 'blocked'], default: 'active' },
  twoFactorSecret: String,
  lastLogin: Date,
  trustedDevices: [String],
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
AdminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('Admin', AdminSchema);

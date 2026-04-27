const mongoose = require('mongoose');

const GlobalConfigSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // e.g. "RAZORPAY_KEY", "GOOGLE_MAPS_KEY"
  value: { type: String, required: true },
  description: { type: String },
  category: { 
    type: String, 
    enum: ['payment', 'ai', 'maps', 'platform', 'sms'], 
    required: true 
  },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('GlobalConfig', GlobalConfigSchema);

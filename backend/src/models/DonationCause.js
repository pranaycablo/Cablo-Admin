const mongoose = require('mongoose');

const DonationCauseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  goalAmount: { type: Number },
  raisedAmount: { type: Number, default: 0 },
  paymentGateway: {
    provider: { type: String, enum: ['razorpay', 'stripe', 'paypal'], default: 'razorpay' },
    apiKey: { type: String },
    apiSecret: { type: String }
  },
  isActive: { type: Boolean, default: true },
  region: { type: String, default: 'Global' }
}, { timestamps: true });

module.exports = mongoose.model('DonationCause', DonationCauseSchema);

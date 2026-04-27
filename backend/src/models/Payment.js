const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  rideId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Ride', required: true },
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  captainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Captain' },

  amount:    { type: Number, required: true },
  currency:  { type: String, default: 'INR' },

  method: {
    type: String,
    enum: ['wallet', 'upi', 'card', 'netbanking', 'cash', 'subscription'],
    required: true
  },

  status: {
    type: String,
    enum: ['initiated', 'authorized', 'captured', 'failed', 'refunded', 'partial_refund'],
    default: 'initiated'
  },

  transactionId:       String, // Gateway txn ID
  gatewayOrderId:      String,
  gatewayResponse:     Object, // Full raw payload from payment gateway

  retryCount:          { type: Number, default: 0 },
  lastRetryAt:         Date,
  failureReason:       String,

  breakdown: {
    rideAmount:      Number,
    platformFee:     Number,
    tax:             Number,
    discount:        Number,
    walletUsed:      Number,
    cashCollected:   Number
  },

  captainSettlement: {
    amount:    Number,
    status:    { type: String, enum: ['pending', 'settled'], default: 'pending' },
    settledAt: Date
  },

  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

PaymentSchema.index({ rideId: 1 });
PaymentSchema.index({ userId: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('Payment', PaymentSchema);

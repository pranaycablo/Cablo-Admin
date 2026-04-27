const mongoose = require('mongoose');

const FareConfigSchema = new mongoose.Schema({
  region: { type: String, required: true }, // Country code or City
  currency: { type: String, default: 'INR' },
  vehicleType: { 
    type: String, 
    enum: ['bike', 'auto', 'cab', 'mini_load', 'city_load', 'lite_truck', 'heavy_machinery', 'bus'],
    required: true 
  },
  baseFare: { type: Number, required: true },
  perKmRate: { type: Number, required: true },
  perMinRate: { type: Number, default: 0 },
  minimumFare: { type: Number, required: true },
  platformFeePercent: { type: Number, default: 10 },
  waitChargePerMin: { type: Number, default: 2 },
  nightSurcharge: { type: Number, default: 1.2 }, // Multiplier
  isActive: { type: Boolean, default: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

FareConfigSchema.index({ region: 1, vehicleType: 1 }, { unique: true });

module.exports = mongoose.model('FareConfig', FareConfigSchema);

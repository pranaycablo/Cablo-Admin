const mongoose = require('mongoose');

const ServiceTierSchema = new mongoose.Schema({
  slab: { 
    type: String, 
    required: true,
    enum: ['ride', 'parcel', 'bus', 'machinery', 'logistics', 'monthly']
  },
  categoryName: { type: String, required: true },
  icon: { type: String }, // PNG URL
  vehicleType: { 
    type: String, 
    enum: ['bike', 'auto', 'cab', 'mini_load', 'city_load', 'lite_truck', 'heavy_machinery', 'bus'],
    required: true 
  },
  fareLogic: {
    baseFare: { type: Number, default: 0 },
    perKmRate: { type: Number, default: 0 },
    perMinRate: { type: Number, default: 0 },
    minimumFare: { type: Number, default: 0 },
    waitChargePerMin: { type: Number, default: 0 }
  },
  region: { type: String, default: 'Global' },
  isActive: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

ServiceTierSchema.index({ slab: 1, categoryName: 1, region: 1 }, { unique: true });

module.exports = mongoose.model('ServiceTier', ServiceTierSchema);

const mongoose = require('mongoose');

const VehicleCategorySchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. "Cablo Prime", "Cablo Lite"
  type: { 
    type: String, 
    enum: ['bike', 'auto', 'cab', 'mini_load', 'city_load', 'lite_truck', 'heavy_machinery', 'bus'],
    required: true 
  },
  slab: {
    type: String,
    enum: ['ride', 'parcel', 'bus', 'machinery', 'logistics', 'monthly'],
    required: true
  },
  icon: { type: String }, // PNG URL
  description: { type: String },
  capacity: { type: Number, default: 1 },
  weightLimit: { type: Number }, // For logistics/parcel in KG
  isActive: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('VehicleCategory', VehicleCategorySchema);

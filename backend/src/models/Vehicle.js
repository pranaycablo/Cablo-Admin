const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  ownerId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Captain', required: true },
  type:     { type: String, enum: ['ride', 'parcel', 'logistics', 'heavy', 'machinery', 'bus', 'subscription'], required: true },
  category: { type: String, enum: ['Bike', 'Auto', 'Car', 'Bus', 'Loader', 'MiniLoader', 'SmallTruck', '12WTruck', 'JCB', 'Crane', 'Tractor'], required: true },

  details: {
    make:        String,
    model:       String,
    year:        Number,
    color:       String,
    plateNumber: { type: String, required: true, uppercase: true },
    capacityKg:  Number,       // For Logistics / Parcel
    seats:       Number,       // For Bus
    minHours:    Number,       // For Machinery (min booking)
  },

  pricing: {
    baseFare:    { type: Number, required: true },
    perKmRate:   Number,
    perHourRate: Number,       // Machinery
    perSeatRate: Number,       // Bus
    minDistance: Number,       // Logistics min KM
    surgeMultiplier: { type: Number, default: 1.0 }
  },

  // Route for Bus / Subscription
  route: {
    stops: [{ name: String, coordinates: [Number], fareFromOrigin: Number }],
    schedule: [{ departureTime: String, days: [String] }]
  },

  status: { type: String, enum: ['active', 'inactive', 'under_review'], default: 'under_review' },
  documents: {
    rc:         { url: String, verified: Boolean },
    insurance:  { url: String, verified: Boolean, expiryDate: Date },
    fitness:    { url: String, verified: Boolean, expiryDate: Date }
  },
  photos: [String],

  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

VehicleSchema.index({ ownerId: 1, status: 1 });
VehicleSchema.index({ type: 1, category: 1 });

module.exports = mongoose.model('Vehicle', VehicleSchema);

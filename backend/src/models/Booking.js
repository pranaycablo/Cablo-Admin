const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  captainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Captain' },
  
  serviceType: { 
    type: String, 
    enum: ['ride', 'parcel', 'logistics', 'heavy', 'machinery', 'bus', 'subscription'], 
    required: true 
  },
  
  vehicleCategory: String, // Bike, Auto, Car, Truck, JCB, etc.
  
  pickup: {
    address: String,
    coordinates: { type: [Number], index: '2dsphere' }
  },
  drop: {
    address: String,
    coordinates: { type: [Number], index: '2dsphere' }
  },
  
  status: { 
    type: String, 
    enum: ['pending', 'searching', 'confirmed', 'started', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  
  pricing: {
    baseFare: Number,
    distanceFare: Number,
    surgeMultiplier: { type: Number, default: 1.0 },
    totalFare: Number,
    paymentStatus: { type: String, enum: ['unpaid', 'authorized', 'paid'], default: 'unpaid' }
  },
  
  // Specific Data for different services
  serviceDetails: {
    weight: Number, // For Parcel/Logistics
    dimensions: String,
    seats: [Number], // For Bus
    hours: Number, // For Machinery
    schedule: Object, // For Subscription (days, times)
  },
  
  otp: String, // Ride start OTP
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);

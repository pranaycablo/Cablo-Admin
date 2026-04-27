const RideService = require('../services/RideService');
const PricingService = require('../services/PricingService');
const Ride = require('../models/Ride');

exports.getQuote = async (req, res, next) => {
  try {
    const { vehicleCategory, distanceKm, serviceType, serviceDetails, pickup } = req.body;
    const pricing = await PricingService.calculateFare(
      { distanceKm, serviceType, serviceDetails, pickup },
      vehicleCategory
    );
    res.status(200).json({ success: true, pricing, validFor: 300 }); // Quote valid 5 mins
  } catch (err) { next(err); }
};

exports.createRide = async (req, res, next) => {
  try {
    const ride = await RideService.createRide(req.user._id, req.body);
    res.status(201).json({ success: true, ride });
  } catch (err) { next(err); }
};

exports.getRideStatus = async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.id)
      .populate('captainId', 'name mobile photo rating')
      .populate('vehicleId', 'category details.plateNumber');
    if (!ride) return res.status(404).json({ success: false, message: 'Ride not found' });
    res.status(200).json({ success: true, ride });
  } catch (err) { next(err); }
};

exports.startRide = async (req, res, next) => {
  try {
    const ride = await RideService.startRide(req.params.id, req.user._id, req.body.otp);
    res.status(200).json({ success: true, ride });
  } catch (err) { next(err); }
};

exports.completeRide = async (req, res, next) => {
  try {
    const ride = await RideService.completeRide(req.params.id, req.user._id);
    res.status(200).json({ success: true, ride });
  } catch (err) { next(err); }
};

exports.cancelRide = async (req, res, next) => {
  try {
    const ride = await RideService.cancelRide(req.params.id, req.role, req.body.reason);
    res.status(200).json({ success: true, ride });
  } catch (err) { next(err); }
};

const Ride = require('../models/Ride');
const PricingService = require('./PricingService');
const MatchingService = require('./MatchingService');
const FailureCase = require('../models/FailureCase');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const logger = require('../config/logger');

class RideService {

  async createRide(userId, data) {
    const { serviceType, vehicleCategory, pickup, drop, serviceDetails } = data;

    // Step 1: Calculate Fare
    const distanceKm = data.distanceKm || 5;
    const pricing = await PricingService.calculateFare(
      { distanceKm, serviceType, pickup, serviceDetails },
      vehicleCategory
    );

    // Step 2: Create Ride Record
    const ride = await Ride.create({
      userId,
      serviceType,
      vehicleCategory,
      pickup,
      drop,
      distanceKm,
      pricing,
      status: 'searching',
      otp: crypto.randomInt(1000, 9999).toString()
    });

    logger.info(`[RideService] Ride created: ${ride.rideId}`);

    // Step 3: Async Matching (non-blocking)
    this.startMatchingFlow(ride._id, pickup.coordinates, serviceType).catch(err =>
      logger.error(`[Matching] Error for ride ${ride.rideId}: ${err.message}`)
    );

    return ride;
  }

  async startMatchingFlow(rideId, pickupCoords, serviceType) {
    const captain = await MatchingService.matchWithRetry(rideId, pickupCoords, serviceType);

    if (!captain) {
      // Create a FHAL failure case
      await FailureCase.create({
        caseId: `FHAL-${uuidv4().slice(0, 8).toUpperCase()}`,
        type: 'MATCHING_FAIL',
        priority: 'high',
        rideId,
        slaHours: 1,
        slaDeadline: new Date(Date.now() + 60 * 60 * 1000),
        errorMessage: 'No captains available after maximum radius expansion'
      });

      await Ride.findByIdAndUpdate(rideId, { status: 'cancelled', cancelledBy: 'system' });
      return;
    }

    // Assign Captain
    await Ride.findByIdAndUpdate(rideId, {
      captainId: captain._id,
      vehicleId: captain.activeVehicleId,
      status: 'captain_assigned'
    });

    logger.info(`[RideService] Captain ${captain._id} assigned to ride ${rideId}`);
    // Socket event to captain & user emitted by SocketManager
  }

  async startRide(rideId, captainId, otpInput) {
    const ride = await Ride.findById(rideId).select('+otp');

    if (!ride) throw new Error('Ride not found');
    if (ride.captainId.toString() !== captainId.toString()) throw new Error('Unauthorized');
    if (ride.otp !== otpInput) throw new Error('Invalid OTP');
    if (ride.status !== 'captain_assigned') throw new Error('Ride not in assignable state');

    ride.status = 'started';
    ride.startedAt = new Date();
    ride.otp = undefined; // Clear OTP after use
    await ride.save();

    return ride;
  }

  async completeRide(rideId, captainId) {
    const ride = await Ride.findById(rideId);
    if (!ride || ride.status !== 'started') throw new Error('Cannot complete this ride');
    if (ride.captainId.toString() !== captainId.toString()) throw new Error('Unauthorized');

    ride.status = 'completed';
    ride.completedAt = new Date();
    await ride.save();

    // Trigger wallet settlement logic via CFOAgent here in production
    logger.info(`[RideService] Ride completed: ${ride.rideId}`);
    return ride;
  }

  async cancelRide(rideId, cancelledBy, reason) {
    const ride = await Ride.findById(rideId);
    if (!ride) throw new Error('Ride not found');
    if (['completed', 'cancelled'].includes(ride.status)) throw new Error('Cannot cancel this ride');

    ride.status = 'cancelled';
    ride.cancelledBy = cancelledBy;
    ride.cancellationReason = reason;
    ride.cancellationTime = new Date();
    await ride.save();

    // Apply cancellation penalty logic via CFOAgent here in production
    return ride;
  }
}

module.exports = new RideService();

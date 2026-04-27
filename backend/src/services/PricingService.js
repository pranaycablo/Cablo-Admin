const Vehicle = require('../models/Vehicle');
const AILog = require('../models/AILog');

/**
 * PricingService (AI CFO Core)
 * Multi-model fare engine for all mobility types.
 */
class PricingService {

  VEHICLE_BASE_RATES = {
    Bike:        { base: 20, perKm: 8 },
    Auto:        { base: 30, perKm: 12 },
    Car:         { base: 50, perKm: 16 },
    Bus:         { perSeat: 80 },
    Loader:      { base: 80, perKm: 18 },
    MiniLoader:  { base: 100, perKm: 20 },
    SmallTruck:  { base: 200, perKm: 25, minKm: 10 },
    '12WTruck':  { base: 500, perKm: 35, minKm: 20 },
    JCB:         { perHour: 1200, minHours: 2 },
    Crane:       { perHour: 2000, minHours: 4 },
    Tractor:     { perHour: 800, minHours: 2 }
  };

  PLATFORM_FEE_RATE = 0.15; // 15% platform fee
  MIN_PROFIT = 5;            // ₹5 minimum margin

  async calculateFare(rideData, vehicleCategory) {
    const { distanceKm, durationMin, serviceDetails, serviceType } = rideData;
    const rates = this.VEHICLE_BASE_RATES[vehicleCategory];
    if (!rates) throw new Error(`Unknown vehicle category: ${vehicleCategory}`);

    const surge = await this.getSurgeMultiplier(rideData.pickup.coordinates);
    let baseFare = 0;
    let breakdown = {};

    switch (serviceType) {
      case 'ride':
      case 'parcel':
      case 'logistics':
      case 'heavy': {
        const effectiveKm = Math.max(distanceKm, rates.minKm || 0);
        baseFare = rates.base + (effectiveKm * rates.perKm);
        breakdown = { base: rates.base, perKm: rates.perKm, km: effectiveKm };
        break;
      }
      case 'bus': {
        const seats = serviceDetails?.seats?.length || 1;
        baseFare = (rates.perSeat || 80) * seats;
        breakdown = { perSeat: rates.perSeat, seats };
        break;
      }
      case 'machinery': {
        const hours = Math.max(serviceDetails?.hours || 1, rates.minHours || 1);
        baseFare = rates.perHour * hours;
        breakdown = { perHour: rates.perHour, hours };
        break;
      }
      case 'subscription': {
        // Subscription: working days * both sides
        const days = serviceDetails?.workingDays || 22;
        const trips = serviceDetails?.bothSides ? 2 : 1;
        const dailyRate = rates.base || 300;
        baseFare = dailyRate * days * trips;
        breakdown = { dailyRate, days, trips };
        break;
      }
    }

    const surgedFare = baseFare * surge;
    const platformFee = Math.max(surgedFare * this.PLATFORM_FEE_RATE, this.MIN_PROFIT);
    const totalFare = Math.ceil(surgedFare + platformFee);
    const captainEarnings = Math.ceil(surgedFare);
    const aiMargin = platformFee;

    const result = {
      baseFare: Math.ceil(baseFare),
      surgeMultiplier: surge,
      platformFee: Math.ceil(platformFee),
      totalFare,
      captainEarnings,
      aiMargin,
      breakdown
    };

    // Log AI Decision
    await AILog.create({
      agentType: 'CFO',
      eventType: 'FARE_CALCULATION',
      input: { vehicleCategory, distanceKm, serviceType, surge },
      decision: `Fare = ₹${totalFare} (surge: ${surge}x, margin: ₹${aiMargin.toFixed(2)})`,
      output: result,
      confidence: 0.95
    });

    return result;
  }

  async getSurgeMultiplier(coords) {
    // Connect to real demand-supply Redis store for actual surge multipliers
    // Simulate surge based on time-of-day
    const hour = new Date().getHours();
    if (hour >= 8 && hour <= 10) return 1.4;   // Morning peak
    if (hour >= 17 && hour <= 20) return 1.5;  // Evening peak
    return 1.0;
  }
}

module.exports = new PricingService();

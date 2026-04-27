const Captain = require('../models/Captain');
const Vehicle = require('../models/Vehicle');
const AILog = require('../models/AILog');

/**
 * MatchingService (AI COO Core)
 * Geo-spatial matching of requests to optimal captains.
 */
class MatchingService {

  async findAvailableCaptains(pickupCoords, vehicleType, radiusKm = 2) {
    const [lng, lat] = pickupCoords;

    const captains = await Captain.find({
      status: 'online',
      'verification.status': { $in: ['ai_verified', 'admin_verified'] },
      location: {
        $nearSphere: {
          $geometry: { type: 'Point', coordinates: [lng, lat] },
          $maxDistance: radiusKm * 1000 // convert to meters
        }
      }
    })
    .populate('activeVehicleId')
    .limit(10);

    // Filter by vehicle type
    const matched = captains.filter(c =>
      c.activeVehicleId && c.activeVehicleId.type === vehicleType
    );

    return this.rankCaptains(matched);
  }

  rankCaptains(captains) {
    // Scoring: 60% proximity weight (already sorted), 30% rating, 10% acceptance
    return captains.map(c => ({
      captain: c,
      score: (c.rating * 0.3) + (c.acceptanceRate / 100 * 0.1)
    })).sort((a, b) => b.score - a.score);
  }

  async matchWithRetry(rideId, pickupCoords, vehicleType) {
    let radius = 2;
    let attempt = 0;
    const maxAttempts = 3;

    while (attempt < maxAttempts) {
      attempt++;
      const results = await this.findAvailableCaptains(pickupCoords, vehicleType, radius);

      if (results.length > 0) {
        await AILog.create({
          agentType: 'COO',
          eventType: 'MATCHING_SUCCESS',
          rideId,
          input: { pickupCoords, vehicleType, radiusKm: radius, attempt },
          decision: `Found ${results.length} captains on attempt ${attempt}`,
          output: { captainId: results[0].captain._id, score: results[0].score },
          confidence: 0.9
        });
        return results[0].captain;
      }

      // Expand radius on each retry
      radius *= 2.5;
      console.log(`[COO] No captains in ${radius / 2.5}KM. Expanding to ${radius}KM (attempt ${attempt})`);
    }

    // All retries exhausted
    await AILog.create({
      agentType: 'COO',
      eventType: 'MATCHING_FAILED',
      rideId,
      input: { pickupCoords, vehicleType },
      decision: 'No captains found after 3 radius expansions',
      output: { finalRadiusKm: radius },
      confidence: 0
    });

    return null;
  }
}

module.exports = new MatchingService();

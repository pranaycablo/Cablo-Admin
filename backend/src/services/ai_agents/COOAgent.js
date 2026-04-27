const BaseAgent = require('./BaseAgent');
const logger = require('../../config/logger');

class COOAgent extends BaseAgent {
  constructor() {
    super('AI COO', 'Operations & Allocation');
  }

  async getOpsStatus() {
    return {
      totalRides: 120,
      activeDrivers: 85,
      driverGap: 0.25, // 25% shortage
      topCongestedZone: 'Mumbai North'
    };
  }

  async findBestMatch(userLocation, serviceType) {
    logger.info(`[AI COO] Finding best match for ${serviceType} near ${JSON.stringify(userLocation)}`);
    
    // Logic: Increase search radius if no driver nearby
    let searchRadius = 2; // KM
    let driversFound = 0; // Mock check

    if (driversFound === 0) {
      searchRadius = 5;
      logger.warn(`[AI COO] No drivers in 2KM. Increasing radius to ${searchRadius}KM.`);
    }

    return { driverId: 'DRV_123', eta: '8 mins', radiusUsed: searchRadius };
  }

  async process(event) {
    await super.process(event);
    if (event.type === 'NEW_BOOKING') {
      return this.findBestMatch(event.location, event.service);
    }
  }
}

module.exports = new COOAgent();

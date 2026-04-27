const BaseAgent = require('./BaseAgent');

class CFOAgent extends BaseAgent {
  constructor() {
    super('AI CFO', 'Finance & Pricing');
    this.defaultMargin = 5; // Default profit margin ₹5
  }

  async getFinancialHealth() {
    return {
      avgProfit: 6.5, // Mock value
      revenueToday: 50000,
      fraudAlerts: 0
    };
  }

  async calculateFare(distance, demandSurge, vehicleType) {
    if (!this.isActive) return 0;

    let baseRate = 50; // Minimum base
    let perKmRate = 12;

    // Pricing Zones Logic
    if (distance <= 5) {
      perKmRate = 20; // High per KM for short distance
    } else if (distance > 15) {
      perKmRate = 10; // Optimized for long distance
    }

    const margin = this.calculateDynamicMargin(demandSurge);
    const finalFare = (baseRate + (distance * perKmRate)) * demandSurge + margin;
    
    this.addToMemory({ action: 'FARE_CALCULATION', fare: finalFare, margin, distance });
    return finalFare;
  }

  calculateDynamicMargin(surge) {
    // Dynamic logic based on surge
    return surge > 1.5 ? this.defaultMargin * 2 : this.defaultMargin;
  }

  async process(event) {
    await super.process(event);
    if (event.type === 'FRAUD_CHECK') {
      return { status: 'secure', confidence: 0.98 };
    }
  }
}

module.exports = new CFOAgent();

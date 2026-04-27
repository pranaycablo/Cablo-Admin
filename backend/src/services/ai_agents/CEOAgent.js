const BaseAgent = require('./BaseAgent');
const logger = require('../../config/logger');

class CEOAgent extends BaseAgent {
  constructor() {
    super('AI CEO', 'Strategy & Orchestration');
    this.agentStates = {
      COO: 'active',
      CFO: 'active',
      CTO: 'active',
      Manager: 'active'
    };
  }

  async generateStrategicDirective(data) {
    logger.info(`[AI CEO] Synthesizing data for ${data.opsReport.totalRides} active rides...`);
    
    const tasks = [];
    
    // Logic: If driver gap is high, prioritize COO supply growth
    if (data.opsReport.driverGap > 0.2) {
      tasks.push({
        agent: 'COO',
        description: 'Increase driver onboarding and activate surge incentives',
        priority: 'High'
      });
    }

    // Logic: If profit per trip is low, prioritize CFO pricing update
    if (data.financeReport.avgProfit < 5) {
      tasks.push({
        agent: 'CFO',
        description: 'Optimize pricing zones for short-distance rides',
        priority: 'Critical'
      });
    }

    return {
      directiveId: `STRAT_${Date.now()}`,
      tasks
    };
  }

  async process(event) {
    await super.process(event);
    
    switch(event.type) {
      case 'CRITICAL_SYSTEM_ERROR':
        return this.handleCriticalError(event.data);
      case 'STRATEGIC_PLANNING':
        return this.generateStrategicDirective(event.data);
      default:
        return { message: 'CEO monitoring system...' };
    }
  }

  handleCriticalError(error) {
    logger.error(`[AI CEO] Critical Error detected. Orchestrating recovery...`);
    return this.raiseQueryToAdmin("सिस्टम में गंभीर समस्या आई है। क्या आप चाहते हैं कि मैं सुरक्षित मोड (Safe Mode) सक्रिय करूँ?", error);
  }
}

module.exports = new CEOAgent();

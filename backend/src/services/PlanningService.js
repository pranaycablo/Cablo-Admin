const CEOAgent = require('./ai_agents/CEOAgent');
const logger = require('../config/logger');
const COOAgent = require('./ai_agents/COOAgent');
const CFOAgent = require('./ai_agents/CFOAgent');
const ManagerAgent = require('./ai_agents/ManagerAgent');

/**
 * PlanningService.js
 * Orchestrates the Master Planning System.
 */
class PlanningService {
  constructor() {
    this.planningInterval = 1000 * 60 * 60; // Run every hour
  }

  async runGlobalPlanning() {
    logger.info('--- Starting Global Master Planning Cycle ---');
    
    // 1. Collect Reports
    const opsReport = await COOAgent.getOpsStatus();
    const financeReport = await CFOAgent.getFinancialHealth();
    const growthReport = await ManagerAgent.getGrowthMetrics();

    // 2. CEO Synthesis
    const directive = await CEOAgent.generateStrategicDirective({
      opsReport,
      financeReport,
      growthReport
    });

    // 3. Task Distribution
    await this.distributeTasks(directive.tasks);
    
    logger.info('--- Master Planning Cycle Complete ---');
  }

  async distributeTasks(tasks) {
    for (const task of tasks) {
      logger.info(`[Planning] Assigning task to ${task.agent}: ${task.description}`);
      // In a real app, this would use BullMQ
    }
  }
}

module.exports = new PlanningService();

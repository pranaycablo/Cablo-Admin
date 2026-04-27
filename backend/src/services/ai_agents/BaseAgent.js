/**
 * BaseAgent.js
 * The foundational class for all AI agents in the Cablo ecosystem.
 */
const logger = require('../../config/logger');
class BaseAgent {
  constructor(name, role) {
    this.name = name;
    this.role = role;
    this.isActive = true;
    this.memory = []; // Short-term memory for active tasks
  }

  // Toggle agent status (Kill Switch)
  setStatus(status) {
    this.isActive = status;
    logger.info(`[${this.name}] Status changed to: ${this.isActive ? 'Active' : 'Stopped'}`);
  }

  // Base thinking method to be overridden
  async process(event) {
    if (!this.isActive) {
      logger.warn(`[${this.name}] Attempted to process event but agent is STOPPED.`);
      return { status: 'stopped', message: 'Agent is inactive' };
    }
    logger.info(`[${this.name}] Processing event: ${event.type}`);
  }

  // Add to internal memory
  addToMemory(item) {
    this.memory.push({
      timestamp: new Date(),
      ...item
    });
    // Keep memory lean
    if (this.memory.length > 50) this.memory.shift();
  }

  // Raise query to Admin (Learning Loop)
  async raiseQueryToAdmin(queryHindi, context) {
    logger.warn(`[${this.name}] Raising Query to Admin (Hindi): ${queryHindi}`);
    // This will eventually emit a socket event to the Admin Panel
    return {
      type: 'ADMIN_QUERY',
      agent: this.name,
      query: queryHindi,
      context: context
    };
  }
}

module.exports = BaseAgent;

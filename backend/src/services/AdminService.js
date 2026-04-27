const User = require('../models/User');
const Admin = require('../models/Admin');
const logger = require('../config/logger');
const Captain = require('../models/Captain');
const Booking = require('../models/Booking');
const AuditLog = require('../models/AuditLog');
const CEOAgent = require('./ai_agents/CEOAgent');

/**
 * AdminService.js
 * The "Supreme Authority" service for manual overrides and system governance.
 */
class AdminService {
  
  async forceAction(adminId, actionType, targetId, data) {
    logger.warn(`[Admin] Execution Force Action: ${actionType} on ${targetId}`);
    
    let oldValue, newValue;
    
    switch(actionType) {
      case 'USER_BLOCK':
        const user = await User.findById(targetId);
        oldValue = user.status;
        user.status = 'blocked';
        await user.save();
        newValue = 'blocked';
        break;

      case 'AI_STOP':
        // targetId would be agent name like 'CFO'
        CEOAgent.setStatus(targetId, false);
        newValue = 'stopped';
        break;

      case 'FARE_OVERRIDE':
        const ride = await Booking.findById(targetId);
        oldValue = ride.pricing.totalFare;
        ride.pricing.totalFare = data.newFare;
        await ride.save();
        newValue = data.newFare;
        break;

      default:
        throw new Error('Invalid Force Action');
    }

    // Log the action for forensics
    await new AuditLog({
      adminId,
      action: actionType,
      module: actionType.split('_')[0],
      targetId,
      oldValue,
      newValue,
      metadata: { reason: data.reason || 'Admin override' }
    }).save();

    return { success: true, message: `${actionType} completed successfully` };
  }

  async updateAIState(agentName, state) {
    // ACTIVE, PAUSED, LIMITED, DISABLED
    logger.warn(`[Admin] Changing AI Agent ${agentName} state to ${state}`);
    // Logic to update agent state in the Brain
  }
}

module.exports = new AdminService();

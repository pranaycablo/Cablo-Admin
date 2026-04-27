const router = require('express').Router();
const { protect, requirePermission } = require('../middleware/auth');
const AdminService = require('../services/AdminService');
const User = require('../models/User');
const Captain = require('../models/Captain');
const Ride = require('../models/Ride');
const FailureCase = require('../models/FailureCase');

// Dashboard summary
router.get('/dashboard', protect(['admin']), async (req, res, next) => {
  try {
    const [users, captains, rides, failures] = await Promise.all([
      User.countDocuments(),
      Captain.countDocuments({ status: 'online' }),
      Ride.countDocuments({ status: 'started' }),
      FailureCase.countDocuments({ status: 'open' })
    ]);
    res.json({ success: true, metrics: { totalUsers: users, onlineCaptains: captains, activeRides: rides, openFailures: failures } });
  } catch (err) { next(err); }
});

// Block user
router.post('/block-user', protect(['admin']), requirePermission('USER_BLOCK'), async (req, res, next) => {
  try {
    const result = await AdminService.forceAction(req.user._id, 'USER_BLOCK', req.body.userId, req.body);
    res.json({ success: true, result });
  } catch (err) { next(err); }
});

// Override AI
router.post('/override-ai', protect(['admin']), requirePermission('AI_STOP'), async (req, res, next) => {
  try {
    const result = await AdminService.updateAIState(req.body.agentName, req.body.state);
    res.json({ success: true, result });
  } catch (err) { next(err); }
});

// Failure cases
router.get('/failures', protect(['admin']), async (req, res, next) => {
  try {
    const failures = await FailureCase.find({ status: { $in: ['open', 'retrying', 'escalated'] } })
      .sort({ priority: 1, createdAt: -1 }).limit(50);
    res.json({ success: true, failures });
  } catch (err) { next(err); }
});

module.exports = router;

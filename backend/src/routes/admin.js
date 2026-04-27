const router = require('express').Router();
const { protect, requirePermission } = require('../middleware/auth');
const AdminService = require('../services/AdminService');
const User = require('../models/User');
const Captain = require('../models/Captain');
const Ride = require('../models/Ride');
const FailureCase = require('../models/FailureCase');

const FareConfig = require('../models/FareConfig');

// Dashboard summary
router.get('/dashboard', protect(['admin']), async (req, res, next) => {
  try {
    const [users, captains, rides, failures] = await Promise.all([
      User.countDocuments(),
      Captain.countDocuments(), // Changed from online for overall stats
      Ride.countDocuments(),
      FailureCase.countDocuments()
    ]);
    // Revenue mock calculation (since real transactions are limited)
    const revenue = await Ride.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: "$fare.amount" } } }
    ]);

    res.json({ 
      success: true, 
      metrics: { 
        totalUsers: users, 
        totalCaptains: captains, 
        totalRides: rides, 
        openFailures: failures,
        totalRevenue: revenue[0]?.total || 0
      } 
    });
  } catch (err) { next(err); }
});

// Fare Management
router.get('/fare-configs', protect(['admin']), async (req, res, next) => {
  try {
    const configs = await FareConfig.find().sort({ region: 1 });
    res.json({ success: true, configs });
  } catch (err) { next(err); }
});

router.post('/fare-configs', protect(['admin']), async (req, res, next) => {
  try {
    const { region, vehicleType, ...data } = req.body;
    const config = await FareConfig.findOneAndUpdate(
      { region, vehicleType },
      { ...data, updatedBy: req.user._id },
      { upsert: true, new: true }
    );
    res.json({ success: true, config });
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

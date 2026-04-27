const router = require('express').Router();
const { protect, requirePermission } = require('../middleware/auth');
const AdminService = require('../services/AdminService');
const User = require('../models/User');
const Captain = require('../models/Captain');
const Ride = require('../models/Ride');
const FailureCase = require('../models/FailureCase');

const FareConfig = require('../models/FareConfig');

const VehicleCategory = require('../models/VehicleCategory');

// Dashboard summary
router.get('/dashboard', protect(['admin']), async (req, res, next) => {
  try {
    const [users, captains, rides, failures, categories] = await Promise.all([
      User.countDocuments(),
      Captain.countDocuments(),
      Ride.countDocuments(),
      FailureCase.countDocuments(),
      VehicleCategory.countDocuments()
    ]);
    // Revenue mock calculation
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
        totalRevenue: revenue[0]?.total || 0,
        totalCategories: categories
      } 
    });
  } catch (err) { next(err); }
});

// Vehicle Categories
router.get('/vehicle-categories', protect(['admin']), async (req, res, next) => {
  try {
    const categories = await VehicleCategory.find().sort({ slab: 1, displayOrder: 1 });
    res.json({ success: true, categories });
  } catch (err) { next(err); }
});

router.post('/vehicle-categories', protect(['admin']), async (req, res, next) => {
  try {
    const category = await VehicleCategory.create(req.body);
    res.json({ success: true, category });
  } catch (err) { next(err); }
});

router.put('/vehicle-categories/:id', protect(['admin']), async (req, res, next) => {
  try {
    const category = await VehicleCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, category });
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

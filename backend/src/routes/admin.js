const router = require('express').Router();
const { protect, requirePermission } = require('../middleware/auth');
const AdminService = require('../services/AdminService');
const User = require('../models/User');
const Captain = require('../models/Captain');
const Ride = require('../models/Ride');
const FailureCase = require('../models/FailureCase');
const ServiceTier = require('../models/ServiceTier');
const FareConfig = require('../models/FareConfig');
const GlobalConfig = require('../models/GlobalConfig');
const DonationCause = require('../models/DonationCause');

// Dynamic Config Management (API Keys, Fees)
router.get('/config', protect(['admin']), async (req, res, next) => {
  try {
    const configs = await GlobalConfig.find();
    res.json({ success: true, configs });
  } catch (err) { next(err); }
});

router.post('/config', protect(['admin']), async (req, res, next) => {
  try {
    const { key, value, category, description } = req.body;
    const config = await GlobalConfig.findOneAndUpdate(
      { key },
      { value, category, description, updatedBy: req.user._id },
      { upsert: true, new: true }
    );
    res.json({ success: true, config });
  } catch (err) { next(err); }
});

// User/Captain Management (Full Control)
router.get('/users', protect(['admin']), async (req, res, next) => {
  try {
    const query = req.user.role === 'sub-admin' ? { region: req.user.region } : {};
    const users = await User.find(query).limit(100).sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) { next(err); }
});

router.put('/users/:id', protect(['admin']), async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, user });
  } catch (err) { next(err); }
});

router.delete('/users/:id', protect(['admin']), async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) { next(err); }
});

router.get('/captains', protect(['admin']), async (req, res, next) => {
  try {
    const query = req.user.role === 'sub-admin' ? { region: req.user.region } : {};
    const captains = await Captain.find(query).limit(100).sort({ createdAt: -1 });
    res.json({ success: true, captains });
  } catch (err) { next(err); }
});

// NGO / Donation Management
router.get('/donations', protect(['admin']), async (req, res, next) => {
  try {
    const causes = await DonationCause.find().sort({ isActive: -1 });
    res.json({ success: true, causes });
  } catch (err) { next(err); }
});

router.post('/donations', protect(['admin']), async (req, res, next) => {
  try {
    const cause = await DonationCause.create(req.body);
    res.json({ success: true, cause });
  } catch (err) { next(err); }
});

// Unified Service Management
router.get('/service-tiers', protect(['admin']), async (req, res, next) => {
  try {
    const tiers = await ServiceTier.find().sort({ slab: 1, displayOrder: 1 });
    res.json({ success: true, tiers });
  } catch (err) { next(err); }
});

router.post('/service-tiers', protect(['admin']), async (req, res, next) => {
  try {
    const tier = await ServiceTier.findOneAndUpdate(
      { slab: req.body.slab, categoryName: req.body.categoryName, region: req.body.region || 'Global' },
      { ...req.body, updatedBy: req.user._id },
      { upsert: true, new: true }
    );
    res.json({ success: true, tier });
  } catch (err) { next(err); }
});

router.put('/service-tiers/:id', protect(['admin']), async (req, res, next) => {
  try {
    const tier = await ServiceTier.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, tier });
  } catch (err) { next(err); }
});

router.delete('/service-tiers/:id', protect(['admin']), async (req, res, next) => {
  try {
    await ServiceTier.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Tier deleted' });
  } catch (err) { next(err); }
});

// Dashboard summary
router.get('/dashboard', protect(['admin']), async (req, res, next) => {
  try {
    const [users, captains, rides, failures, tiers, recentRides] = await Promise.all([
      User.countDocuments(),
      Captain.countDocuments(),
      Ride.countDocuments(),
      FailureCase.countDocuments(),
      ServiceTier.countDocuments(),
      Ride.find().sort({ createdAt: -1 }).limit(5)
    ]);
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
        totalTiers: tiers
      },
      recentRides
    });
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

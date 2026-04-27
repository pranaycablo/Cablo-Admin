const router = require('express').Router();
const RideController = require('../controllers/RideController');
const { protect } = require('../middleware/auth');

// User endpoints
router.post('/quote',              protect(['user']),    RideController.getQuote);
router.post('/create',             protect(['user']),    RideController.createRide);
router.get('/:id/status',          protect(['user', 'captain', 'admin']), RideController.getRideStatus);
router.post('/:id/cancel',         protect(['user', 'admin']), RideController.cancelRide);

// Captain endpoints
router.post('/:id/start',          protect(['captain']), RideController.startRide);
router.post('/:id/complete',       protect(['captain']), RideController.completeRide);

module.exports = router;

const router = require('express').Router();
const CaptainController = require('../controllers/CaptainController');
const { protect } = require('../middleware/auth');

router.post('/go-online',        protect(['captain']), CaptainController.goOnline);
router.post('/go-offline',       protect(['captain']), CaptainController.goOffline);
router.patch('/update-location', protect(['captain']), CaptainController.updateLocation);
router.get('/earnings',          protect(['captain']), CaptainController.getEarnings);

module.exports = router;

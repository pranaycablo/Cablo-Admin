const router = require('express').Router();
const UserController = require('../controllers/UserController');
const { protect } = require('../middleware/auth');

router.get('/profile', protect(['user']), UserController.getProfile);
router.put('/update',  protect(['user']), UserController.updateProfile);
router.get('/wallet',  protect(['user']), UserController.getWallet);

module.exports = router;

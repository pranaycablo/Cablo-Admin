const router = require('express').Router();
const AuthController = require('../controllers/AuthController');
const { otpLimiter } = require('../middleware/rateLimiter');

router.post('/send-otp',   otpLimiter, AuthController.sendOTP);
router.post('/verify-otp', otpLimiter, AuthController.verifyOTP);
router.post('/logout',     AuthController.logout);

module.exports = router;

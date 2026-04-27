const rateLimit = require('express-rate-limit');
const logger = require('../config/logger');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded: ${req.ip}`);
    res.status(429).json({ success: false, message: 'Too many requests. Please slow down.' });
  }
});

// Strict OTP limiter
const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  handler: (req, res) => {
    logger.warn(`OTP rate limit exceeded: ${req.ip} mobile=${req.body.mobile}`);
    res.status(429).json({ success: false, message: 'Too many OTP requests. Try again in 10 minutes.' });
  }
});

module.exports = { apiLimiter, otpLimiter };

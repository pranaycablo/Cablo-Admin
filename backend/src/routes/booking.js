const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/BookingController');

// Mock Auth Middleware
const mockAuth = (req, res, next) => {
  req.user = { id: '60d0fe4f5311236168a109ca' }; // Dummy ID
  next();
};

router.post('/quote', mockAuth, BookingController.createQuote);
router.post('/execute', mockAuth, BookingController.executeBooking);

module.exports = router;

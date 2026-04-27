const BookingService = require('../services/BookingService');
const OptimizationService = require('../services/OptimizationService');

/**
 * BookingController.js
 */
exports.createQuote = async (req, res) => {
  try {
    const quote = await BookingService.createQuote(req.user.id, req.body);
    res.status(200).json(quote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.executeBooking = async (req, res) => {
  try {
    const booking = await BookingService.executeBooking(req.user.id, req.body);
    OptimizationService.recordEvent('BOOKING_REQUESTED', booking);
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

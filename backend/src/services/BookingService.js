const Booking = require('../models/Booking');
const CFOAgent = require('./ai_agents/CFOAgent');
const COOAgent = require('./ai_agents/COOAgent');

/**
 * BookingService.js
 * Handles the logic for all multi-mobility booking types.
 */
class BookingService {
  
  async createQuote(userId, data) {
    const { serviceType, pickup, drop, vehicleCategory, serviceDetails } = data;
    
    // Calculate Distance (Mocked for now)
    const distance = 10; // KM
    
    let quote = {
      baseFare: 0,
      totalFare: 0,
      breakdown: {}
    };

    switch(serviceType) {
      case 'ride':
      case 'parcel':
        quote.totalFare = await CFOAgent.calculateFare(distance, 1.2, vehicleCategory);
        break;
      
      case 'bus':
        // Seat based pricing
        const pricePerSeat = serviceDetails.isAC ? 500 : 300;
        quote.totalFare = pricePerSeat * serviceDetails.seats.length;
        break;
      
      case 'machinery':
        // Per hour pricing
        const ratePerHour = 1500;
        const hours = Math.max(serviceDetails.hours, 2); // Min 2 hours
        quote.totalFare = ratePerHour * hours;
        break;
      
      case 'subscription':
        // Monthly logic
        const monthlyBase = 5000;
        quote.totalFare = monthlyBase; // Simplified
        break;

      default:
        quote.totalFare = distance * 15;
    }

    return quote;
  }

  async executeBooking(userId, quoteData) {
    const booking = new Booking({
      userId,
      ...quoteData,
      status: 'searching'
    });

    await booking.save();
    
    // Trigger Matching Engine (COO Agent)
    COOAgent.process({
      type: 'NEW_BOOKING',
      bookingId: booking._id,
      location: quoteData.pickup.coordinates,
      service: quoteData.serviceType
    });

    return booking;
  }
}

module.exports = new BookingService();

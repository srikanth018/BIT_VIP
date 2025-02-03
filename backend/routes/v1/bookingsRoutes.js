const express = require('express');
const router = express.Router();
const bookingsController = require('../../controllers/bookingsController');

// Define routes
router.post('/bookings', bookingsController.createBooking);
router.get('/bookings', bookingsController.getBookings);
router.get('/available-rooms', bookingsController.getAvailableRooms);

module.exports = router;
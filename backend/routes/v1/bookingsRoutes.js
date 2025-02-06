const express = require('express');
const router = express.Router();
const bookingsController = require('../../controllers/bookingsController');

// Define routes
router.post('/bookings', bookingsController.createBooking);
router.get('/bookings', bookingsController.getBookings);
router.get('/available-rooms', bookingsController.getAvailableRooms);
router.get('/bookingsByID/:id', bookingsController.getBookingsByFacultyID);
router.get('/bookingsByDate/:facultyID', bookingsController.getBookingsByDate);

module.exports = router;
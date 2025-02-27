const express = require('express');
const router = express.Router();
const adminDashboardController = require('../../controllers/adminDashboardController');

// Define routes
router.get('/getCardData', adminDashboardController.getCardData);
router.get('/todayBookings', adminDashboardController.getTodayBookings);
router.get('/todayBookingsStatus', adminDashboardController.getTodayBookingsStatus);


module.exports = router;
const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

// Define routes
router.post('/rooms', roomController.createRoom);
// Add more routes as needed (e.g., update, delete, fetch rooms)

module.exports = router;

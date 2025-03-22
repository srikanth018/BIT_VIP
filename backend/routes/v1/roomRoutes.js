const express = require('express');
const router = express.Router();
const roomController = require('../../controllers/roomController');

// Define routes
router.post('/rooms', roomController.createRoom);
router.get('/rooms', roomController.getRooms);  
router.put("/rooms/:id", roomController.updateRoom);
router.delete("/rooms/:id", roomController.deleteRoom);


// Add more routes as needed (e.g., update, delete, fetch rooms)

module.exports = router;

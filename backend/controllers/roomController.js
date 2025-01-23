const Room = require('../models/room');

// Create a new room
exports.createRoom = async (req, res) => {
    const { RoomID, Block, Type, Floor, Capacity, RoomInfo } = req.body;

    try {
        const newRoom = await Room.create({ RoomID, Block, Type, Floor, Capacity, RoomInfo });
        res.status(201).json({ message: 'Room created successfully!', room: newRoom });
    } catch (error) {
        res.status(500).json({ message: 'Error creating room', error: error.message });
    }
};

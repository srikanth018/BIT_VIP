const Room = require('../models/room');

// Create a new room
// Create a new room
exports.createRoom = async (req, res) => {
    const newRoom = req.body;

    try {
        const createdRoom = await Room.create({
            RoomID: newRoom.RoomID,
            Block: newRoom.Block,
            Type: newRoom.Type,
            Floor: newRoom.Floor,
            Capacity: newRoom.Capacity,
            RoomInfo: newRoom.RoomInfo,
        });

        res.status(201).json({
            message: "Room created successfully",
            room: createdRoom,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating room",
            error: error.message,
        });
    }
};

exports.getRooms = async (req, res) => {
    try {
        const rooms = await Room.findAll(); // Fetch all room records
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching rooms', error: error.message });
    }
};





// Update room data
exports.updateRoom = async (req, res) => {
    const { id } = req.params; // RoomID from the URL
    const updatedData = req.body; // Updated room data from the request body

    try {
        // Find the room by RoomID and update it
        const [updatedRows] = await Room.update(updatedData, {
            where: { RoomID: id }, // Condition to find the room to update
        });

        // Check if the room was updated
        if (updatedRows === 0) {
            return res.status(404).json({ message: "Room not found" });
        }

        // Fetch the updated room data
        const updatedRoom = await Room.findOne({
            where: { RoomID: id }, // Fetch the updated room
        });

        res.status(200).json({
            message: "Room updated successfully",
            room: updatedRoom, // Return the updated room
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error updating room",
            error: error.message,
        });
    }
};

// Delete a room
exports.deleteRoom = async (req, res) => {
    const { id } = req.params; // RoomID from the URL

    try {
        const deletedRows = await Room.destroy({
            where: { RoomID: id }, // Condition to find the room to delete
        });

        if (deletedRows === 0) {
            return res.status(404).json({ message: "Room not found" });
        }

        res.status(200).json({ message: "Room deleted successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting room",
            error: error.message,
        });
    }
};
const { Op } = require('sequelize');
const Room = require('../models/room');
const Bookings = require('../models/bookings');

exports.createBooking = async (req, res) => {
    const { BookingID, RoomID, UserID, Date, StartTime, EndTime, Purpose, Status } = req.body;

    try {
        const newBooking = await Bookings.create({ BookingID, RoomID, UserID, Date, StartTime, EndTime, Purpose, Status });
        res.status(201).json({ message: 'Booking created successfully!', booking: newBooking });
    } catch (error) {
        res.status(500).json({ message: 'Error creating booking', error: error.message });
    }
}

exports.getBookings = async (req, res) => {
    try {
        const bookings = await Bookings.findAll(); // Fetch all booking records
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
};


exports.getAvailableRooms = async (req, res) => {
    const { date, fromTime, toTime, block, floor, type, capacity } = req.query;
  
    // Validate required parameters
    if (!date || !fromTime || !toTime) {
      return res.status(400).json({
        error: "Missing required query parameters: date, fromTime, and toTime are mandatory.",
      });
    }
  
    try {
      const formattedFromTime = `${fromTime}:00`;
      const formattedToTime = `${toTime}:00`;
  
      // Fetch all booked room IDs for the given date and overlapping time range
      const bookedRooms = await Bookings.findAll({
        where: {
          Date: date,
          [Op.or]: [
            { StartTime: { [Op.between]: [formattedFromTime, formattedToTime] } },
            { EndTime: { [Op.between]: [formattedFromTime, formattedToTime] } },
            {
              [Op.and]: [
                { StartTime: { [Op.lte]: formattedFromTime } },
                { EndTime: { [Op.gte]: formattedToTime } },
              ],
            },
          ],
        },
        attributes: ["RoomID"],
      });
  
      const bookedRoomIDs = bookedRooms.map((booking) => booking.RoomID);
  
      // Fetch available rooms
      const availableRooms = await Room.findAll({
        where: {
          ...(bookedRoomIDs.length > 0 && { RoomID: { [Op.notIn]: bookedRoomIDs } }),
          ...(block && { Block: block }),
          ...(floor && { Floor: floor }),
          ...(type && { Type: type }),
          ...(capacity && { 
            Capacity: { 
              [Op.gte]: capacity,  
              [Op.lte]: capacity + 15,
              [Op.gte]: capacity /2
            } 
          }),        },
      });
  
  
      if (availableRooms.length === 0) {
        return res.json({ message: "No rooms available." });
      }
  
      res.json(availableRooms);
    } catch (error) {
      console.error("Error fetching available rooms:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  
  
  
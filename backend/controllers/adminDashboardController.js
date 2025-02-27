const Booking = require('../models/bookings');
const Room  = require('../models/room');
const { Op } = require('sequelize');



exports.getCardData = async (req, res) => {
  try {
    const totalBookings = await Booking.count();
    const academicClasses = await Room.count({ where: { Type: 'Class Room' } });
    const computerLabs = await Room.count({ where: { Type: 'Computer Labs' } });
    const seminarHalls = await Room.count({ where: { Type: 'Seminar Hall' } });
    const auditorium = await Room.count({ where: { Type: 'Auditorium' } });

    
    res.json({
      totalBookings,
      academicClasses,
      computerLabs,
      seminarHalls,
      auditorium,
    });
  } catch (error) {

    res.status(500).json({ message: 'Error fetching dashboard data', error });
  }
};


exports.getTodayBookings = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const bookings = await Booking.findAll({
      where: {
        Date: {
          [Op.gte]: today,
        },
      },
      attributes: ['RoomID'],
      group: ['RoomID'], // Ensure unique RoomID per day
    });

    const roomCounts = await Room.findAll({
      where: {
        RoomID: bookings.map(b => b.RoomID),
      },
      attributes: ['Type'],
    });

    const totalRooms = await Room.count();
    const counts = { 'Class Room': 0, 'Computer Labs': 0, 'Seminar Hall': 0, 'Auditorium': 0 };

    roomCounts.forEach(room => {
      if (counts[room.Type] !== undefined) {
        counts[room.Type] += 1;
      }
    });

    const percentages = Object.keys(counts).reduce((acc, key) => {
      acc[key] = totalRooms > 0 ? ((counts[key] / totalRooms) * 100).toFixed(2) : 0;
      return acc;
    }, {});

    res.json({ labels: Object.keys(counts), data: Object.values(counts), percentages });
  } catch (error) {
    console.error('Error fetching todays bookings:', error);
    res.status(500).json({ message: 'Error fetching todays bookings', error });
  }
};

exports.getTodayBookingsStatus = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const statuses = ['Pending', 'Approved', 'Rejected'];

    const statusCounts = await Promise.all(
      statuses.map(async (status) => {
        const count = await Booking.count({ where: { Status: status, Date: {
          [Op.gte]: today,
        }, } });
        return { [status]: count };
      })
    );

    const response = Object.assign({}, ...statusCounts);
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking status data', error });
  }
};
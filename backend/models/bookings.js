const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const Booking = sequelize.define('Booking', {
    BookingID: {
        type: DataTypes.STRING(50),
        primaryKey: true
    },
    RoomID: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    UserID: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    Date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    StartTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
    EndTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
    Purpose: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    Status: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'Bookings',
    timestamps: true
});

module.exports = Booking;
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
    FacultyName: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    FacultyID: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    Date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    FromTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
    ToTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
    Purpose: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    ResourceNeeds: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    CourseCode:{
        type: DataTypes.STRING(50),
        allowNull: false
    },
    Status: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    UpdatedBy: {
        type: DataTypes.STRING(50),
        allowNull: true
    }
}, {
    tableName: 'Bookings',
    timestamps: true
});

module.exports = Booking;
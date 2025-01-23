const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import database connection

const Room = sequelize.define('Room', {
    RoomID: {
        type: DataTypes.STRING(50),
        primaryKey: true
    },
    Block: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    Type: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    Floor: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Capacity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    RoomInfo: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'Rooms',
    timestamps: true
});

module.exports = Room;

// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Adjust the path as needed

const User = sequelize.define('User', {
    faculty_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    faculty_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mail_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false
    },
    team: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'users', // Optional: Define the table name explicitly
    timestamps: true   // Optional: Disable timestamps (createdAt, updatedAt)
});

module.exports = User;
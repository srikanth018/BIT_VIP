// models/Conflict.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Adjust the path as needed

const Conflict = sequelize.define("Conflict", {
  FacultyName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  FacultyID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  CourseCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Purpose: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ResourceNeeds: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  FromTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  ToTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  RoomID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Status: {
    type: DataTypes.STRING,
    defaultValue: "Conflict",
  },
});

module.exports = Conflict;
// controllers/conflictController.js
const Conflict = require("../models/conflict");

exports.createConflict = async (req, res) => {
  try {
    const conflict = await Conflict.create(req.body);
    res.status(201).json(conflict);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getConflicts = async (req, res) => {
    try {
      const conflicts = await Conflict.findAll();
      res.status(200).json(conflicts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
const User = require("../models/user");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll(); // Sequelize method to fetch all users
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new user
exports.addUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body); // Sequelize method to create a new user
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
          return res.status(404).json({ error: "User not found" });
        }
        res.json({ user: updatedUser });
      } catch (error) {
        res.status(500).json({ error: "Internal server error" });
      }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    await User.destroy({
      where: { faculty_id: req.params.id }, // Delete based on primary key
    });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
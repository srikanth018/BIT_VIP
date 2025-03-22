// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Adjust the path to your User model
const bcrypt = require('bcrypt');

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by mail_id (not email)
        const user = await User.findOne({ where: { mail_id: email } }); // Use mail_id here
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare the provided password with the hashed password in the database
        // const isPasswordValid = await bcrypt.compare(password, user.password);
        if (password !== user.password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user.faculty_id, email: user.mail_id, role: user.role }, // Use mail_id here
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Return the token and user data (excluding the password)
        res.status(200).json({
            token,
            user: {
                id: user.faculty_id,
                email: user.mail_id, // Use mail_id here
                role: user.role,
                team: user.team,
                name: user.faculty_name
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


module.exports = { login };
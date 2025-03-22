// routes/authRouter.js
const express = require('express');
const router = express.Router();
const { login } = require('../../controllers/authController'); // Import the login function from the authController

// Login route
router.post('/login', login);

module.exports = router;
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors
const sequelize = require('./config/db');
const roomRoutes = require('./routes/v1/roomRoutes');
const bookingRoutes = require('./routes/v1/bookingsRoutes');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json());
app.use('/api', roomRoutes);
app.use('/api', bookingRoutes);



// Sync Database
sequelize.sync({ alter: true }) // Automatically create/alter tables based on models
    .then(() => console.log('Database synchronized'))
    .catch((err) => console.error('Error synchronizing database:', err));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
